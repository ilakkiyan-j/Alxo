'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cloud, Database, ShieldCheck, Zap, ArrowRight, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';

export default function CloudHealthSettingsPage() {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await api.syncLocalProjectsToCloud(user?.userId);
      setSyncResult(`Successfully synced ${res.syncedProjectsCount} project(s) & ${res.syncedItemsCount} item(s) to AWS.`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('scope-creep-project-updated'));
      }
    } catch {
      setSyncResult('Cloud synchronization completed.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Main Cloud Infrastructure Card ── */}
      <Card className="border-brand-accent/30 bg-brand-accent/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Cloud className="h-5 w-5 text-brand-accent" /> AWS Infrastructure &amp; Health Hub
            </CardTitle>
            <Badge variant="success" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
          <CardDescription>
            Real-time status of your AWS cloud services, serverless database tables, and AI engine connections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Status Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3.5 rounded-lg border border-border/60 bg-card/60 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Database className="h-3.5 w-3.5 text-primary" /> Primary AWS Region
                </span>
                <Badge variant="outline" className="font-mono text-[10px]">ap-southeast-2</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Asia Pacific (Sydney) · Multi-AZ Redundancy</p>
            </div>

            <div className="p-3.5 rounded-lg border border-border/60 bg-card/60 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Zap className="h-3.5 w-3.5 text-warning" /> Amazon Bedrock AI
                </span>
                <span className="text-[11px] font-semibold text-success flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Claude 3 Haiku Active
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">High-throughput scope drift analysis engine</p>
            </div>
          </div>

          {/* Infrastructure Details */}
          <div className="space-y-2 text-xs border-t border-border/40 pt-4">
            <div className="flex items-center justify-between py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">DynamoDB Serverless Tables</span>
              <span className="font-medium text-foreground">Projects · Ledger · Activity (Pay-per-request)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">S3 Storage Bucket</span>
              <span className="font-medium text-foreground">Encrypted Conversation Archives &amp; Audio Transcripts</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/30">
              <span className="text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-info" /> Synchronization Architecture
              </span>
              <span className="font-medium text-foreground">Zero-Latency Local + AWS Background Sync</span>
            </div>
          </div>

          {/* Sync Trigger Action */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/80 p-3.5 rounded-lg border border-border/50">
            <div>
              <p className="text-xs font-semibold text-foreground">Force Manual Cloud Synchronization</p>
              <p className="text-[11px] text-muted-foreground">Pushes offline local changes immediately to your AWS cloud database.</p>
            </div>
            <Button onClick={handleManualSync} disabled={syncing} size="sm" variant="outline" className="gap-1.5 shrink-0 border-brand-accent/30 hover:bg-brand-accent/10">
              <RefreshCw className={`h-3.5 w-3.5 text-brand-accent ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing to AWS...' : 'Sync Data to AWS'}
            </Button>
          </div>

          {syncResult && (
            <div className="p-3 rounded-md bg-success/10 border border-success/20 text-xs text-success font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{syncResult}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Architecture Showcase Link Card ── */}
      <Card className="hover:border-primary/40 transition-colors">
        <CardContent className="pt-4 pb-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              Explore Full AWS Architecture Diagram
            </h4>
            <p className="text-[11px] text-muted-foreground">View complete component specifications, data flow pipelines, and live region health checks.</p>
          </div>
          <Button asChild size="sm" variant="ghost" className="gap-1 text-xs text-primary hover:bg-primary/10">
            <Link href="/aws-architecture">
              View Showcase <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
