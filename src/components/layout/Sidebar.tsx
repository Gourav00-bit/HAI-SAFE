'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Microscope,
  GitCompare,
  Pill,
  BookOpen,
  FileText,
  Shield,
  Settings,
  UserCircle,
  X,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { href: '/workspace', label: 'Overview', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/analysis', label: 'Clinical Analysis', icon: Microscope },
  { href: '/similar-cases', label: 'Similar Patients', icon: GitCompare },
  { href: '/treatment', label: 'Treatment Intelligence', icon: Pill },
  { href: '/evidence', label: 'Evidence & Guidelines', icon: BookOpen },
  { href: '/reports', label: 'Clinical Reports', icon: FileText },
  { href: '/audit', label: 'Audit Trail', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #0EA898 0%, #0B8A7A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Activity size={20} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  HAI-SAFE
                </div>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', fontWeight: 500, lineHeight: 1.2 }}>
                  Clinical Co-Pilot
                </div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded text-white/50 hover:text-white/80"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Module label */}
        <div className="px-5 pt-5 pb-2">
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
            }}
          >
            Breast Cancer Module
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pb-4 overflow-y-auto" style={{ paddingTop: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/workspace' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom profile & settings */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 8px' }}>
          <div
            className="sidebar-nav-item"
            role="button"
            tabIndex={0}
            style={{ cursor: 'default', marginBottom: 2 }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}
            >
              PA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
                Dr. Priya Anand
              </div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.2 }}>
                Medical Oncologist
              </div>
            </div>
          </div>
          <Link href="/settings" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
            <Settings size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
