# IQC Knowledge Center

IQC Knowledge Center is an internal frontend for IQC teams. Version 1 embeds the approved company AI experience, **JOJO**, and keeps supporting pages for Documents, NG History, Settings, and About.

## Version 1 architecture

```text
IQC user
  ↓
IQC Knowledge Center
  ↓
JOJO Full Page Embed
  ↓
ADP / Company AI
  ↓
Company Knowledge Base
  ↓
SOP / WI / Master List / Monthly Report / NG History
```

The JOJO embed is company-hosted and is expected to require the corporate network, SASE, VPN, or other approved internal access.

## Technology

React, Vite, TypeScript, Tailwind CSS, and Lucide React.

## Installation

Requires Node.js 20.19 or later and npm.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Static output is created in `dist/` and can be deployed to Netlify or an approved internal static host.

## JOJO integration

The Chat page embeds the JOJO Full Page experience:

```text
ADP/JOJO via server-side Netlify Function
```

The iframe keeps microphone permission enabled. No App Key, token, password, or API secret is stored in the frontend.

### Important network note

The web shell can be publicly reachable if hosted on Netlify, but JOJO itself may not resolve or load outside the company network. This is expected for an internal company AI service.

## Future API integration

If a fully custom chat interface is required later, add a secure server-side JOJO API adapter. Do not call secret-authenticated APIs directly from browser code.

## Project structure

```text
src/
  components/
    chat/
      ...
    common/
    layout/
  data/
  hooks/
  pages/
  services/
  types/
  utils/
```

## Security

- Do not store App Keys, secrets, or tokens in frontend source.
- Treat `VITE_*` values as public after build.
- Use approved company network access for JOJO.
- Keep confidential/restricted data handling aligned with company policy.
