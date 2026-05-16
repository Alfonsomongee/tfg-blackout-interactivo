--- schemaVersion: 1 scope: workspace updatedAt: "2026-05-16T10:45:40.988Z" workspaceName: "Lectura de carpeta" ---
# Project Overview
The workspace supports a React-based web application titled "Lectura de carpeta", intended as an interactive reading or data exploration platform.

# Current State
- Project structure defined in App.tsx with React Router routes.
- Eight component files exist under components/ (AnimatedMetric, BackToTop, BlackStartTimeline, CascadaVisualization, CausalChain, ChapterDossier, CollapseCountdown, and others).
- No DESIGN.md file present; design system not yet defined.
- No design assets, brand references, or settings file.

# Artifacts
- App.tsx – main entry defining routes and component composition.
- components/AnimatedMetric/index.tsx – animated metric display component.
- components/BackToTop/index.tsx – back-to-top navigation button.
- components/BlackStartTimeline/index.tsx – initial timeline visualization.
- components/CascadaVisualization/index.tsx – cascade style visualization.
- components/CausalChain/index.tsx – causal chain diagram component.
- components/ChapterDossier/index.tsx – chapter dossier view.
- components/CollapseCountdown/index.tsx – countdown component with collapse behavior.

# Design Direction
High‑level direction focuses on a clean, modular React architecture:
- Use React 18 with functional components and hooks.
- Implement route‑level code splitting with lazy loading for heavy pages.
- Centralize navigation via React Router v6.
- Build reusable UI primitives (e.g., AnimatedMetric, BackToTop) that can be promoted to the design system.
- Aim for responsive layout with accessible components.

# User Feedback
User requests to read the project and likely expects a clear overview of the current structure and next steps for design system creation.

# Decisions
- Adopt React and React Router as the primary front‑end stack.
- Lazy‑load page components to improve initial load performance.
- Keep component responsibilities focused; each component handles a single UI concern.

# Open Questions
- What visual style and branding should be applied to the components?
- Are there specific accessibility or performance targets?
- Should a design system (tokens, components) be created now or later?

# Next Steps
1. Review remaining component files to assess reuse potential.
2. Draft a minimal DESIGN.md outlining visual tokens, component hierarchy, and design principles.
3. Identify stable visual decisions from components (e.g., AnimatedMetric, BackToTop) for promotion to DESIGN.md.
4. Set up a design system scaffold (tokens, base components) if branding is defined.

# Promotion Candidates For DESIGN.md
- AnimatedMetric – stable animated metric component.
- BackToTop – reusable navigation aid.
- CollapseCountdown – consistent countdown UI pattern.

# Recent History
- 2026‑05‑16: Initial workspace inspection; App.tsx examined, revealing route structure and component layout. No prior design artifacts.