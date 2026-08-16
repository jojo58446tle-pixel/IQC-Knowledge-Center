# IQC Knowledge Center

IQC Knowledge Center is a lightweight internal frontend for IQC teams to search and ask about SOP, WI, Document Master Lists, Material Codes, Monthly Reports, Incoming NG, Production NG, supplier issues, and inspection information.

Version 1 provides a complete responsive user interface and modular service boundaries. JOJO is not connected in this release, and no external AI service is called.

## Project overview

- Chat-first interface with quick question templates
- Reusable answer component for text, bullets, tables, material data, NG data, document data, and references
- Document list with search and category filters
- NG History with search, year, month, and type filters
- Settings UI prepared for JOJO API or JOJO Embed
- AI-first layout with an on-demand navigation drawer
- Desktop tables and mobile stacked record cards
- Keyboard-safe mobile viewport handling with a real, IME-aware textarea
- Loading, error, empty, missing-reference, and not-connected states
- Static frontend build with no Version 1 backend

## Technology

React, Vite, TypeScript, Tailwind CSS, and Lucide React.

## Installation

Requires Node.js 20.19 or later and npm.

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

The static production output is generated in `dist/` and can be hosted on Netlify, Cloudflare Pages, Vercel, or an internal static web server.

```bash
npm run preview
```

## Project structure

```text
src/
  components/
    chat/             AI answer, references, composer, empty state, and states
    common/           Shared UI components
    layout/           Header, drawer, connection status, and responsive shell
  data/               Clearly separated DEMO_DATA
  hooks/              Visual viewport handling for mobile keyboards
  pages/              Chat, Documents, NG History, Settings, About
  services/           AI, document, and NG History service boundaries
  types/              Shared TypeScript types
  utils/              Display utilities
  App.tsx
  main.tsx
  styles.css
```

## Demo data

All sample records live under `src/data/` and are explicitly marked **DEMO DATA ONLY** in source and UI. They are not production knowledge and must not be used for quality decisions. The sample Material Code response is a UI demonstration from the specification. No answer is generated when a user sends a new question in Version 1.

## Future JOJO AI integration

The UI calls only `src/services/aiService.ts`. In Version 1, `sendMessage(message)` always returns:

```ts
{
  success: false,
  configured: false,
  message: "Company AI connection is not configured yet."
}
```

Later, replace the service implementation with a call to a secure backend or serverless function. Do not call JOJO directly with secret credentials from the browser.

```text
User
  ↓
IQC Knowledge Web
  ↓
AI Service Layer
  ↓
JOJO Company AI API
  ↓
Company Knowledge Base
  ↓
SOP / WI / Master List / Monthly Report / NG History
```

### Security rule

- Never store App Keys, secrets, or tokens in frontend source.
- `VITE_*` variables are public after build and must contain only non-sensitive configuration.
- JOJO credentials must be stored in a backend or serverless-function environment.

## Service migration path

- Replace `aiService` with the approved JOJO server adapter.
- Replace `documentService` with the company document REST endpoint.
- Replace `ngHistoryService` with the approved NG History REST endpoint.
- Keep the page and component interfaces unchanged to minimize UI rework.
