'use client';

import Link from 'next/link';
import { Settings, Activity, Shield, Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy-900)', marginBottom: 4, letterSpacing: '-0.01em' }}>
        Settings
      </h1>
      <p style={{ fontSize: 13.5, color: 'var(--gray-500)', marginBottom: 28 }}>
        System settings and configuration for HAI-SAFE.
      </p>

      <div className="clinical-card" style={{ padding: '28px' }}>
        <div style={{ textAlign: 'center', padding: '32px 20px' }}>
          <Settings size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 8 }}>
            Settings Coming Soon
          </h2>
          <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
            This prototype focuses on demonstrating the clinical intelligence workflow.
            Settings and system configuration will be available in the production build.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link href="/workspace" className="btn-primary">
              <Activity size={15} />
              Clinical Workspace
            </Link>
            <Link href="/audit" className="btn-secondary">
              <Shield size={15} />
              Audit Trail
            </Link>
          </div>
        </div>
      </div>

      {/* Prototype info */}
      <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--clinical-border)', fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Info size={15} color="var(--status-info)" style={{ flexShrink: 0 }} />
          <div>
            <strong>HAI-SAFE Prototype v1.0</strong> — Built from scratch as a clinical AI decision support demonstration.
            All data is synthetic. No real patient data is used or stored.
          </div>
        </div>
      </div>
    </div>
  );
}
