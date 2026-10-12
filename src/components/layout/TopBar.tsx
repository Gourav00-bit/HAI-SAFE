'use client';

import { Bell, Menu, Search, ChevronRight, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const pageTitles: Record<string, string> = {
  '/workspace': 'Clinical Workspace',
  '/patients': 'Patients',
  '/patients/new': 'New Patient',
  '/analysis': 'Clinical Analysis',
  '/similar-cases': 'Similar Patient Intelligence',
  '/treatment': 'Treatment Intelligence',
  '/evidence': 'Evidence & Guidelines',
  '/reports': 'Clinical Reports',
  '/audit': 'Audit Trail',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { currentPatient, setSidebarOpen, notifications, markNotificationRead, unreadCount } =
    useApp();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  const title = pageTitles[pathname] || 'HAI-SAFE';

  return (
    <header className="topbar" role="banner">
      {/* Left: Mobile menu + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} color="var(--navy-700)" />
        </button>

        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--navy-900)',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </h1>
          {currentPatient && pathname !== '/' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11.5,
                color: 'var(--gray-500)',
                marginTop: 1,
              }}
            >
              <span>HAI-SAFE</span>
              <ChevronRight size={10} />
              <span>Breast Cancer Module</span>
              <ChevronRight size={10} />
              <span style={{ color: 'var(--teal-600)', fontWeight: 600 }}>
                {currentPatient.demographics.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Patient context pill (desktop) */}
      {currentPatient && pathname !== '/' && (
        <div
          className="hidden md:flex"
          style={{
            alignItems: 'center',
            gap: 10,
            padding: '5px 12px',
            background: 'var(--status-warning-bg)',
            border: '1px solid #FDE68A',
            borderRadius: 8,
            marginLeft: 16,
          }}
        >
          <AlertTriangle size={13} color="var(--status-warning)" />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#92400E' }}>
            SYNTHETIC DEMO PATIENT
          </span>
          <span
            style={{
              width: 1,
              height: 14,
              background: '#FDE68A',
              margin: '0 4px',
            }}
          />
          <span style={{ fontSize: 12, color: '#78350F', fontWeight: 500 }}>
            {currentPatient.demographics.name} · {currentPatient.demographics.age}F ·{' '}
            {currentPatient.demographics.menopausalStatus}
          </span>
        </div>
      )}

      {/* Right: Search + notifications + profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {/* Search */}
        <Link
          href="/patients"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'var(--gray-100)',
            borderRadius: 8,
            fontSize: 13,
            color: 'var(--gray-500)',
            textDecoration: 'none',
            border: '1px solid var(--clinical-border)',
          }}
          className="hidden sm:flex hover:bg-gray-200 transition-colors"
          aria-label="Search patients"
        >
          <Search size={14} />
          <span>Search patients...</span>
        </Link>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: 8,
              background: notifOpen ? 'var(--gray-100)' : 'transparent',
              border: '1px solid var(--clinical-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell size={16} color="var(--navy-600)" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  width: 16,
                  height: 16,
                  background: 'var(--status-error)',
                  borderRadius: '50%',
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 320,
                background: 'white',
                border: '1px solid var(--clinical-border)',
                borderRadius: 12,
                boxShadow: '0 10px 25px rgba(13,27,46,0.12)',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--clinical-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-800)' }}>
                  Notifications
                </span>
                <button
                  onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
                  style={{
                    fontSize: 11,
                    color: 'var(--teal-600)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div
                    style={{ padding: 20, textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}
                  >
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      style={{
                        padding: '11px 16px',
                        borderBottom: '1px solid var(--clinical-border-light)',
                        background: notif.read ? 'white' : 'var(--gray-50)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: notif.read
                            ? 'transparent'
                            : notif.type === 'warning'
                            ? 'var(--status-warning)'
                            : 'var(--status-info)',
                          flexShrink: 0,
                          marginTop: 5,
                        }}
                      />
                      <div>
                        <p style={{ fontSize: 12.5, color: 'var(--navy-800)', lineHeight: 1.4, margin: 0 }}>
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Doctor avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: 'white',
            cursor: 'pointer',
            border: '2px solid white',
            boxShadow: '0 1px 4px rgba(79,70,229,0.3)',
          }}
          title="Dr. Priya Anand"
        >
          PA
        </div>
      </div>
    </header>
  );
}
