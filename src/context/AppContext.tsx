'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Patient, AppState, Notification } from '@/types';
import { DEMO_PATIENT } from '@/data/mockData';
import { generateId } from '@/lib/utils';

interface AppContextType extends AppState {
  setCurrentPatient: (patient: Patient | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setAnalysisStatus: (status: AppState['analysisStatus']) => void;
  setSelectedCaseId: (id: string | null) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(DEMO_PATIENT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AppState['analysisStatus']>('idle');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-001',
      type: 'warning',
      message: 'Demo patient Tara Mehta has 8 missing data items flagged.',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 'notif-002',
      type: 'info',
      message: 'Clinical analysis complete. Doctor review pending.',
      timestamp: new Date().toISOString(),
      read: false,
    },
  ]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: Notification = {
        ...notification,
        id: generateId('notif'),
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentPatient,
        sidebarOpen,
        analysisStatus,
        selectedCaseId,
        setCurrentPatient,
        setSidebarOpen,
        setAnalysisStatus,
        setSelectedCaseId,
        notifications,
        addNotification,
        markNotificationRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
