'use client';

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Info,
  Mail,
  Download,
  ExternalLink,
  DollarSign,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Columns,
  ListOrdered,
  Eye,
  Edit3,
  ShieldCheck,
} from 'lucide-react';
import { useProjectWorkspace } from '@/components/project/ProjectWorkspace';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { recordActivity } from '@/lib/activity';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Textarea,
  EmptyState,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui';
import { formatMoney } from '@/lib/currency';
import { PageHeader } from '@/components/PageHeader';
import { ChangeOrderResponse, LedgerItem } from '@scope-creep-ledger/shared';
import { cn } from '@/lib/utils';

type ViewMode = 'email' | 'itemized' | 'split';

export default function ChangeOrdersPage() {
  const { project, ledgerItems } = useProjectWorkspace();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ChangeOrderResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [showCustomNote, setShowCustomNote] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editableEmailBody, setEditableEmailBody] = useState('');

  if (!project) return null;

  const verifiedItems = (ledgerItems ?? []).filter((i: LedgerItem) => i.verificationStatus === 'verified');
  const excludedCount = (ledgerItems ?? []).length - verifiedItems.length;

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateChangeOrder({
        projectId: project.id,
        userId: user?.userId,
        customNote: customNote,
        fallbackProject: project,
        fallbackLedgerItems: ledgerItems ?? undefined,
      });
      setResponse(res);
      setEditableEmailBody(res.emailBody);
      recordActivity({
        type: 'change_order_generated',
        message: `Generated Change Order for ${project.name}: ${formatMoney(res.totalCost, project.currency)} (${res.totalHours} hrs)`,
        projectId: project.id,
        projectName: project.name,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate change order.');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    if (!response) return;
    const bodyToCopy = isEditingEmail ? editableEmailBody : response.emailBody;
    const text = `Subject: ${response.emailSubject}\n\n${bodyToCopy}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const copySubject = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response.emailSubject);
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const downloadTextFile = () => {
    if (!response) return;
    const bodyToSave = isEditingEmail ? editableEmailBody : response.emailBody;
    const content = `SUBJECT: ${response.emailSubject}\nPROJECT: ${project.name}\nCLIENT: ${project.clientName}\nTOTAL RECOVERY: ${formatMoney(response.totalCost, project.currency)} (${response.totalHours} hrs)\n\n---\n\n${bodyToSave}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Change_Order_${project.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openMailClient = () => {
    if (!response) return;
    const bodyToMail = isEditingEmail ? editableEmailBody : response.emailBody;
    const mailto = `mailto:?subject=${encodeURIComponent(response.emailSubject)}&body=${encodeURIComponent(bodyToMail)}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Order Studio"
        description="Compile verified out-of-scope line items into an executive client change order."
      />

      {verifiedItems.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No verified items to include"
          description="Verify scope items in the Ledger tab first. Only verified items are included in the change order."
        />
      ) : (
        <div className="space-y-6 animate-fade-up">
          {/* ── Top Generator Bar ── */}
          <Card className="border-border/70 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="font-semibold">
                      {verifiedItems.length} Verified Item{verifiedItems.length === 1 ? '' : 's'}
                    </Badge>
                    {excludedCount > 0 && (
                      <Badge variant="secondary" className="text-muted-foreground">
                        {excludedCount} Excluded
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      • Base Rate: {formatMoney(project.hourlyRate, project.currency)}/hr
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deterministic compiler strictly includes verified client scope additions with transparent evidence receipts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomNote(!showCustomNote)}
                    className="text-xs gap-1.5"
                  >
                    {showCustomNote ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {showCustomNote ? 'Hide Custom Note' : 'Add Custom Note'}
                  </Button>
                  <Button
                    loading={loading}
                    onClick={generate}
                    className="gap-2 shadow-sm font-semibold"
                  >
                    <Sparkles className="h-4 w-4" />
                    {response ? 'Regenerate Change Order' : 'Generate Change Order'}
                  </Button>
                </div>
              </div>

              {/* Collapsible custom note input */}
              {showCustomNote && (
                <div className="space-y-1.5 pt-3 border-t border-border/50 animate-fade-in">
                  <label htmlFor="customNote" className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Custom Opening / Closing Note to Client</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Appended directly into the compiled email body</span>
                  </label>
                  <Textarea
                    id="customNote"
                    rows={2}
                    placeholder="e.g. Please review by Friday so we can keep the scheduled deployment timeline on track."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="text-xs bg-background/80"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Generated Change Order Studio ── */}
          {response && (
            <div className="space-y-5 animate-fade-in">
              {/* ── Top Executive KPI Metrics Bar ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 shadow-xs">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Unbilled Recovery</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMoney(response.totalCost || 0, project.currency)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-xs">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Verified Hours</p>
                      <p className="text-lg font-bold text-foreground">
                        {response.totalHours || 0} hrs
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-xs">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Line Items</p>
                      <p className="text-lg font-bold text-foreground">
                        {response.itemizedSummary?.length || verifiedItems.length} items
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-xs">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Deterministic Rate</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatMoney(project.hourlyRate, project.currency)}/hr
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ── View Controls & Quick Actions ── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1 p-1 bg-muted/60 border border-border/60 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode('email')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      viewMode === 'email'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email Dispatch View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('itemized')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      viewMode === 'itemized'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                    <span>Itemized Scope Ledger</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    className={cn(
                      'hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      viewMode === 'split'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Columns className="h-3.5 w-3.5" />
                    <span>Split View</span>
                  </button>
                </div>

                {/* Dispatch Action Toolbar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant={copied ? 'success' : 'primary'}
                    size="sm"
                    onClick={copyEmail}
                    className="gap-1.5 text-xs font-medium shadow-xs"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied to Clipboard' : 'Copy Full Email'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTextFile}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export .txt</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openMailClient}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open in Mail</span>
                  </Button>
                </div>
              </div>

              {/* ── Active View Rendering ── */}
              {viewMode === 'email' && (
                <div className="animate-fade-in">
                  <EmailClientCard
                    project={project}
                    response={response}
                    user={user}
                    copiedSubject={copiedSubject}
                    copySubject={copySubject}
                    isEditing={isEditingEmail}
                    setIsEditing={setIsEditingEmail}
                    editableBody={editableEmailBody}
                    setEditableBody={setEditableEmailBody}
                  />
                </div>
              )}

              {viewMode === 'itemized' && (
                <div className="animate-fade-in">
                  <ItemizedLedgerCard project={project} response={response} />
                </div>
              )}

              {viewMode === 'split' && (
                <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
                  <EmailClientCard
                    project={project}
                    response={response}
                    user={user}
                    copiedSubject={copiedSubject}
                    copySubject={copySubject}
                    isEditing={isEditingEmail}
                    setIsEditing={setIsEditingEmail}
                    editableBody={editableEmailBody}
                    setEditableBody={setEditableEmailBody}
                    compact
                  />
                  <ItemizedLedgerCard project={project} response={response} compact />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 📧 Executive Email Client Preview Card
 * ───────────────────────────────────────────────────────── */
function EmailClientCard({
  project,
  response,
  user,
  copiedSubject,
  copySubject,
  isEditing,
  setIsEditing,
  editableBody,
  setEditableBody,
  compact = false,
}: {
  project: any;
  response: ChangeOrderResponse;
  user: any;
  copiedSubject: boolean;
  copySubject: () => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  editableBody: string;
  setEditableBody: (v: string) => void;
  compact?: boolean;
}) {
  const senderEmail = user?.email || 'freelancer@scopecreep.io';
  const senderName = user?.name || 'Lead Consultant';
  const clientEmail = `${project.clientName.toLowerCase().replace(/\s+/g, '.')}@client.com`;

  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      {/* Email Client Header Window */}
      <div className="border-b border-border/60 bg-muted/40 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-danger/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-warning/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-success/80 inline-block" />
            <h2 className="text-xs font-semibold text-muted-foreground ml-2 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> Change Order Email
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border',
                isEditing
                  ? 'bg-primary text-primary-foreground border-transparent'
                  : 'bg-background text-muted-foreground hover:text-foreground border-border/60'
              )}
            >
              {isEditing ? <Eye className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
              <span>{isEditing ? 'Preview Mode' : 'Edit Text'}</span>
            </button>
          </div>
        </div>

        {/* Header Envelope Fields */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-14 font-semibold text-foreground/80">From:</span>
            <span className="font-mono text-foreground/90">{senderName} &lt;{senderEmail}&gt;</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-14 font-semibold text-foreground/80">To:</span>
            <span className="font-mono text-foreground/90">{project.clientName} &lt;{clientEmail}&gt;</span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-14 font-semibold text-foreground/80 shrink-0">Subject:</span>
              <span className="font-semibold text-foreground truncate">{response.emailSubject}</span>
            </div>
            <button
              type="button"
              onClick={copySubject}
              className="text-[11px] text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              {copiedSubject ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              {copiedSubject ? 'Copied' : 'Copy Subject'}
            </button>
          </div>
        </div>
      </div>

      {/* Email Body Pane */}
      <CardContent className="p-5 space-y-4">
        {isEditing ? (
          <Textarea
            value={editableBody}
            onChange={(e) => setEditableBody(e.target.value)}
            className="font-mono text-xs leading-relaxed min-h-[420px] p-4 rounded-xl bg-muted/20 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 text-foreground resize-y shadow-inner"
            aria-label="Editable Email Body"
          />
        ) : (
          <div className={cn(
            "p-6 rounded-xl bg-card border border-border/50 text-foreground font-sans text-xs leading-relaxed shadow-xs space-y-4 overflow-y-auto whitespace-pre-line",
            compact ? "max-h-[460px]" : "min-h-[380px]"
          )}>
            <div className="font-mono text-[13px] text-foreground/90 leading-relaxed">
              {editableBody || response.emailBody}
            </div>
          </div>
        )}

        {/* Deterministic Verification Stamp */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>Deterministic Math: zero LLM arithmetic hallucination</span>
          </div>
          <div className="font-mono font-semibold text-primary">
            {response.totalHours || 0} hrs × {formatMoney(project.hourlyRate, project.currency)}/hr = {formatMoney(response.totalCost, project.currency)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────
 * 📋 Itemized Scope Ledger Table & Receipts
 * ───────────────────────────────────────────────────────── */
function ItemizedLedgerCard({
  project,
  response,
  compact = false,
}: {
  project: any;
  response: ChangeOrderResponse;
  compact?: boolean;
}) {
  const items = response.itemizedSummary || [];

  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ListOrdered className="h-4 w-4 text-primary" /> Itemized Scope Receipt
            </CardTitle>
            <CardDescription className="text-xs">
              Audit-ready breakdown of every verified out-of-scope requirement.
            </CardDescription>
          </div>
          <Badge variant="success" className="font-mono text-xs">
            Total: {formatMoney(response.totalCost || 0, project.currency)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className={cn("overflow-x-auto", compact ? "max-h-[500px]" : "")}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12 text-center text-xs">#</TableHead>
                <TableHead className="text-xs">Requirement / Deliverable</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Detected Date</TableHead>
                <TableHead className="text-right text-xs">Hours</TableHead>
                <TableHead className="text-right text-xs">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="text-foreground font-medium text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">{row.title}</p>
                      <p className="text-[11px] text-muted-foreground">Out of baseline contract scope</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap font-mono">
                    {row.date || 'Detected'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-foreground font-semibold">
                    +{row.hours}h
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-success text-xs whitespace-nowrap">
                    {formatMoney(row.cost || 0, project.currency)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Calculation Row */}
              <TableRow className="bg-muted/40 font-bold border-t-2 border-border/80">
                <TableCell colSpan={3} className="text-right text-foreground text-xs uppercase tracking-wider">
                  Total Additional Recovery:
                </TableCell>
                <TableCell className="text-right font-mono text-foreground text-xs">
                  {response.totalHours || 0} hrs
                </TableCell>
                <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">
                  {formatMoney(response.totalCost || 0, project.currency)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Breakdown Guarantee Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-success" />
            Verified against SOW baseline exclusions
          </span>
          <span className="font-mono text-[11px]">
            {items.length} line items compiled
          </span>
        </div>
      </CardContent>
    </Card>
  );
}