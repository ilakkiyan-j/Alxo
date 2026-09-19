'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wand2, FolderPlus, Sparkles, Layers } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_CURRENCY } from '@/lib/currency';
import { api, ApiError } from '@/lib/api';
import { recordActivity } from '@/lib/activity';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label, Textarea, Select, Badge } from '@/components/ui';
import { FileStaging, StagedFile, readStagedText } from '@/components/upload/FileStaging';
import { AnalysisProgress, AnalysisResult } from '@/components/analysis/AnalysisProgress';
import { RateInput } from '@/components/RateInput';
import type { Currency, FreelancerRole } from '@scope-creep-ledger/shared';

const PRESET_ROLES: { value: string; label: string }[] = [
  { value: 'web-dev', label: 'Web / Software Developer' },
  { value: 'ui-ux', label: 'UI/UX & Product Designer' },
  { value: 'full-stack', label: 'Full-Stack Developer' },
  { value: 'security', label: 'Cyber Security Engineer' },
  { value: 'devops', label: 'Cloud & DevOps Specialist' },
  { value: 'ai-engineer', label: 'AI & Machine Learning Engineer' },
  { value: 'mobile-dev', label: 'Mobile App Developer' },
  { value: 'copywriter', label: 'Copywriter & Content Strategist' },
  { value: 'video-editor', label: 'Video Editor & Motion Designer' },
  { value: 'consultant', label: 'Consultant / Marketer' },
  { value: 'custom', label: '✨ Custom Role...' },
];

export const BENCHMARK_SCENARIOS = [
  {
    id: 'scenario-1-ecommerce-store',
    title: 'Scenario 01: E-Commerce Storefront Redesign',
    folder: 'scenario-1-ecommerce-store',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-2-telehealth-mobile-app',
    title: 'Scenario 02: Telehealth MVP Mobile App',
    folder: 'scenario-2-telehealth-mobile-app',
    files: ['01-contract-scope-summary.txt', '02-whatsapp-feature-creeps.txt', '03-client-call-transcript.txt'],
  },
  {
    id: 'scenario-3-branding-marketing-website',
    title: 'Scenario 03: Corporate Branding & Marketing Website',
    folder: 'scenario-3-branding-marketing-website',
    files: ['01-signed-agreement-scope.txt', '02-email-revision-overload.txt', '03-slack-urgent-3d-request.txt'],
  },
  {
    id: 'scenario-4-saas-backend-api',
    title: 'Scenario 04: SaaS Backend & Billing API Integration',
    folder: 'scenario-4-saas-backend-api',
    files: ['01-api-architecture-baseline.txt', '02-slack-chat-graphql-sso-asks.txt', '03-jira-comments-microservices.txt'],
  },
  {
    id: 'scenario-5-edtech-quiz-app',
    title: 'Scenario 05: EdTech Learning Quiz App',
    folder: 'scenario-5-edtech-quiz-app',
    files: ['01-app-brief-baseline.txt', '02-whatsapp-ai-multiplayer-creep.txt', '03-email-admin-panel-demand.txt'],
  },
  {
    id: 'scenario-6-healthcare-portal',
    title: 'Scenario 06: Healthcare Patient Portal (HIPAA Compliance)',
    folder: 'scenario-6-healthcare-portal',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-7-real-estate-3d',
    title: 'Scenario 07: Real Estate 3D Virtual Tours (PropTech)',
    folder: 'scenario-7-real-estate-3d',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-8-ai-chatbot',
    title: 'Scenario 08: AI Chatbot Customer Support (RAG / LLM)',
    folder: 'scenario-8-ai-chatbot',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-9-fleet-logistics',
    title: 'Scenario 09: Logistics Fleet Management (IoT Telematics)',
    folder: 'scenario-9-fleet-logistics',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-10-cyber-security',
    title: 'Scenario 10: Cyber Security Penetration Testing',
    folder: 'scenario-10-cyber-security',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-11-event-ticketing',
    title: 'Scenario 11: Event Ticketing Web Application',
    folder: 'scenario-11-event-ticketing',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-12-hr-payroll',
    title: 'Scenario 12: HR Payroll Integration Pipeline',
    folder: 'scenario-12-hr-payroll',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-13-gaming-community',
    title: 'Scenario 13: Gaming Community Dashboard (Web3 / Esports)',
    folder: 'scenario-13-gaming-community',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-14-restaurant-pos',
    title: 'Scenario 14: Restaurant Point-of-Sale Ecosystem',
    folder: 'scenario-14-restaurant-pos',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
  {
    id: 'scenario-15-financial-analytics',
    title: 'Scenario 15: Financial Analytics & Portfolio Dashboard',
    folder: 'scenario-15-financial-analytics',
    files: ['01-baseline-sow-agreement.txt', '02-slack-chat-new-asks.txt', '03-email-followup-demands.txt'],
  },
];

type Phase = 'form' | 'running' | 'complete' | 'error';

export function NewProjectForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedRolePreset, setSelectedRolePreset] = useState<string>('web-dev');
  const [customRoleText, setCustomRoleText] = useState('');
  const [freelancerRole, setFreelancerRole] = useState<FreelancerRole>('web-dev');
  const [originalScope, setOriginalScope] = useState('');
  const [rate, setRate] = useState<number>(60);
  const [currency, setCurrency] = useState<Currency>(user?.defaultCurrency ?? DEFAULT_CURRENCY);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);

  const [phase, setPhase] = useState<Phase>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [loadingScenario, setLoadingScenario] = useState(false);

  const fileCount = stagedFiles.filter((f) => f.source === 'file').length;

  const loadSampleThread = async () => {
    setLoadingSample(true);
    try {
      const res = await fetch('/sample-whatsapp-redesign.txt');
      if (!res.ok) throw new Error('Could not load the sample thread.');
      const text = await res.text();
      setStagedFiles((prev) => [
        ...prev,
        {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: 'Sample thread (benchmark).txt',
          size: text.length,
          source: 'sample',
          text,
        },
      ]);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Could not load sample file.');
    } finally {
      setLoadingSample(false);
    }
  };

  const loadBenchmarkScenario = async (scenarioId: string) => {
    if (!scenarioId) return;
    const scenario = BENCHMARK_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setSelectedScenarioId(scenarioId);
    setLoadingScenario(true);
    setErrorMessage(null);

    try {
      // 1. Fetch scenario project details
      const detailsRes = await fetch(`/test-cases/${scenario.folder}/project-details.json`);
      if (detailsRes.ok) {
        const details = await detailsRes.json();
        setProjectName(details.projectName || '');
        setClientName(details.clientName || '');
        if (details.hourlyRate) setRate(Number(details.hourlyRate));
        if (details.currency) setCurrency(details.currency as Currency);
        if (details.originalScope) setOriginalScope(details.originalScope);

        // Resolve role: check if matching preset slug or label
        const roleStr = (details.role || '').trim();
        const matchingPreset = PRESET_ROLES.find(
          (r) =>
            r.value.toLowerCase() === roleStr.toLowerCase() ||
            r.label.toLowerCase().includes(roleStr.toLowerCase())
        );

        if (matchingPreset && matchingPreset.value !== 'custom') {
          setSelectedRolePreset(matchingPreset.value);
          setFreelancerRole(matchingPreset.value as FreelancerRole);
        } else {
          // Custom Role
          setSelectedRolePreset('custom');
          setCustomRoleText(roleStr || 'Specialist Consultant');
          setFreelancerRole(roleStr || 'Specialist Consultant');
        }
      }

      // 2. Fetch conversation files
      const loadedFiles: StagedFile[] = [];
      for (const fileName of scenario.files) {
        try {
          const fileRes = await fetch(`/test-cases/${scenario.folder}/${fileName}`);
          if (fileRes.ok) {
            const text = await fileRes.text();
            loadedFiles.push({
              id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: fileName,
              size: text.length,
              source: 'sample',
              text,
            });
          }
        } catch (err) {
          console.warn(`Could not load ${fileName}`, err);
        }
      }

      if (loadedFiles.length > 0) {
        setStagedFiles(loadedFiles);
      }
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Failed to load test case scenario.');
    } finally {
      setLoadingScenario(false);
    }
  };

  const handleRolePresetChange = (val: string) => {
    setSelectedRolePreset(val);
    if (val !== 'custom') {
      setFreelancerRole(val as FreelancerRole);
    } else {
      setFreelancerRole(customRoleText.trim() || 'Custom Consultant');
    }
  };

  const handleCustomRoleTextChange = (text: string) => {
    setCustomRoleText(text);
    setFreelancerRole(text.trim() || 'Custom Consultant');
  };

  const runAnalysis = async () => {
    // Build the raw conversation text only now that the user has confirmed.
    let rawText = '';
    try {
      rawText = await readStagedText(stagedFiles);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Could not read the selected files.');
      return;
    }
    if (!rawText.trim()) {
      setErrorMessage('Upload or paste at least one conversation file.');
      return;
    }
    if (!originalScope.trim()) {
      setErrorMessage('Describe your original scope before analyzing.');
      return;
    }

    setPhase('running');
    setErrorMessage(null);
    try {
      const response = await api.analyzeProject({
        projectName: projectName.trim() || 'Untitled Project',
        clientName: clientName.trim() || 'Client',
        freelancerRole,
        originalScope,
        hourlyRate: rate,
        currency,
        rawConversationText: rawText,
        userId: user?.userId,
      });

      recordActivity({
        type: 'analysis_completed',
        projectId: response.projectId,
        projectName: projectName.trim() || 'Untitled Project',
        message: `Analysis completed for "${projectName.trim() || 'Untitled Project'}"`,
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scope-creep-project-updated'));
      }

      setResult({
        totalScopeCreepItems: response.summary.totalScopeCreepItems,
        totalEstimatedHours: response.summary.totalEstimatedHours,
        totalEstimatedCost: response.summary.totalEstimatedCost,
        reviewRequiredCount: response.summary.reviewRequiredCount,
      });
      setProjectId(response.projectId);
      setPhase('complete');
    } catch (e) {
      setErrorMessage(e instanceof ApiError ? e.message : 'Analysis failed. Please try again.');
      setPhase('error');
    }
  };

  if (phase === 'running' || phase === 'complete' || phase === 'error') {
    return (
      <Card>
        <CardContent className="pt-6">
          <AnalysisProgress
            status={phase === 'error' ? 'error' : phase === 'complete' ? 'complete' : 'running'}
            result={result}
            error={errorMessage}
            projectName={projectName.trim() || 'your project'}
            onReview={
              phase === 'complete' && projectId
                ? () => router.push(`/app/projects/${projectId}/ledger`)
                : undefined
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle>Project details</CardTitle>
              <CardDescription>
                Baseline scope is locked in first. Conversation files are staged below and upload only
                after you confirm.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Quick Scenario Preset Loader */}
          <div className="rounded-xl border border-brand-accent/30 bg-card/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="benchmark-scenario-select" className="text-xs font-semibold text-brand-accent flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Load Benchmark Scenario (15 Pre-Configured Test Cases)
              </Label>
              {loadingScenario && (
                <span className="text-[10px] text-brand-accent animate-pulse font-medium">Loading scenario...</span>
              )}
            </div>
            <Select
              id="benchmark-scenario-select"
              value={selectedScenarioId}
              onChange={(e) => loadBenchmarkScenario(e.target.value)}
              disabled={loadingScenario}
              className="text-xs bg-background/80"
            >
              <option value="">-- Choose any of the 15 Benchmark Test Cases --</option>
              {BENCHMARK_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </Select>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Instantly fills project info, custom role, baseline agreement, and stages conversation files.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                required
                placeholder="Website Redesign"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-name">Client / company</Label>
              <Input
                id="client-name"
                required
                placeholder="Acme Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          </div>

          {/* Role Selection with Custom Role Option */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="freelancer-role">Your role</Label>
              {selectedRolePreset === 'custom' && (
                <Badge variant="outline" className="text-[10px] font-mono border-brand-accent/50 text-brand-accent">
                  <Sparkles className="h-2.5 w-2.5 mr-1" /> Custom Role Active
                </Badge>
              )}
            </div>
            <Select
              id="freelancer-role"
              value={selectedRolePreset}
              onChange={(e) => handleRolePresetChange(e.target.value)}
            >
              {PRESET_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>

            {/* Custom Role Text Input */}
            {selectedRolePreset === 'custom' && (
              <div className="pt-2 animate-in fade-in duration-200">
                <Label htmlFor="custom-role-input" className="text-xs text-muted-foreground">
                  Custom role title
                </Label>
                <Input
                  id="custom-role-input"
                  placeholder="e.g. Penetration Tester, Healthcare IT Specialist, Blockchain Engineer"
                  value={customRoleText}
                  onChange={(e) => handleCustomRoleTextChange(e.target.value)}
                  className="mt-1 border-brand-accent/40 focus-visible:ring-brand-accent"
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Amazon Bedrock Claude Haiku 4.5 tailors scope evaluation specifically to this custom role definition.
                </p>
              </div>
            )}
          </div>

          <RateInput
            rate={rate}
            onRateChange={setRate}
            currency={currency}
            onCurrencyChange={setCurrency}
          />

          <div className="space-y-1.5">
            <Label htmlFor="original-scope">Original baseline scope</Label>
            <Textarea
              id="original-scope"
              required
              rows={6}
              placeholder="What was agreed? List included deliverables, pages, revisions, and anything explicitly excluded (e.g., backend development, extra pages, mobile version)."
              value={originalScope}
              onChange={(e) => setOriginalScope(e.target.value)}
              className="font-mono text-xs leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation files</CardTitle>
          <CardDescription>
            Files stay in browser staging until you confirm the upload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileStaging files={stagedFiles} onChange={setStagedFiles} />

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={loadSampleThread}
            loading={loadingSample}
          >
            <Wand2 className="h-4 w-4" /> Load benchmark sample thread
          </Button>

          {errorMessage && (
            <div role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            {fileCount > 0 ? (
              <Button className="w-full" size="lg" onClick={runAnalysis}>
                <FolderPlus className="h-4 w-4" /> Upload &amp; Analyze {fileCount} File{fileCount === 1 ? '' : 's'}
              </Button>
            ) : stagedFiles.length > 0 ? (
              <Button className="w-full" size="lg" onClick={runAnalysis}>
                Analyze Sample Thread
              </Button>
            ) : (
              <Button className="w-full" size="lg" onClick={runAnalysis} disabled>
                Add conversation files to analyze
              </Button>
            )}
            <Badge variant="secondary" className="mt-3 w-full justify-center">
              {currency} · {rate ? `rate ${rate}` : 'no rate'} /hr · {freelancerRole || 'web-dev'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}