'use client';

import React, { useState } from 'react';
import { ListOrdered, Info, ArrowUpRight, CheckCircle2, Clock, TrendingUp, ShieldAlert, Check } from 'lucide-react';
import { useProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { MetricCard } from '@/components/MetricCard';
import { Badge, Button, EmptyState } from '@/components/ui';
import { LedgerItemCard } from '@/components/ledger/LedgerItemCard';
import { formatMoney } from '@/lib/currency';
import { PageHeader } from '@/components/PageHeader';
import { LedgerItem } from '@scope-creep-ledger/shared';

export default function LedgerPage() {
  const { project, ledgerItems, totals, verifyItem, verifyItems, rejectItem } = useProjectWorkspace();
  const [verifyingAll, setVerifyingAll] = useState(false);

  if (!project) return null;

  const items = [...(ledgerItems ?? [])];
  const reviewQueue = items.filter((it) => it.verificationStatus === 'review_required');
  const rest = items.filter((it) => it.verificationStatus !== 'review_required');

  const handleVerifyAll = async () => {
    if (reviewQueue.length === 0) return;
    const ids = reviewQueue.map((it) => it.id);
    setVerifyingAll(true);
    try {
      await verifyItems(ids, 'verify');
    } catch {
      /* ignore */
    } finally {
      setVerifyingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ledger"
        description="Every flagged request as an evidence-backed line item, ready to verify."
      />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Verified value"
          value={formatMoney(totals?.totalCost ?? 0, project.currency)}
          hint={`${totals?.totalHours ?? 0} hrs × ${formatMoney(project.hourlyRate, project.currency)}/hr`}
          tone="success"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          label="Verified time"
          value={`${totals?.totalHours ?? 0} hrs`}
          hint={`${totals?.verifiedCount ?? 0} verified billable item${totals?.verifiedCount === 1 ? '' : 's'}`}
          icon={<Clock className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          label="Review queue"
          value={totals?.reviewCount ?? 0}
          hint="Low-confidence items to verify"
          tone={totals?.reviewCount ? 'warning' : 'default'}
          icon={<ShieldAlert className="h-4 w-4 text-warning" />}
        />
        <MetricCard
          label="Rejected"
          value={totals?.rejectedCount ?? 0}
          hint="Skipped from totals"
        />
      </div>

      <div className="rounded-md bg-info/10 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
        <Info className="h-4 w-4 text-info shrink-0" />
        <span>
          Verified item hours are multiplied by the project rate in <strong className="text-foreground">deterministic code</strong> — zero
          AI arithmetic hallucination. Rejected items are excluded from totals.
        </span>
      </div>

      {reviewQueue.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Review Queue <Badge variant="warning">{reviewQueue.length}</Badge>
            </h2>
            <Button variant="success" size="sm" onClick={handleVerifyAll} disabled={verifyingAll}>
              <CheckCircle2 className={`h-3.5 w-3.5 ${verifyingAll ? 'animate-spin' : ''}`} />
              {verifyingAll ? 'Verifying All...' : `Verify All (${reviewQueue.length})`}
            </Button>
          </div>
          <div className="space-y-3">
            {reviewQueue.map((item, idx) => (
              <LedgerItemCard
                key={item.id}
                item={item}
                currency={project.currency}
                serial={idx}
                onVerify={verifyItem}
                onReject={rejectItem}
              />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">All flagged items</h2>
          <div className="space-y-3">
            {rest.map((item, idx) => (
              <LedgerItemCard
                key={item.id}
                item={item}
                currency={project.currency}
                serial={idx}
                onVerify={verifyItem}
                onReject={rejectItem}
              />
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <EmptyState
          icon={<ListOrdered className="h-6 w-6" />}
          title="No scope-creep items found"
          description="When out-of-scope requests are detected, they appear here with estimated hours and cost for your review."
        />
      )}
    </div>
  );
}