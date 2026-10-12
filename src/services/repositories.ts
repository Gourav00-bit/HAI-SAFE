import {
  Patient,
  ClinicalAnalysis,
  SimilarPatient,
  TreatmentPattern,
  EvidenceSource,
  ClinicalReport,
  DoctorReview,
  AuditEvent,
  IPatientRepository,
  IClinicalAnalysisRepository,
  ISimilarPatientRepository,
  ITreatmentRepository,
  IEvidenceRepository,
  IReportRepository,
  IReviewRepository,
  IAuditRepository,
} from '@/types';
import {
  DEMO_PATIENT,
  DEMO_ANALYSIS,
  DEMO_REPORT,
  SIMILAR_PATIENTS,
  TREATMENT_PATTERNS,
  EVIDENCE_SOURCES,
  DEMO_AUDIT_EVENTS,
} from '@/data/mockData';
import { generateId } from '@/lib/utils';

// In-memory store
let patientsStore: Patient[] = [DEMO_PATIENT];
let analysisStore: ClinicalAnalysis[] = [DEMO_ANALYSIS];
let reportsStore: ClinicalReport[] = [DEMO_REPORT];
let reviewsStore: DoctorReview[] = [];
let auditStore: AuditEvent[] = [...DEMO_AUDIT_EVENTS];

// Delay simulation
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ============================================================
// MOCK PATIENT REPOSITORY
// ============================================================
export class MockPatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    await delay(100);
    return patientsStore.find((p) => p.demographics.id === id) ?? null;
  }

  async findAll(): Promise<Patient[]> {
    await delay(100);
    return [...patientsStore];
  }

  async create(patientData: Parameters<IPatientRepository['create']>[0]): Promise<Patient> {
    await delay(200);
    const newPatient: Patient = {
      ...patientData,
      demographics: {
        ...patientData.demographics,
        id: generateId('pt'),
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    };
    patientsStore.push(newPatient);
    return newPatient;
  }

  async update(id: string, updates: Partial<Patient>): Promise<Patient> {
    await delay(150);
    const index = patientsStore.findIndex((p) => p.demographics.id === id);
    if (index === -1) throw new Error('Patient not found');
    patientsStore[index] = {
      ...patientsStore[index],
      ...updates,
      demographics: {
        ...patientsStore[index].demographics,
        ...(updates.demographics || {}),
        lastUpdated: new Date().toISOString(),
      },
    };
    return patientsStore[index];
  }

  async search(query: string): Promise<Patient[]> {
    await delay(100);
    const q = query.toLowerCase();
    return patientsStore.filter(
      (p) =>
        p.demographics.name.toLowerCase().includes(q) ||
        p.demographics.patientId.toLowerCase().includes(q)
    );
  }
}

// ============================================================
// MOCK CLINICAL ANALYSIS REPOSITORY
// ============================================================
export class MockClinicalAnalysisRepository implements IClinicalAnalysisRepository {
  async findByPatientId(patientId: string): Promise<ClinicalAnalysis | null> {
    await delay(100);
    return analysisStore.find((a) => a.patientId === patientId) ?? null;
  }

  async create(analysisData: Omit<ClinicalAnalysis, 'id' | 'analysisDate'>): Promise<ClinicalAnalysis> {
    await delay(200);
    const newAnalysis: ClinicalAnalysis = {
      ...analysisData,
      id: generateId('analysis'),
      analysisDate: new Date().toISOString(),
    };
    analysisStore.push(newAnalysis);
    return newAnalysis;
  }

  async update(id: string, updates: Partial<ClinicalAnalysis>): Promise<ClinicalAnalysis> {
    await delay(150);
    const index = analysisStore.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Analysis not found');
    analysisStore[index] = { ...analysisStore[index], ...updates };
    return analysisStore[index];
  }
}

// ============================================================
// MOCK SIMILAR PATIENT REPOSITORY
// ============================================================
export class MockSimilarPatientRepository implements ISimilarPatientRepository {
  async findSimilarCases(patientId: string, limit: number = 5): Promise<SimilarPatient[]> {
    await delay(300);
    return [...SIMILAR_PATIENTS]
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }

  async findById(id: string): Promise<SimilarPatient | null> {
    await delay(100);
    return SIMILAR_PATIENTS.find((sp) => sp.id === id) ?? null;
  }

  async getAll(): Promise<SimilarPatient[]> {
    await delay(100);
    return [...SIMILAR_PATIENTS];
  }
}

// ============================================================
// MOCK TREATMENT REPOSITORY
// ============================================================
export class MockTreatmentRepository implements ITreatmentRepository {
  async findPatterns(): Promise<TreatmentPattern[]> {
    await delay(200);
    return [...TREATMENT_PATTERNS];
  }

  async findById(id: string): Promise<TreatmentPattern | null> {
    await delay(100);
    return TREATMENT_PATTERNS.find((tp) => tp.id === id) ?? null;
  }
}

// ============================================================
// MOCK EVIDENCE REPOSITORY
// ============================================================
export class MockEvidenceRepository implements IEvidenceRepository {
  async findForPatient(patientId: string): Promise<EvidenceSource[]> {
    await delay(250);
    // For demo, return all evidence sorted by relevance
    const order: Record<string, number> = { High: 0, Moderate: 1, Low: 2 };
    return [...EVIDENCE_SOURCES].sort((a, b) => (order[a.relevance] ?? 2) - (order[b.relevance] ?? 2));
  }

  async findById(id: string): Promise<EvidenceSource | null> {
    await delay(100);
    return EVIDENCE_SOURCES.find((ev) => ev.id === id) ?? null;
  }

  async getAll(): Promise<EvidenceSource[]> {
    await delay(100);
    return [...EVIDENCE_SOURCES];
  }
}

// ============================================================
// MOCK REPORT REPOSITORY
// ============================================================
export class MockReportRepository implements IReportRepository {
  async findByPatientId(patientId: string): Promise<ClinicalReport | null> {
    await delay(100);
    return reportsStore.find((r) => r.patientId === patientId) ?? null;
  }

  async create(reportData: Omit<ClinicalReport, 'id' | 'generatedAt'>): Promise<ClinicalReport> {
    await delay(200);
    const newReport: ClinicalReport = {
      ...reportData,
      id: generateId('report'),
      generatedAt: new Date().toISOString(),
    };
    reportsStore.push(newReport);
    return newReport;
  }

  async update(id: string, updates: Partial<ClinicalReport>): Promise<ClinicalReport> {
    await delay(150);
    const index = reportsStore.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Report not found');
    reportsStore[index] = { ...reportsStore[index], ...updates };
    return reportsStore[index];
  }
}

// ============================================================
// MOCK REVIEW REPOSITORY
// ============================================================
export class MockReviewRepository implements IReviewRepository {
  async findByReportId(reportId: string): Promise<DoctorReview | null> {
    await delay(100);
    return reviewsStore.find((r) => r.reportId === reportId) ?? null;
  }

  async create(reviewData: Omit<DoctorReview, 'id' | 'reviewedAt'>): Promise<DoctorReview> {
    await delay(200);
    const newReview: DoctorReview = {
      ...reviewData,
      id: generateId('review'),
      reviewedAt: new Date().toISOString(),
    };
    reviewsStore.push(newReview);
    return newReview;
  }

  async update(id: string, updates: Partial<DoctorReview>): Promise<DoctorReview> {
    await delay(150);
    const index = reviewsStore.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Review not found');
    reviewsStore[index] = { ...reviewsStore[index], ...updates };
    return reviewsStore[index];
  }
}

// ============================================================
// MOCK AUDIT REPOSITORY
// ============================================================
export class MockAuditRepository implements IAuditRepository {
  async findAll(): Promise<AuditEvent[]> {
    await delay(100);
    return [...auditStore].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async findByPatientId(patientId: string): Promise<AuditEvent[]> {
    await delay(100);
    return auditStore
      .filter((e) => e.patientId === patientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async create(eventData: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    await delay(50);
    const newEvent: AuditEvent = {
      ...eventData,
      id: generateId('audit'),
      timestamp: new Date().toISOString(),
    };
    auditStore.push(newEvent);
    return newEvent;
  }
}

// ============================================================
// SERVICE INSTANCES (Singleton-like)
// ============================================================
export const patientRepository = new MockPatientRepository();
export const analysisRepository = new MockClinicalAnalysisRepository();
export const similarPatientRepository = new MockSimilarPatientRepository();
export const treatmentRepository = new MockTreatmentRepository();
export const evidenceRepository = new MockEvidenceRepository();
export const reportRepository = new MockReportRepository();
export const reviewRepository = new MockReviewRepository();
export const auditRepository = new MockAuditRepository();

// Audit helper
export async function logAuditEvent(
  eventData: Omit<AuditEvent, 'id' | 'timestamp'>
): Promise<void> {
  await auditRepository.create(eventData);
}
