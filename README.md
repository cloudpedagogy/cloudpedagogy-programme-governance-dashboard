# Programme Governance Dashboard

## 1. Project Description
The **Programme Governance Dashboard** is a local-first, lightweight analytics tool designed to help academic institutions visualize structural risks, curriculum coherence, and governance compliance across their degree programmes. Built for speed and privacy, it interprets standard educational definitions (programmes, modules, outcomes, and assessments) to immediately surface actionable mapping defects before they impact faculty productivity and student experiences.

📘 **New to the system?** Please refer to the comprehensive [User Manual](USER_MANUAL.md) for detailed step-by-step instructions on navigating the dashboard, interpreting AI oversight signals, and tracking curriculum snapshots.

---

## 🌐 Live Hosted Version
👉 [http://cloudpedagogy-programme-governance-dashboard.s3-website.eu-west-2.amazonaws.com/](http://cloudpedagogy-programme-governance-dashboard.s3-website.eu-west-2.amazonaws.com/)

## 🖼️ Screenshot
(*Please insert relevant screenshot image path here*)

This screenshot shows the fully rendered Programme Governance Dashboard using the demo dataset included in this repository.

The demo allows users to explore system-level curriculum structure and governance visibility, including:
- Relationships between programmes, modules, outcomes, and assessments
- Identification of duplication, imbalance, and structural gaps
- Governance metadata and alignment indicators
- Snapshot comparison of curriculum states (e.g. before/after redesign)
- Local-first, privacy-preserving interaction (no backend or data transmission)

The demonstration uses entirely synthetic data and represents a fictional multi-programme curriculum environment designed to illustrate governance-aware analysis and system-level insight.

---

## 2. Key Features
- **Deterministic Analytics Engine:** Automated logic that detects highly shared modules, unassessed outcomes, and over-concentrated curriculum traps natively.
- **Programme Comparison Matrix:** Instantly stack up to 3 distinct programmes side-by-side to contrast structural metrics and governance completion.
- **Assessment Load Clustering:** Identifies scheduling clash risks (e.g., excessive student assessment volume) aggregated tightly within specific weekly intervals.
- **Interactive Drill-Down Inspection:** Accessible overlay panels that reveal the exact native raw data or missing metadata, ensuring the audit logic is completely transparent.
- **Historical Snapshot Trends:** Dedicated scenario tracking that lets you permanently save a structural version of your curriculum and visibly compare live variance (Deltas +/-) when testing hypothetical module revisions.
- **Defensive Error Interception:** Resilient, non-blocking integrity checks that intercept and flag orphaned data relationships (like missing module references) without crashing the interface.

## 3. Example Use Cases
- **Academic Leadership:** Instantly assess the degree of "shared module" reliance across intersecting degrees, accurately measuring true operational/teaching efficiency.
- **Quality Assurance (QA) Teams:** Audit missing or misaligned Learning Outcomes before official review cycles submit inaccurate matrices to external accreditors/regulators.
- **Programme Redesign Committees:** Experimentally load hypothetical module mappings and capture state "Snapshots" to determine if a curriculum restructure truly improves assessment distribution compared against foundational baselines.

## 4. Architecture
- **Local-First Processing:** The dashboard maps data actively against the machine's localized cache variable (`localStorage`).
- **Zero Backend Required:** Utterly decoupled from external databases or API servers, making it deeply secure for sensitive, unapproved, or proprietary curriculum definitions.
- **Static Deployability:** Entirely serverless architecture. The React application strictly compiles to static assets meaning it can be securely hosted anywhere with zero maintenance.

## 5. Installation Instructions
Ensure you have [Node.js](https://nodejs.org/) installed, then execute the following steps within your terminal:

1. Clone or download the repository to your local directory.
2. Install standard dependencies:
   ```bash
   npm install
   ```
3. Run the live local development server:
   ```bash
   npm run dev
   ```
4. Perform strict type checking and build compiling testing:
   ```bash
   npm run build
   ```

## 6. Deployment Instructions
Because the dashboard relies on a zero backend structure natively supported by Vite, you can statically host it universally.
1. Run the target compilation build:
   ```bash
   npm run build
   ```
2. The output directory (`/dist`) will contain the finalized optimized HTML, JavaScript, and CSS nodes.
3. Simply drag or upload the `/dist` folder directly to your provider of choice (e.g., **GitHub Pages, Netlify, Vercel, AWS S3**, or practically any standard internal campus webhost bucket).

## 7. Data Model Overview
The localized data engine mathematically normalizes four mapping vectors:
- **Programmes:** Container hierarchies aggregating overarching descriptions and timestamped metadata states.
- **Modules:** The fundamental teaching payload blocks processing precise credit weights. These map rotationally to Programmes allowing heavy structural scaling analytics.
- **Outcomes & Assessments:** Granular pedagogical interactions. Outcomes attach sequentially to Modules, while Assessments map to Outcomes, resolving pure alignment density algorithms.
- **Governance Metadata:** Scalar checklist indices embedded directly against Modules verifying explicit documentation execution natively tracking administrative hurdles.

## 8. Governance Disclaimer
> **IMPORTANT NOTE ON INTERPRETATION**
> These metrics are interpretive structural indicators designed strictly to surface quantitative mapping gaps algorithmically. They are **NOT compliance scores** (i.e. 'Pass/Fail'). A 50% curriculum integration mark does not inherently mean a critically defective curriculum, but serves as a mechanical flag. They **DO NOT** replace professional faculty judgement, qualitative audits, or deeply contextual institutional decision-making.

## 9. Roadmap (v1.1 Improvements)
- **JSON Payload Engine:** Allowing explicit `.json` file exports and imports directly into the UI, breaking the dependence on strict `localStorage` bounding across singular devices.
- **Printable Executive Summary:** A one-click PDF abstraction generator stripping away UI buttons and compiling your Overview metrics and Analytics Insight flags into a clean letterhead format suitable for QA board review meetings.
- **Visual "Traffic Light" Heatmaps:** Augmenting standard data-tables to automatically color-grade week intervals, violently accelerating institutional visual digestion formatting.
