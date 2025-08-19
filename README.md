# Markdown Editor

A feature‑rich Markdown editor built with Modern React + Vite + TypeScript.

## Live Demo

https://free-markdown-editor.vercel.app/

## Features

- Live preview and quick toggle between Editor/Preview
- Light/Dark theme support
- Headings (H1–H6), Bold, Italic, Inline/Block Code, Lists (unordered/ordered), Blockquote, Horizontal Rule
- Insert Link and Image, table template helper
- Emoji picker (category‑based)
- Math (KaTeX), Emoji and GFM (GitHub Flavored Markdown) support
- Mermaid diagrams and ABC music notation rendering
- File import (.md/.txt) and export (.md, .html, Print to PDF)
- Auto‑save (localStorage) and Status Bar: line/word/character counters + save status indicator

## Keyboard Shortcuts

- Cmd/Ctrl + B: Bold
- Cmd/Ctrl + I: Italic
- Cmd/Ctrl + K: Insert link
- Cmd/Ctrl + 1…6: H1…H6

## Tech Stack

- React 19, TypeScript
- Vite, Tailwind CSS 4, shadcn/ui helpers, Radix primitives
- Zustand (state management)
- react-markdown + remark-gfm, remark-math, remark-emoji, rehype-katex
- react-syntax-highlighter (code highlighting)
- mermaid (diagrams), abcjs (music notation)
- react-router-dom (routing)

## Setup & Scripts

- Requirements: Node.js 18+
- Install dependencies: `npm install`
- Development server: `npm run dev`
- Production build: `npm run build`
- Preview built app: `npm run preview`
- Serve statically: `npm run serve`

## Usage Tips

- Mermaid code fences: ```mermaid
- ABC music notation fences: ```abc
- Math: inline `$...$`, block `$$...$$`
- Add tables using the toolbar or by writing standard Markdown tables
- Exported HTML automatically includes the required CDNs for KaTeX, Mermaid, and ABCJS

## Project Structure (Brief)

- `src/components`: Editor, Preview, Toolbar, Header, Footer, StatusBar
- `src/stores/editorStore.ts`: Editor state and toolbar actions
- `src/hooks/useDocumentMeta.ts`: Page title and meta management
- `src/utils/exportUtils.ts`: Markdown → HTML/PDF export and file import helpers

## Development Notes

- Theme management is handled via ThemeContext; `light`/`dark` classes are applied on the root element.
- Content is automatically persisted to localStorage; save status is shown in the header and status bar.

## Contributing

Contributions and suggestions are welcome. Feel free to open a PR.
