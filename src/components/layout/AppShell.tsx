'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <TopBar />
        <main
          style={{
            flex: 1,
            padding: '28px',
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
