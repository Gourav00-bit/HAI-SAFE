'use client';

import { useState, useEffect } from 'react';
import { DEMO_AUDIT_EVENTS } from '@/data/mockData';
import { AuditEvent } from '@/types';
import {
  Shield, Search, Filter, Clock, User, Activity,
  CheckCircle, AlertTriangle, Info
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { auditRepository } from '@/services/repositories';

const EVENT_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  patient_created: { icon: User, color: '#059669' },
  analysis_initiated: { icon: Activity, color: 'var(--teal-600)' },
  analysis_complete: { icon: CheckCircle, color: 'var(--teal-600)' },
  similar_cases_retrieved: { icon: User, color: '#6366F1' },
  evidence_retrieved: { icon: Shield, color: '#0284C7' },
  report_generated: { icon: Activity, color: 'var(--violet-600)' },
  doctor_review: { icon: Shield, color: '#059669' },
  data_accessed: { icon: Info, color: 'var(--gray-500)' },
  system_event: { icon: Clock, color: 'var(--gray-400)' },
};

const ACTOR_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  System: { bg: 'var(--gray-100)', text: 'var(--gray-600)' },
  Doctor: { bg: 'var(--violet-50)', text: 'var(--violet-600)' },
  User: { bg: 'var(--teal-50)', text: 'var(--teal-700)' },
};

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState('');
  const [actorFilter, setActorFilter] = useState<'all' | 'System' | 'Doctor' | 'User'>('all');

  useEffect(() => {
    auditRepository.findAll().then(setEvents);
  }, []);

  const filtered = events.filter((ev) => {
    const matchSearch =
      search === '' ||
      ev.action.toLowerCase().includes(search.toLowerCase()) ||
      ev.actor.toLowerCase().includes(search.toLowerCase()) ||
      ev.eventType.toLowerCase().includes(search.toLowerCase());
    const matchActor = actorFilter === 'all' || ev.actorType === actorFilter;
    return matchSearch && matchActor;
  });

  const systemEvents = events.filter((e) => e.actorType === 'System').length;
  const doctorEvents = events.filter((e) => e.actorType === 'Doctor').length;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
          Audit Trail
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--gray-500)', maxWidth: 600 }}>
          Immutable chronological log of all AI actions, data access, and doctor decisions.
          Supports regulatory compliance and clinical governance.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          { label: 'Total Events', value: events.length, color: 'var(--navy-700)' },
          { label: 'System Events', value: systemEvents, color: 'var(--teal-600)' },
          { label: 'Doctor Actions', value: doctorEvents, color: 'var(--violet-600)' },
          { label: 'Status: All OK', value: events.filter((e) => e.status === 'Success').length, color: '#059669' },
        ].map((stat) => (
          <div key={stat.label} className="clinical-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--gray-500)', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Compliance note */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--status-info-bg)',
          border: '1px solid #BAE6FD',
          borderRadius: 10,
          marginBottom: 20,
          fontSize: 13,
          color: '#0C4A6E',
          lineHeight: 1.5,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <Shield size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong>Audit Trail Compliance:</strong> All HAI-SAFE actions are logged with timestamps,
          actor identities, and status. In production, this trail would be cryptographically
          immutable to support regulatory compliance (e.g., NABH, CE-MDR, HIPAA).
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search
            size={14}
            color="var(--gray-400)"
            style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="clinical-input"
            style={{ paddingLeft: 32 }}
            placeholder="Search events, actors, actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="tab-nav">
          {(['all', 'System', 'Doctor', 'User'] as const).map((f) => (
            <button
              key={f}
              className={`tab-item ${actorFilter === f ? 'active' : ''}`}
              onClick={() => setActorFilter(f)}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Event List */}
      <div className="clinical-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr 110px 80px',
            gap: 16,
            padding: '10px 18px',
            background: 'var(--gray-50)',
            borderBottom: '1px solid var(--clinical-border)',
            fontSize: 10.5,
            fontWeight: 700,
            color: 'var(--gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          <span>Timestamp</span>
          <span>Action</span>
          <span>Actor</span>
          <span>Status</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>
            No events match the filter.
          </div>
        ) : (
          filtered.map((ev, i) => {
            const iconDef = EVENT_ICONS[ev.eventType] || EVENT_ICONS.system_event;
            const EvIcon = iconDef.icon;
            const actorColors = ACTOR_TYPE_COLORS[ev.actorType] || ACTOR_TYPE_COLORS.System;
            return (
              <div
                key={ev.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr 110px 80px',
                  gap: 16,
                  padding: '12px 18px',
                  borderBottom:
                    i < filtered.length - 1 ? '1px solid var(--clinical-border-light)' : 'none',
                  alignItems: 'flex-start',
                  background: i % 2 === 0 ? 'white' : 'var(--gray-50)',
                  transition: 'background 0.1s',
                }}
              >
                {/* Time */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy-800)', lineHeight: 1.3 }}>
                    {new Date(ev.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--gray-400)', marginTop: 2 }}>
                    {new Date(ev.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                </div>

                {/* Action */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: `${iconDef.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <EvIcon size={14} color={iconDef.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy-800)', lineHeight: 1.4 }}>
                      {ev.action}
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: 'var(--gray-400)',
                        marginTop: 2,
                        fontFamily: 'monospace',
                      }}
                    >
                      {ev.eventType}
                    </div>
                  </div>
                </div>

                {/* Actor */}
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      padding: '2px 7px',
                      borderRadius: 5,
                      fontSize: 11,
                      fontWeight: 700,
                      background: actorColors.bg,
                      color: actorColors.text,
                      marginBottom: 3,
                    }}
                  >
                    {ev.actorType}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.3 }}>
                    {ev.actor}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 7px',
                      borderRadius: 5,
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        ev.status === 'Success'
                          ? '#ECFDF5'
                          : ev.status === 'Pending'
                          ? '#FFFBEB'
                          : '#FEF2F2',
                      color:
                        ev.status === 'Success'
                          ? '#065F46'
                          : ev.status === 'Pending'
                          ? '#78350F'
                          : '#991B1B',
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background:
                          ev.status === 'Success'
                            ? '#059669'
                            : ev.status === 'Pending'
                            ? '#D97706'
                            : '#DC2626',
                        flexShrink: 0,
                      }}
                    />
                    {ev.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="clinical-disclaimer" style={{ marginTop: 16 }}>
        In this prototype, the audit trail is stored in memory and resets on page refresh. In production, this would be stored in a tamper-proof database with cryptographic signing.
      </div>
    </div>
  );
}
