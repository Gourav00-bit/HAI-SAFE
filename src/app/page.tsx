'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Shield, Users, BookOpen, FileText, ChevronRight, AlertTriangle, Microscope, GitCompare, Pill } from 'lucide-react';

const workflowSteps = [
  { icon: Users, label: 'Patient Data', desc: 'Structured intake' },
  { icon: Microscope, label: 'AI Analysis', desc: 'Clinical analysis' },
  { icon: GitCompare, label: 'Similar Cases', desc: 'Historical context' },
  { icon: BookOpen, label: 'Evidence', desc: 'Guidelines' },
  { icon: Pill, label: 'Treatment Patterns', desc: 'Pattern analysis' },
  { icon: FileText, label: 'Doctor Review', desc: 'Final decision' },
];

const pillars = [
  {
    icon: Activity,
    title: 'AI Assists',
    description: 'Structured clinical intelligence surfaces risk flags, similar cases, and relevant evidence.',
    color: '#0EA898',
  },
  {
    icon: BookOpen,
    title: 'Evidence Supports',
    description: 'Insights grounded in NCCN, ESMO, ICMR and peer-reviewed clinical research.',
    color: '#6366F1',
  },
  {
    icon: Shield,
    title: 'Doctor Decides',
    description: 'The clinician reviews all reasoning, evidence and uncertainty before every decision.',
    color: '#0B8A7A',
  },
];

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--clinical-white)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(250,251,252,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--clinical-border)',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'linear-gradient(135deg, #0EA898 0%, #0B8A7A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: 'var(--navy-900)',
                  letterSpacing: '-0.01em',
                }}
              >
                HAI-SAFE
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--gray-500)',
                  marginLeft: 8,
                  fontWeight: 400,
                }}
                className="hidden sm:inline"
              >
                Human-AI Intelligence for Safer Clinical Decisions
              </span>
            </div>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href="/workspace"
              className="btn-primary"
              style={{ fontSize: 13, padding: '7px 16px' }}
            >
              Open Clinical Workspace
              <ChevronRight size={14} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '80px 40px 60px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Demo badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 600,
              color: '#92400E',
              letterSpacing: '0.04em',
            }}
          >
            <AlertTriangle size={11} />
            SYNTHETIC DEMO — Breast Cancer Module
          </div>
        </div>

        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 58px)',
              fontWeight: 800,
              color: 'var(--navy-900)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: 24,
            }}
          >
            Human-AI Intelligence
            <br />
            <span style={{ color: 'var(--teal-600)' }}>for Safer Clinical Decisions</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: 'var(--gray-600)',
              lineHeight: 1.6,
              marginBottom: 36,
              maxWidth: 620,
              margin: '0 auto 36px',
            }}
          >
            Transform fragmented clinical information into explainable, evidence-backed decision
            support. AI assists. Evidence supports. Doctor decides.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/workspace" className="btn-primary" style={{ fontSize: 15, padding: '12px 24px' }}>
              <Activity size={18} />
              Open Clinical Workspace
              <ArrowRight size={16} />
            </Link>
            <Link href="/patients" className="btn-secondary" style={{ fontSize: 15, padding: '12px 24px' }}>
              Explore Workflow
            </Link>
          </div>

          {/* Trust statement */}
          <div
            style={{
              marginTop: 32,
              padding: '12px 20px',
              background: 'var(--status-info-bg)',
              border: '1px solid #BAE6FD',
              borderRadius: 10,
              borderLeft: '3px solid var(--status-info)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#0C4A6E',
              maxWidth: 560,
            }}
          >
            <Shield size={15} style={{ flexShrink: 0 }} />
            <span>
              <strong>AI assists the clinician.</strong> Final clinical decisions remain with the
              licensed physician and multidisciplinary team.
            </span>
          </div>
        </div>
      </section>

      {/* Workflow Visual */}
      <section
        style={{
          padding: '40px 40px',
          background: 'white',
          borderTop: '1px solid var(--clinical-border)',
          borderBottom: '1px solid var(--clinical-border)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p
            style={{
              textAlign: 'center',
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--gray-400)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            Clinical Intelligence Workflow
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
              flexWrap: 'nowrap',
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 16px',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background:
                          index === workflowSteps.length - 1
                            ? 'linear-gradient(135deg, #6366F1, #4F46E5)'
                            : 'linear-gradient(135deg, var(--teal-500), var(--teal-600))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(14,168,152,0.25)',
                      }}
                    >
                      <Icon size={22} color="white" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--navy-800)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.label}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 2px' }}>
                      <ChevronRight size={18} color="var(--gray-300)" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section style={{ padding: '64px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--gray-400)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Core Product Principle
          </p>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: 'var(--navy-900)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Built around human-in-the-loop clinical care
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="clinical-card" style={{ padding: '28px 24px' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${pillar.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Icon size={24} color={pillar.color} />
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    marginBottom: 10,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Differentiator */}
      <section
        style={{
          padding: '48px 40px',
          background: 'var(--navy-900)',
          margin: '0',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            The HAI-SAFE Innovation
          </p>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
              marginBottom: 20,
            }}
          >
            &ldquo;HAI-SAFE connects the current patient with relevant historical cases, treatment
            patterns and trusted clinical evidence, then exposes the reasoning and uncertainty so
            that the doctor can independently review the basis of the analysis.&rdquo;
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            Not just prediction. Explainable clinical intelligence for safer doctor decisions.
          </p>
          <Link
            href="/workspace"
            className="btn-primary"
            style={{ fontSize: 15, padding: '12px 24px' }}
          >
            Open Clinical Workspace
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '24px 40px',
          borderTop: '1px solid var(--clinical-border)',
          background: 'white',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="var(--teal-600)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-800)' }}>HAI-SAFE</span>
            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
              Clinical Decision Intelligence
            </span>
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: 'var(--gray-400)',
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span>Prototype · Synthetic Demo Data Only</span>
            <span>·</span>
            <span>AI-assisted analysis · Not a medical device</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
