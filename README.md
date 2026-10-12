# HAI-SAFE — Human-AI Intelligence for Safer Clinical Decisions

> **Prototype · Synthetic Demo Data Only · Not a Medical Device**

HAI-SAFE is a production-quality clinical AI decision-support prototype that transforms fragmented patient information into explainable, evidence-backed clinical intelligence — designed to support doctors, not replace them.
gut
---

## Core Principle

```
AI ASSISTS.  EVIDENCE SUPPORTS.  DOCTOR DECIDES.
```

HAI-SAFE is built around a strict human-in-the-loop philosophy. Every AI-generated insight is explainable, every source is attributed, every uncertainty is disclosed, and every final clinical decision belongs to the licensed physician.

---

## Features

### Clinical Workspace
- Patient context bar with demo data warning
- Risk flag summary (HIGH / MODERATE / LOW / INFORMATIONAL)
- Missing information tracker
- Analysis processing status
- AI confidence + uncertainty display
- Quick navigation to all workflow stages

### Patient Management
- Patient list with search and selection
- Detailed patient view — demographics, symptoms, biomarkers, family history, documents
- 7-step multi-section new patient intake form:
  - Patient Info · Symptoms · Medical History · Family History · Diagnostics · Biomarkers · Documents
- Drag-and-drop document upload (demo records)

### Clinical Analysis
- Staged AI processing pipeline with live step-by-step animation
- Key Findings with expandable "Why This Matters" reasoning
- Risk Flags with clinical implications and action required
- Missing Information tracking
- AI Reasoning — knowns, unknowns, confidence level
- Evidence attribution for every finding

### Similar Patient Intelligence
- Similarity scoring across 5 historical cases (cancer subtype, stage, biomarkers, age, family history)
- Filterable by similarity score, clinical stage, biomarker match
- Expandable row detail + full case detail modal
- Outcome history (Complete Response / Partial / Stable / Progressive / Recurrence)

### Treatment Intelligence
- Historical treatment patterns observed across similar cases
- Outcome bars: Complete · Partial · Stable · Progressive · Recurrence
- Typical treatment timelines and evidence context
- NOT a prescribing interface — patterns are clinical context only

### Evidence and Guidelines
- Structured evidence from NCCN, ESMO, ICMR, EBCTCG, Phase III trials
- Evidence Level I–IV classification
- High / Moderate / Low relevance filtering
- Clinical factors matched to current patient

### Clinical Report
- Complete structured intelligence report
- Patient Summary · Clinical Context · Key Findings · Risk Flags
- Missing Data · Similar Case Evidence · Treatment Patterns · Guideline Evidence
- AI Reasoning (Knowns and Unknowns) · Clinical Considerations
- Doctor Review status · Printable and downloadable (plain text)

### Doctor Review
- Human-in-the-loop decision gate — required before clinical action
- Review decisions: Approve · Approve with Edits · Needs More Information · Reject
- Doctor comment and clinical override fields
- Logged to immutable audit trail

### Audit Trail
- Chronological log of all AI actions, data access, and doctor decisions
- Actor type filter: System · Doctor · User
- Full-text search across events and actions
- Compliance-ready design (NABH / CE-MDR / HIPAA aligned)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Vanilla CSS with CSS custom properties |
| Icons | Lucide React |
| State | React Context API |
| Data | In-memory mock repositories (repository pattern) |
| Fonts | Inter (Google Fonts, via layout head) |

---

## Project Structure

```
hai-safe/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout + metadata
│   │   ├── globals.css                 # Full clinical design system
│   │   └── (workspace)/               # App route group (with sidebar)
│   │       ├── layout.tsx              # AppShell wrapper
│   │       ├── workspace/page.tsx      # Clinical workspace dashboard
│   │       ├── patients/
│   │       │   ├── page.tsx            # Patient list + detail
│   │       │   └── new/page.tsx        # Patient intake form
│   │       ├── analysis/page.tsx       # Clinical analysis + staging
│   │       ├── similar-cases/page.tsx  # Similar patient intelligence
│   │       ├── treatment/page.tsx      # Treatment intelligence
│   │       ├── evidence/page.tsx       # Evidence and guidelines
│   │       ├── reports/page.tsx        # Clinical report
│   │       ├── review/page.tsx         # Doctor review
│   │       ├── audit/page.tsx          # Audit trail
│   │       └── settings/page.tsx       # Settings
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx             # Clinical navigation sidebar
│   │       ├── TopBar.tsx              # Top bar + notifications
│   │       └── AppShell.tsx            # Layout shell
│   ├── context/
│   │   └── AppContext.tsx              # Global app state + notifications
│   ├── data/
│   │   └── mockData.ts                 # Synthetic breast cancer demo dataset
│   ├── services/
│   │   └── repositories.ts             # Mock repository implementations
│   ├── types/
│   │   └── index.ts                    # Full clinical domain type definitions
│   └── lib/
│       └── utils.ts                    # Utility functions + color helpers
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
# Navigate to the project directory
cd "hai-safe"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

Go to [http://localhost:3000/workspace](http://localhost:3000/workspace) to open the clinical workspace directly.

---

## Demo Workflow

Follow this sequence to experience the full clinical AI workflow:

1. **`/`** — Landing page: product overview and workflow visualization
2. **`/workspace`** — Clinical workspace: patient context, risk flags, quick actions
3. **`/patients`** — Patient list: view demo patient Tara Mehta's full profile
4. **`/analysis`** — Click **"Analyze Clinical Case"** to run the staged AI analysis pipeline
5. **`/similar-cases`** — Browse 5 similar historical patients with similarity scoring
6. **`/treatment`** — Explore treatment patterns observed across similar cases
7. **`/evidence`** — Review NCCN/ESMO/ICMR evidence matched to the current patient
8. **`/reports`** — View the full structured clinical intelligence report
9. **`/review`** — Doctor makes the final review decision (approve / edit / reject)
10. **`/audit`** — View the immutable chronological audit trail

---

## Demo Patient

All data is **100% synthetic** and generated solely for demonstration purposes.

| Field | Value |
|-------|-------|
| Name | Tara Mehta (synthetic) |
| Age | 52 years |
| Sex | Female |
| Menopausal Status | Postmenopausal |
| Cancer Subtype | Luminal A — ER+/PR+/HER2– |
| Clinical Stage | Stage IIA |
| ER / PR / HER2 | Positive / Positive / Negative |
| Ki67 | 12% |
| Review Status | Pending Review |

---

## Design System

The clinical design system is fully defined in `src/app/globals.css`:

- **Color palette**: Clinical navy (`#0D1B2E`) + teal accent (`#0EA898`) + status colors
- **Typography**: Inter (300–800 weight) via Google Fonts
- **Components**: `.clinical-card`, `.btn-primary`, `.btn-secondary`, `.badge-demo`, `.badge-ai`, `.badge-evidence`, `.clinical-disclaimer`, `.clinical-input`, `.clinical-select`, `.clinical-textarea`, `.sidebar`, `.topbar`, `.tab-nav`, `.evidence-card`, `.upload-zone`
- **Responsive**: Mobile sidebar overlay, responsive workspace grid

---

## Service Architecture (Firebase-Ready)

The service layer uses a **repository pattern** with clean interface abstractions in `src/types/index.ts`. Each repository interface (`IPatientRepository`, `IClinicalAnalysisRepository`, etc.) can be swapped from mock implementations to Firebase/Firestore without changing any UI code.

```
UI Components
     |
AppContext (state)
     |
Repository Interfaces (IPatientRepository, IClinicalAnalysisRepository, ...)
     |
Mock Implementations  <--swap for-->  Firebase / Real AI APIs
```

---

## Important Disclaimers

- **This is a prototype.** All patient data is synthetic and generated for demonstration only.
- **Not a medical device.** HAI-SAFE is not approved for clinical use.
- **AI does not diagnose.** Every AI output requires clinician review before any clinical action.
- **Demo only.** Data resets on page refresh. No data is persisted to any database.

---

## Module

**Breast Cancer** — Demonstrating the full clinical intelligence workflow for breast cancer cases.
Additional disease modules can be added using the same architecture.

---

## License

This project is a prototype built for demonstration and evaluation purposes.
