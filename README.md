# Nihit — Open-Access Research Archive

**Nihit** is a digital archive for BD research papers
Developed by **[forgebytez Studio](https://forgebytez.pages.dev)**, Chittagong.

All publications are verified, openly accessible, and structured for deep reading and citation. and most of all fully free for now, and forever

---

## What's Inside

- **Curated Research Papers**: Peer-reviewed publications from Bangladeshi instituions.
- **Structured Metadata**: Every paper includes DOI, author affiliations, publication details, and keywords.
- **Bangla Integration**: Abstracts and key terms available in both English and Bangla. (upcoming features)
- **Open Access**: Free to read,cite, and use various tools to help yourlsef.

---

## Quick Start

### For Readers
1. Browse papers by genre, institution, or keyword at the **Library** page.
2. Use the search console (`/` for commands, `@` for authors, `#` for DOI).
3. Click any paper and read it on the go, for a more focused approach use **Focused Reading Mode** with citation tools built into the site.

### For Contributors (Adding Papers)
We use a simple folder-based system. To add a new paper:

1. Create a folder: `src/data/research_papers/<discipline>/<paper_id>/`
2. Add two files:
   - `<paper_id>.json` (metadata)
   - `<paper_id>.pdf` (the full paper)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Routing | React Router v7 |
| Styling | Vanilla CSS + CSS Variables + framer-motion|
| Icons | Lucide React |

---

## 📦 Development

#### Install dependencies
bun install

#### Start development server
bun run dev

#### Build for production
bun run build

#### Preview production build
bun run preview