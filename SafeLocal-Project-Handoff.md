# SafeLocal.ai — Project Handoff & Master Context

> **Purpose of this file.** This is the complete context document for the SafeLocal.ai website project. Hand it to any collaborator — or paste it into Claude as **Project Instructions / a `CLAUDE.md`** — and they can continue building with full knowledge of the brand, the design system, the personas, the SEO strategy, and the exact current state of the codebase. It is written in English for clean instruction-following, with Hebrew brand/compliance terms preserved verbatim where they matter.

_Last updated: 2026-06-24_

---

## 1. What SafeLocal.ai Is

SafeLocal.ai sells **localized, on-premise AI solutions** (desktop + dedicated appliance) to enterprises that want AI productivity **without** the data-leakage risk of public cloud LLMs. We solve the **"Cloud Privacy Dilemma"**: leadership and employees demand AI automation, but IT/Compliance blocks public tools (ChatGPT, Claude) because prompts and data leave the corporate network.

**The pitch in one line:** bring the model to your data, instead of sending your data to the model.

### Brand Core Messaging
- **Slogan:** *Your AI. Your Hardware. Completely Airtight.*
  (Hebrew: *ה-AI שלכם. החומרה שלכם. בטוח ומקומי לחלוטין.*)
- **Value proposition:** Deploy secure, on-premise AI automations that execute inside your local network. Zero data leakage. Total compliance. The ultimate enterprise alternative to public cloud LLMs.
- **Recurring proof points:** zero data egress by default, runs 100% on your hardware, SOC 2 ready / GDPR compliant / HIPAA aligned, air-gap ready, RBAC + immutable audit logs.

---

## 2. Brand Book / Design System

**Theme mandate: STRICT LIGHT MODE.** Clean, bright, ultra-professional corporate-tech aesthetic. **Never** generate dark or black page backgrounds. (Navy is used only for text, the problem/wedge bands, and table headers — not as the page canvas.)

### 2.1 Color Palette (exact, as implemented in CSS variables)

| Token (CSS var) | Hex | Use |
|---|---|---|
| `--navy` | `#031122` | Deep imperial navy — main headers, strong emphasis |
| `--navy-2` | `#0A192F` | Shield outlines, structural borders, table headers |
| `--green` | `#00B386` | Primary accent (Cyber Emerald / Mint) — buttons, branding dots |
| `--green-600` | `#009b73` | Hover / gradient end / link color |
| `--green-300` | `#34d6ab` | Gradient start |
| `--slate` | `#4A5568` | Body text, secondary labels |
| `--slate-400` | `#718096` | Muted labels |
| `--white` | `#FFFFFF` | Card backgrounds |
| `--canvas` | `#F8FAFC` | Page background (ultra-light gray) |
| `--border` | `#E8EDF3` | Default borders (border-slate-100 equivalent) |
| `--border-strong` | `#D7DEE8` | Stronger borders |
| Ambient glow | `rgba(0,179,134,0.04)` (`--glow`) / `0.07` (`--glow-2`) | Soft scattered radial background blurs |

**Primary CTA gradient:** `linear-gradient(135deg, #34d6ab 0%, #00B386 55%, #009b73 100%)` (CSS var `--gradient-green`).

### 2.2 Typography
- **English / Latin:** **Inter** (weights 400–800), loaded from Google Fonts.
- **Hebrew:** **Heebo** (weights 400–800). Hebrew pages set `:root { --font: "Heebo", "Inter", system-ui, sans-serif; }` inline in `<head>`.
- Headings: weight 800, tight letter-spacing (`-0.02em`), line-height ~1.15. Body 17px, line-height 1.65 (1.75 for RTL).

### 2.3 Components & Styling Rules
- **Corners:** slightly rounded — `--radius: 12px` (rounded-xl), `--radius-lg: 20px`, `--radius-sm: 8px`.
- **Cards:** white background, `1px` `--border` line, `--shadow-sm` drop shadow. Hover lifts `translateY(-4px)` with a slightly stronger shadow.
- **Buttons:** `.btn--primary` = green gradient + green glow shadow; `.btn--ghost` = white with strong border, green border on hover. `.btn--lg` for hero CTAs.
- **Ambient glows:** `.glow .glow--a / .glow--b` — large, blurred (`filter: blur(70px)`), very low-opacity green circles placed behind sections for a spacious high-end SaaS feel.
- **Eyebrow label:** uppercase, letter-spaced, green, preceded by a small green dot with a soft glow ring (`.eyebrow`).

### 2.4 Logo / Iconography — the Shield-Node motif
The brand mark is a **shield containing a network/AI node graph** with a central "AI" chip. It is the favicon, the nav logo, and the OG image centerpiece.
- `assets/img/shield-node.svg` — full-color shield (white fill, `#0A192F` outline, four `#00B386` cardinal nodes, navy diagonal ring nodes, center AI chip). 64×64 viewBox.
- `assets/img/shield-white.svg` — white version used inside the green submit button.
- Use the shield motif explicitly in layouts. Wordmark renders as `SafeLocal` (navy) + `.` (green) + `ai` (navy) via `.brand__word`.

---

## 3. Target Personas & Buyers

**The buyers (decision-makers):** IT Managers, CISOs, R&D Directors, Operations Managers, CEOs / Board.

**Their shared dilemma:** *"Employees and leadership demand AI tools to automate processes, but IT/Compliance blocks access due to data-privacy or client-confidentiality risk."*

**Vertical targets & use cases:**
- **Finance & Corporate** — credit-risk analysis, processing client habits/PII without cloud exposure. (CISO / risk manager audience.)
- **Legal (law firms)** — analysis of lawsuits, contracts, and transcripts while preserving attorney–client privilege (חיסיון עו"ד-לקוח).
- **Medical / Schools** — checking reports, processing internal data securely.

---

## 4. Product Solutions

- **Solution A — Per desktop:** a local, self-contained AI assistant installed on each employee workstation. Runs 100% locally/offline; nothing leaves the device. One-click Windows install (MSI).
- **Solution B — Office appliance:** a dedicated, high-performance secure AI hardware box deployed inside the company's private network, serving the whole team via the internal server with central management and access control.

**Both include:** runs on your hardware, everyday automations + chat, RBAC + audit logs, connectors to internal tools, one-click setup/updates, local-data GDPR-friendly posture.

**Killer feature — Secure External Enrichment (dual-loop):**
1. **Outer Loop (Anonymous Fetch):** queries public web sources through an identity-stripped egress proxy — no internal IDs, prompts, or CRM data leave.
2. **Inner Loop (Private Cross-Referencing):** sanitized public data piped one-way behind the firewall.
3. **Local Node (On-Premise Synthesis):** a local LLM merges public + confidential internal data to produce the output. 0% of internal data leaves the building.

---

## 5. SEO & AEO Strategy

**Core principle:** Google ranks **pages, not sites**. One landing page cannot rank for ~15 different keyword clusters — so we build **one dedicated page per search intent**.

### Keyword clusters
- **High-value intent:** `on-premise llm for enterprise`, `private ai automation infrastructure`, `self-hosted local ai for business`, `secure offline ai assistant`, `local llm data privacy compliance`.
- **High-volume / alternative traffic:** `offline ai assistant`, `local ai for windows`, `private ai locally`, `ai without internet`, `chatgpt offline alternative`, `run llm locally`, `local llm gui`.
- **"Vs" strategy:** dedicated comparison pages at `/vs/chatgpt` and `/vs/jeffyai`, positioning SafeLocal as superior in UI/UX, compliance, and enterprise scalability.

### AEO (Answer Engine Optimization)
Embed **structured data (JSON-LD)** on every page so Google AI and LLM crawlers can quote us:
- `SoftwareApplication` (the product), `FAQPage` (Q&A that mirrors visible FAQ copy), and `BreadcrumbList` on deep pages.
- Keep FAQ answer text in the schema **identical** to the on-page answer.

---

## 6. Israeli Market Localization (Hebrew)

Use these **precise regulatory terms** in Hebrew funnels (do not paraphrase):
- **Compliance law:** חוק הגנת הפרטיות ותקנות אבטחת מידע (תשע"ז)
- **Infrastructure:** התקנה מקומית / On-Premise
- **Legal privilege:** חיסיון עו"ד-לקוח (essential on the legal page)
- **Risk triggers:** זליגת מידע, דליפת נתונים, מאגר מידע רשום, PII

**Hebrew page structure & intent:**
- `/he/` — main Hebrew landing page; angle = reversing the internal corporate "ChatGPT ban."
- `/he/enterprise-privacy` — financial/corporate CISOs (credit-risk, מאגר מידע רשום, זליגת מידע).
- `/he/legal-ai` — law firms; focus on absolute localized data protection + חיסיון עו"ד-לקוח.

All Hebrew pages are RTL (`<html lang="he" dir="rtl">`) and use the Heebo font.

---

## 7. Tech Stack & Implementation Guidelines

- **Stated stack preference:** React, Next.js, Tailwind CSS. **Current implementation:** a fast, dependency-free **static HTML/CSS/vanilla-JS** site (no build step) that mirrors the brand kit precisely. If migrating to Next.js later, port the design tokens in `assets/css/styles.css` into Tailwind theme config and reuse the same component structure.
- **Scannability:** strong `h1/h2/h3` hierarchy, generous whitespace, crisp bulleted feature grids, bold `#00B386` gradient CTAs.
- **Every new page must include:** SEO `<title>` + meta description targeting one intent, `canonical`, `hreflang` where a translation exists, Open Graph + Twitter tags, and the JSON-LD schema set.

### Asset-path convention (important)
Pages live at different folder depths, so relative paths differ:
- Depth-1 pages (`/en/`, `/he/`) reference assets as `../assets/...`.
- Depth-2 pages (`/vs/chatgpt/`, `/he/legal-ai/`, etc.) reference assets as `../../assets/...`.
- `assets/js/main.js` auto-detects its own depth via `ASSET_BASE` (derived from the script's `src`), so the injected lead-form shield images work at any depth. **Keep loading the script with a relative `src` ending in `assets/js/main.js`.**

### Checklist to add a new landing page
1. Create `<folder>/index.html`; set correct relative asset depth.
2. Fill SEO head (title/description/canonical/hreflang/OG/Twitter).
3. Add `SoftwareApplication` + `FAQPage` (+ `BreadcrumbList` if nested) JSON-LD.
4. Reuse the header/footer markup and the existing CSS classes — do not invent new colors.
5. Add the URL to `sitemap.xml` and add an internal link from `/en/` or `/he/` (nav, footer, and/or contextual button) so it's crawlable.
6. RTL + Heebo for Hebrew pages.

---

## 8. Current Site Architecture (as built)

```
SafeLocal.ai/
├── index.html                      # Root: JS language redirect → /en/ or /he/ (noscript fallback links)
├── robots.txt                      # Allow all; points to sitemap
├── sitemap.xml                     # 7 URLs + hreflang alternates
├── og.png                          # 1200×630 social share card (brand shield + slogan)
├── en/
│   └── index.html                  # English homepage (hero, problem, 2 solutions, enrichment, comparison, pricing, security wedge, signup, FAQ)
├── he/
│   ├── index.html                  # Hebrew homepage (RTL) — "reverse the ChatGPT ban" angle
│   ├── legal-ai/index.html         # Hebrew law-firm funnel (חיסיון עו"ד-לקוח, תשע"ז, PII)
│   └── enterprise-privacy/index.html # Hebrew CISO/finance funnel (מאגר מידע רשום, סיכוני אשראי)
├── vs/
│   ├── chatgpt/index.html          # "Offline ChatGPT alternative" comparison page (EN)
│   └── jeffyai/index.html          # "Enterprise local AI vs DIY local LLM GUI" comparison (EN)
├── assets/
│   ├── css/styles.css              # Full brand stylesheet + design tokens (single source of truth)
│   ├── js/main.js                  # Vanilla JS: lang menu, mobile nav, FAQ accordion, year, header shadow, lead popover
│   ├── img/shield-node.svg         # Brand shield (favicon + logo)
│   ├── img/shield-white.svg        # White shield (submit button)
│   └── video/solution-desktop.mp4  # Solution-1 demo loop (~2.3 MB)
│       solution-appliance.mp4      # Solution-2 demo loop (~2.5 MB)
├── lead-to-sheet.gs                # Google Apps Script backend for the lead form
└── GOOGLE-SHEET-SETUP.md           # 3-minute setup guide for lead capture
```

**Shared page anatomy:** sticky blurred header w/ language switch → hero (headline + workbench mockup) → navy "problem" band → solutions/use-cases → tinted showcase/enrichment → comparison table → pricing → navy security "wedge" → signup CTA card → FAQ accordion → footer. CSS classes to reuse: `.hero`, `.mock`, `.problem`, `.solutions/.zig`, `.flow`, `.cmp`, `.plan`, `.wedge`, `.faq`, `.site-footer`, `.btn`, `.eyebrow`, `.glow`.

---

## 9. Lead Capture System

Every **Request a Demo / Get a quote / Talk to sales** button opens a popover form (name, email, phone) wired in `assets/js/main.js`. Submissions POST to a free **Google Apps Script** web app that appends a row to a Google Sheet named **"SafeLocal Leads"**.

- Row schema: `Timestamp · Name · Email · Phone · Language · Source · Page`.
- Backend code: `lead-to-sheet.gs`. Deploy it while signed in as **porshianboti@gmail.com** so the sheet lands on that account. Full steps in `GOOGLE-SHEET-SETUP.md`.
- **Activation step:** paste the deployed `/exec` URL into `LEAD_ENDPOINT` near the top of `assets/js/main.js`. Until then the form works visually and logs to the browser console (nothing is sent).
- Optional upgrade: add `MailApp.sendEmail(...)` inside `doPost` for instant email alerts on each lead.

---

## 10. Work Completed in This Session (SEO build-out)

Implemented recommendations **#1 (page-per-intent)** and **#2 (crawl/index foundation)**:
- Built 4 new pages: `/vs/chatgpt/`, `/vs/jeffyai/`, `/he/legal-ai/`, `/he/enterprise-privacy/` — full brand styling, schema, and lead popover.
- Added `sitemap.xml` (7 URLs + hreflang) and `robots.txt`.
- Generated `og.png` (1200×630) — fixes the previously-broken `og:image` 404 referenced sitewide.
- Added `BreadcrumbList` + `FAQPage` + `SoftwareApplication` JSON-LD to all new pages.
- Wired internal links from `/en/` and `/he/` (nav, footer, and contextual buttons under the comparison table) to the new pages.
- Made `main.js` asset paths depth-safe via `ASSET_BASE`.
- Verified: 16 JSON-LD blocks valid, all relative links resolve, sitemap well-formed.

---

## 11. Roadmap / Next Steps (not yet done)

**SEO recommendations #3–#5 remain:**
3. **Content depth for AEO** — a `/blog` or `/resources` hub with 6–12 articles targeting informational long-tail queries (e.g. "how to run an llm locally", "is local AI GDPR compliant", "חלופת ChatGPT לא מקוונת לעסקים"). Add `Article`/`HowTo` schema.
4. **Performance / Core Web Vitals** — the two homepage MP4s (~2.3–2.5 MB each, autoplay) hurt LCP/mobile. Add `poster` images, compress/lazy-load, preload fonts, `defer` JS, add descriptive `alt` text.
5. **Off-page authority / E-E-A-T** — real Organization entity (Google Business, LinkedIn, Crunchbase, consistent NAP), customer logos/case studies/testimonials, and listings/mentions in "local LLM" / "self-hosted AI" roundups, directories, awesome-lists, and r/LocalLLaMA.

**Other open items:**
- Set `LEAD_ENDPOINT` to go live with lead capture.
- Replace placeholder pricing ("Custom") with real tiers when ready.
- Consider the planned Next.js/Tailwind migration if a CMS or app features are needed.
- Add real social/contact links and a privacy policy page.

---

## 12. Guardrails for Any Contributor (human or AI)

- **Light mode only.** No dark/black backgrounds.
- **Use the exact palette and CSS tokens** above — never introduce off-brand colors.
- **One page = one search intent.** Don't stuff new keywords into existing pages; spin up a dedicated page.
- **Keep schema in sync with visible copy.** FAQ JSON-LD must match on-page text.
- **Hebrew pages:** RTL + Heebo + the exact regulatory terms in §6.
- **Trademarks:** ChatGPT/Claude/JeffyAI/Ollama are referenced for comparison only — keep the "trademarks of their respective owners" note on comparison pages.
- **Reuse components**, mind the asset-path depth, and add every new URL to `sitemap.xml` + an internal link.
