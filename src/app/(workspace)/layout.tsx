import AppShell from '@/components/layout/AppShell';
import { AppProvider } from '@/context/AppContext';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
