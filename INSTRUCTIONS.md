# Programme Governance Dashboard — User Instructions

---
### 2. What This Tool Does
This dashboard provides a unified, high-level overview of curriculum health and alignment signals. It aggregates structural data to highlight areas of risk, such as unassessed learning outcomes or misalignment with mandatory professional skills.

---
### 3. Role in the Ecosystem
- **Phase:** Phase 1 — Curriculum Spine
- **Role:** High-level overview of curriculum health and oversight signals.
- **Reference:** [../SYSTEM_OVERVIEW.md](../SYSTEM_OVERVIEW.md)

---
### 4. When to Use This Tool
- When conducting an academic quality review or program validation.
- When you need a quick, color-coded health summary (RAG rating) of the entire curriculum spine.
- When identifying systemic gaps across multiple modules.

---
### 5. Inputs
- Requires curriculum alignment data (JSON format) containing modules, outcomes, and assessment mappings.

---
### 6. How to Use (Step-by-Step)
1. Load the programme dataset into the application.
2. Review the overall "Governance Completeness" score in the main summary cockpit.
3. Check the color-coded RAG (Red/Amber/Green) module health indicators for immediate critical risks.
4. Drill down into specific "Red" modules to view detailed explanations for the flags (e.g., zero assessed outcomes).
5. Switch to the Skill Coverage view to ensure comprehensive coverage of professional competency requirements.

---
### 7. Key Outputs
- A high-level RAG-status report identifying structurally healthy vs. highly volatile modules.
- Clear summaries of capability gaps and coverage deficits.

---
### 8. How It Connects to Other Tools
- **Upstream:** Consumes data constructed in the **Curriculum Alignment Mapping Engine**.
- **Downstream:** The insights highlighted here can inform strategic updates in the Phase 2 Governance Pipeline.

---
### 9. Limitations
- It evaluates the *presence* of structural connections (e.g., "is learning outcome X assessed?"), but cannot judge the *quality* of the assessment itself.
- Relies entirely on the accuracy and completeness of the imported curriculum schema.

---
### 10. Tips
- Use the quick "Why is this Red/Amber" tooltips provided next to problematic modules to jumpstart your investigation.
