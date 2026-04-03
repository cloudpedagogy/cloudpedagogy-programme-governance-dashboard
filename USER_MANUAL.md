# Programme Governance Dashboard: User Guide

Welcome to the **Programme Governance Dashboard**, a lightweight analytics platform designed to visualize structural risks, curriculum coherence, and governance checks across your educational programmes. 

Because this application is **local-first** and completely **serverless**, your data never leaves your browser cache. This assures total privacy for unapproved, draft, or sensitive internal curriculum blueprints.

---

## 1. Getting Started

When you first open the dashboard in your browser, you will be met with a blank screen indicating no data is loaded.

*   **Load Demo Data:** Click the blue `Load Demo Data` button in the top action bar. This will inject a pre-configured synthetic dataset representing 3 distinct degree programmes into your browser cache, instantly populating all metrics and insights so you can learn the dashboard.
*   **Reset Local State:** Click the red `Reset Local State` button to purge your cache. This completely wipes all active data and snapshots from your current session. Use this when you want to clear out experiments.

---

## 2. Navigating the Views

Use the horizontal navigation tabs below the header to dynamically switch contexts. Each tab is dedicated to exploring a focused educational metric without clutter.

### Overview Panel
Your home screen. It aggregates your core KPIs (e.g., *Module Reuse Rate*) and structural counts (e.g., *Number of Shared Modules*) at the top.
*   **Analytics Overview:** Highlights top-level lists (Top Shared Modules, Overloaded Weeks) that require highest-priority institutional attention.
*   **Governance Insights (Right Panel):** A smart scanner natively highlighting severe governance holes or scheduling limits via visual severity tags (`INFO`, `ATTENTION`, `CONCERN`). 
*   **AI Governance Signals:** Displays your footprint relating to curriculum work that utilized AI, scoring your oversight traceability.

> [!TIP]
> Anywhere you see blue, underlined text (like a module code or week number), click it to summon the **Detail Panel**.

### Programme Comparison
Select up to **three checkboxes** to pull distinct programmes into a side-by-side matrix. The system will slice the dataset and calculate the unique internal health geometry (e.g. Unassessed Outcomes, Weak Governance Completeness) localized strictly to *only* those selected programmes, allowing you to instantly determine which degree needs the most focus.

### Module Reuse
A full roster of your teaching payload. Modules are ranked based on how many separate programmes structurally rely on them. Highly shared core modules (e.g. "Intro to Programming" serving 3 different degrees) will rise to the top, signaling efficient teaching deployment.

### Outcome Alignment
Evaluates pedagogical mapping. You can instantly see if a Learning Outcome was authored but **never mapped to a module** (an orphaned objective) or **never mapped to an assessment** (unverified learning). 

### Assessment Load
Groups all structural assessments against timeline buckets (Weeks 1 through 52). Used exclusively for spotting curriculum congestion (e.g., four major essays all landing in Week 7). The dashboard will automatically label weeks hosting 3 or more assessments universally as `High Risk`.

### Governance Completeness
A module audit checklist tracing internal completeness. Modules sorting to the top of this list are structurally "weak"—meaning administrative documentation (e.g., mapping clarity, aligned evidence, outcomes explicitly written out) has not been completed.

### AI Governance
Tracks records of AI usage (e.g., drafting outcomes, structuring module feedback). Instead of policing compliance, this list transparently logs what happened and scores it cleanly based on whether **human review was recorded**, **source materials were checked**, and **human-accountable names were listed**.

### Snapshot Trends & Comparisons
When editing large curriculum states, you can capture isolated moments to test theories:
1.  Click `Save Snapshot` in the top action bar to capture the current mathematical baseline. Give it a descriptive name like "Pre-Redesign v1".
2.  Navigate to the `Snapshot Trends` tab.
3.  Select that snapshot from the dropdown to automatically render a highly detailed **Delta Visualization (+/-)**. This confirms mathematically whether your proposed restructure improved the metrics (green) or hurt them (red).

### Methodology
If you ever forget how a metric was formulated, open this tab. It clearly identifies exactly *how* a score is mathematically tallied, and most importantly, *what it does not mean* (to prevent institutional abuse of metrics).

---

## 3. Working with Insights and the Detail Panel

The dashboard avoids heavy navigation menus by keeping everything on one screen.

Any structural vulnerability flagged in the **Overview -> Insights Panel** (e.g., "Curriculum Gap: Outcome out-14 has no aligned assessments") contains a `View Details` action. Clicking this opens the slide-out **Detail Drawer**.

This side-drawer breaks down precisely why the warning tripped. For a module, it will list the explicit governance checklists lacking ticks. For an outcome, it will expose its exact missing parent mapping structures. Using this drawer allows you to inspect raw contexts without losing your place in the wider dashboard overview.

> [!IMPORTANT]
> **Data Integrity Warnings**: If your uploaded dataset references IDs that don't exist (e.g., mapping an assessment to `"module-99"` which isn't defined), a yellow banner will drop down from the top of the interface natively warning you. The system **does not crash**; you can continue working, but it highlights exactly which mapping lines are broken.
