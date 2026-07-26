# Practical Tool Lab — 90-Day Development Plan

## Product direction

Build a local-first API and operations debugging workspace, not a generic collection of unrelated tools.

Core promise:

- Paste sensitive data once.
- Chain several useful transformations.
- Diagnose problems, not only convert formats.
- Keep inputs and saved workflows on the user's device.

## Phase 1 — Connected tools (Weeks 1–3)

Goal: turn separate tools into one coherent product.

Deliverables:

- Workbench with JSON, Base64, and URL operation chains.
- Local workflow persistence.
- Send results from JSON Formatter into Workbench.
- Add transfers from Base64, URL, JWT, and JSON-to-CSV tools.
- Add operation reordering and duplicate-step warnings.
- Add recent tools and recent workflows stored locally.
- Track Workbench starts, completed transformations, and tool-to-tool transitions.

Exit criteria:

- At least five existing tools can send data into Workbench.
- A user can complete a multi-step workflow without manual copy/paste.
- No tool input is transmitted to the server.

## Phase 2 — Diagnosis layer (Weeks 4–6)

Goal: provide answers competitors' basic converters do not.

Deliverables:

- JSON error explanations and safe common-error repair suggestions.
- JSON Path search and value extraction.
- JSON to TypeScript and JSON Schema generation.
- JWT expiry, claims, and security diagnostics.
- Nginx error-pattern and suspicious-traffic detection.
- Ready-to-run workflow recipes for common API and operations tasks.

Exit criteria:

- Each flagship tool explains at least one class of error.
- Workbench includes at least eight useful operations.
- Five real task recipes are indexable and launch directly into the relevant workflow.

## Phase 3 — Retention and distribution (Weeks 7–10)

Goal: give users a reason to return and share the product.

Deliverables:

- Named local recipes and import/export.
- Offline-ready PWA.
- Shareable recipe links that contain configuration but never user input.
- GitHub repository with selected reusable components or recipes.
- Embeddable JSON Formatter widget.
- Ten original task guides based on real examples and troubleshooting.

Exit criteria:

- Saved recipes work across repeat sessions.
- Offline use works for the core Workbench.
- A recipe can be shared without exposing source data.

## Phase 4 — Monetization validation (Weeks 11–13)

Goal: test willingness to pay without weakening the free product.

Free:

- Local tools and Workbench.
- Basic local recipes.
- Normal-size files.

Potential Pro:

- Cross-device workflow sync.
- Large-file and batch processing.
- Team recipe libraries.
- Workflow version history.
- API access and advanced exports.

Validation work:

- Add a non-blocking “Pro interest” page.
- Interview or survey repeat users.
- Measure interest before building authentication or billing.
- Do not add display advertising until traffic is large enough to justify the UX cost.

## Weekly product metrics

- Search Console impressions and clicks.
- Indexed pages and indexing failures.
- Real visits and page views from Web Analytics.
- Workbench starts.
- Successful workflow completions.
- Tool-to-Workbench transition rate.
- Returning visitor rate.
- Most-used operations and recipes.
- Client-side error rate and Core Web Vitals.

## Prioritization rule

Build work in this order:

1. Removes repeated copy/paste.
2. Helps diagnose a real API or operations problem.
3. Creates a repeat-use workflow.
4. Produces original, indexable value.
5. Adds another standalone converter only when demand is proven.
