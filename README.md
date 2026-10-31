# nihit — Open-Access Scientific & Scholarly Research Archive

**nihit** is an open-access digital research repository dedicated to cataloging, preserving, and reading Bangladesh-based and international scientific scholarship. Developed as an independent initiative under **[forgebytez](https://forgebytez.pages.dev)** (a digital design and engineering studio based in Chittagong, Bangladesh).

All publications curated in the archive are verified, openly accessible, and cataloged with structured metadata.

---

## 📑 Table of Contents

1. [Philosophy & Architecture](#-philosophy--architecture)
2. [Tech Stack](#-tech-stack)
3. [Directory & Modular Container Architecture](#-directory--modular-container-architecture)
4. [How Paper Metadata & Corpus Sync Works](#-how-paper-metadata--corpus-sync-works)
5. [Step-by-Step Guide: Adding a New Paper](#-step-by-step-guide-adding-a-new-paper)
6. [Library Filtering & Pagination Architecture](#-library-filtering--pagination-architecture)
7. [Search Console & Command System](#-search-console--command-system)
8. [Reading & Focus Modes](#-reading--focus-modes)
9. [Compact Toast Notification System](#-compact-toast-notification-system)
10. [Design System & Tokens](#-design-system--tokens)
11. [Development, Security & Build Commands](#-development-security--build-commands)

---

## 🏛 Philosophy & Architecture

### Core Design Principles
1. **Zero-Friction Corpus Synchronization**:
   - Adding a paper requires **zero manual code registration**. Simply dropping a folder with `.json` metadata and `.pdf` file into `src/data/research_papers/<genre>/<paper_id>/` automatically surfaces it across all routes, genres, facet filters, search consoles, citations, and full-text reading views.
2. **Modular Container Architecture**:
   - Every page (`Home`, `Library`, `About`, `Contact Us`, `Terms`, `Privacy`) is composed of self-contained sections located under `src/containers/<page>_<section>/`. Each container owns its TypeScript component and scoped CSS file.
3. **Intentional & Distraction-Free Reading**:
   - The Focused Reading view provides **Focus Mode** (collapsing peripheral widgets into low-profile edge tabs) and **Deep Focus Mode** (native browser fullscreen, persistent scroll hide for navigation chrome, and an ambient editorial canvas).
4. **Natural & Pure Aesthetic**:
   - Clean editorial theme based on 3 curated color accents:
     - **Accent 1**: Terracotta / Rust (`#B35435`)
     - **Accent 2**: Sage / Forest Green (`#4A6B52`)
     - **Accent 3**: Sand / Warm Ochre (`#D4A373`)
   - High-density frosted glass styling (`blur(40px) saturate(240%)`) eliminating background visual clutter.
5. **No AI Clutter / Focused Scholarly Navigation**:
   - Pure, purposeful interfaces with keyboard-first search console, faceted drawer filtering, and clear metadata hierarchies.

---

## 💻 Tech Stack

| Layer | Choice | Purpose |
|---|---|---|
| **Framework** | **React 19 + TypeScript** | Strongly-typed component tree and state management |
| **Bundler & Tooling** | **Vite 8** | Instant Hot Module Replacement (HMR) and optimized Rollup builds |
| **Routing** | **`react-router-dom` v7** | Client-side routing with clean URL parameters (`/library/:id`, `/library`, etc.) |
| **Animations** | **`framer-motion`** | Organic spring physics, popover emergence, and layout transitions |
| **Icons** | **`lucide-react`** | Consistent vector iconography |
| **Styling** | **Vanilla CSS + Modern Tokens** | CSS variables, container queries, line-clamping, and glassmorphic filters |

---

## 📂 Directory & Modular Container Architecture

```text
src/
├── App.tsx                                    # App root with ToastProvider & BrowserRouter
├── index.tsx                                  # React DOM entry
├── index.css                                  # Global CSS tokens, reset, fonts & custom thin scrollbar
│
├── lib/
│   ├── animations.ts                          # Shared Framer Motion variant presets
│   └── paperTypes.ts                          # Strict TypeScript schema for papers and metadata
│
├── data/
│   └── research_papers/
│       ├── researchPapers.ts                  # Auto-sync corpus barrel using import.meta.glob
│       └── <discipline>/                      # Genre folder (e.g., agriculture, biology, computing)
│           └── <paper_id>/
│               ├── <paper_id>.json            # Structured metadata & section content
│               └── <paper_id>.pdf             # Full-text PDF file (or paper.pdf)
│
├── components/
│   ├── layout/
│   │   ├── Navbar/                            # Dense frosted glass navbar with scroll glide
│   │   ├── Footer/                            # 4-column footer with forgebytez attribution & legal links
│   │   └── Layout/                            # Layout wrapper with Route configuration
│   ├── searchbar/                             # Centered bottom search console
│   │   ├── SearchBar.tsx                      # Keyboard console with 90% scroll-hide & popovers
│   │   ├── SearchBar.css                      # Dense frosted glass styling
│   │   └── subcomponents/
│   │       ├── searchcommands.ts              # Command prefix parser & fuzzy matcher
│   │       ├── SearchTagsPicker.tsx           # Filter & Command trigger picker with info banner
│   │       └── SearchResultsOverlay.tsx       # Categorized matches & approximate suggestions
│   └── ui/
│       ├── Toast/                             # Compact pill toast notification system
│       │   ├── Toast.tsx                      # Toast container & provider (spawns behind searchbar)
│       │   ├── Toast.css                      # Pill styles matching searchbar height
│       │   ├── useToast.ts                    # Dedicated React hook
│       │   └── toastTypes.ts                  # Toast schema & urgency types
│       ├── PaperCard/                         # Standardized paper card component
│       ├── PaperMeta/                         # Reusable paper metadata badges
│       ├── Button/                            # Reusable button styles
│       └── Card/                              # Standard card container
│
├── containers/                                # Modular, self-contained section components
│   ├── home_hero/                             # Hero section with headline and action links
│   ├── home_featured/                         # Featured research paper showcase
│   ├── home_features/                         # Research capabilities and principles grid
│   ├── home_institutions/                     # Research institution affiliations
│   ├── library_browse/                        # Left sticky filter drawer + genre-by-genre row showcase
│   ├── about_intro/                           # About page editorial introduction
│   ├── about_pillars/                         # Academic and scientific values
│   ├── about_workflow/                        # Peer review and digitization workflow
│   ├── about_team/                            # Curators, researchers, and studio leadership
│   ├── contact_form/                          # Scholarly correspondence and submission form
│   └── contact_faq/                           # Frequently asked questions accordion
│
├── pages/
│   ├── Home/                                  # Renders Home containers
│   ├── Library/                               # Renders LibraryBrowse container
│   ├── About/                                 # Renders About containers
│   ├── ContactUs/                             # Renders Contact containers
│   ├── Terms/                                 # Terms of Service & Open Access conditions
│   ├── Privacy/                               # Privacy policy
│   ├── Focused/                               # Focused Paper Reading environment
│   │   ├── FocusedPaper.tsx                   # Main reading controller
│   │   ├── FocusedPaper.css
│   │   └── components/
│   │       ├── subcomponents/
│   │       │   ├── MainPaperHeader/           # Paper title, authors, DOI, and date
│   │       │   ├── MainAbstractContainer/     # Full abstract view
│   │       │   ├── MainPaperSections/         # Interactive section body (renders JSON content)
│   │       │   ├── MainCitationContainer/     # APA and BibTeX citation exporter
│   │       │   ├── ReadingElements/           # Outset vertical mode tabs & actions
│   │       │   ├── PaperIndex/                # Table of Contents and jump links
│   │       │   └── InteractiveMetadata/       # Interactive affiliations and journal metrics
│   │       └── modes/
│   │           ├── FocusMode/                 # Focus Mode modular container
│   │           └── DeepFocusMode/             # Fullscreen Deep Focus modular container
│   └── NotFound/                              # 404 handler
│
└── functions/                                 # Standalone utilities
    ├── citation/                              # APA & BibTeX string generation
    ├── download/                              # Direct asset download triggers
    ├── pdf_preview/                           # In-browser PDF tab preview
    ├── print/                                 # Print layout triggers
    └── share/                                 # Web Share API & clipboard link copy
```

---

## ⚡ How Paper Metadata & Corpus Sync Works

The heart of the auto-sync system lives in [`src/data/research_papers/researchPapers.ts`](file:///d:/Workz%20(Codingz)/niheet/src/data/research_papers/researchPapers.ts).

### Automatic Vite Glob Ingestion
```typescript
const jsonGlob = import.meta.glob<JsonModule>('./**/*.json', { eager: true })
const pdfGlob  = import.meta.glob<string>('./**/*.pdf', { as: 'url', eager: true })
```

1. **Dynamic File Discovery**: Whenever Vite builds or runs locally, `import.meta.glob` scans every folder inside `src/data/research_papers/`.
2. **Metadata Ingestion**: Every `.json` file found is automatically parsed into memory as a `Paper` object conforming to `src/lib/paperTypes.ts`.
3. **Asset URL Resolution**: PDFs are imported as URLs (`{ as: 'url' }`). Vite automatically copies the PDF file into `dist/assets/` and generates a stable, hashed web URL.
4. **Auto-Correlation**: The loader matches the `.pdf` with its `.json` metadata by matching either the directory name or file prefix.
5. **Universal Propagation**:
   - **Library**: Immediately generates genre rows, updates filter counts, and populates the keyword facets.
   - **Search Console**: Indexes titles, authors, DOIs, archive codes, and keywords for instantaneous fuzzy search.
   - **Focused View**: Resolves the `/library/:id` route, displaying full section prose, tables, and citation formats.

---

## 🚀 Step-by-Step Guide: Adding a New Paper

You **never** need to modify any source code or register imports manually. Simply follow these two steps:

### 1. Create a Folder
Pick an existing discipline folder or create a new one (e.g. `src/data/research_papers/marine_biology/`) and create a folder named after your paper identifier:
```text
src/data/research_papers/<genre>/<your-paper-id>/
```

### 2. Add the JSON & PDF
Drop your paper's PDF and a JSON file with the same base name:
```text
src/data/research_papers/marine_biology/Karim_2024_CoralReefs/
  ├── Karim_2024_CoralReefs.json
  └── Karim_2024_CoralReefs.pdf
```
*(Note: Naming the PDF `paper.pdf` inside that directory also works automatically).*

### Example JSON Template (`your-paper-id.json`):
```json
{
  "id": "Karim_2024_CoralReefs",
  "genre": "marine_biology",
  "title": "Ecological Resilience of Coral Communities in Saint Martin's Island",
  "authors": [
    { "name": "Rezaul Karim", "role": "author" },
    { "name": "Tasnim Farhana", "role": "author", "corresponding": true }
  ],
  "institutions": [
    {
      "name": "Institute of Marine Sciences, University of Chittagong",
      "location": "Chittagong 4331, Bangladesh",
      "authors": ["Rezaul Karim", "Tasnim Farhana"]
    }
  ],
  "year": 2024,
  "publishedDate": "2024-05-15",
  "journal": {
    "name": "Bangladesh Journal of Marine Sciences",
    "abbreviation": "BJMS",
    "volume": 12,
    "issue": 1,
    "pages": "45-58",
    "issnPrint": "2079-0000"
  },
  "doi": "https://doi.org/10.5455/BJMS.2024.102",
  "doiCode": "10.5455/BJMS.2024.102",
  "paperCode": "BJMS.2024.102",
  "license": "CC-BY-4.0",
  "keywords": ["Coral Reefs", "Saint Martin", "Ecology", "Climate Adaptation"],
  "abstract": "This study examines the ecological resilience and thermal tolerance of coral reef taxa inhabiting the littoral waters of Saint Martin's Island...",
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "level": 1,
      "content": [
        "Coral ecosystems represent critical marine habitats...",
        "Rising sea surface temperatures present acute ecological pressures..."
      ]
    },
    {
      "id": "methods",
      "title": "Methodology & Sampling",
      "level": 1,
      "content": [
        "Sampling was conducted across four littoral transects in Saint Martin's Island..."
      ]
    },
    {
      "id": "results",
      "title": "Results & Discussion",
      "level": 1,
      "content": [
        "Thermal anomalies observed during summer months corresponded with measurable pigment shifts..."
      ]
    },
    {
      "id": "conclusion",
      "title": "Conclusion",
      "level": 1,
      "content": [
        "Strategic conservation frameworks are urgent to preserve remaining calcifying taxa..."
      ]
    }
  ],
  "tables": [],
  "pdf": "paper.pdf",
  "source": "pdf",
  "verified": true
}
```

---

## 🔍 Library Filtering & Pagination Architecture

The Library facet filter drawer in [`src/containers/library_browse/`](file:///d:/Workz%20(Codingz)/niheet/src/containers/library_browse/):
- **Full Metadata Facets**: Includes **Research Genres**, **Publication Years**, **Institutions**, and **Keywords & Methods**.
- **10-Item Truncation & "View More" Toggle**:
  - Each metadata group initially displays at most 10 items to prevent the sidebar from expanding excessively.
  - A subtle `View More (N more)` toggle allows readers to expand the entire list when desired.
- **Institution Clamping & Tooltips**:
  - Long institution names are clamped to 2 lines (`-webkit-line-clamp: 2`) with an ellipsis (`...`).
  - Native `title` tooltips display the full university and faculty name on hover.
- **Safe URL Sync & No Stacking Bugs**:
  - Filter state synchronizes via URL search params (`?genre=...&year=...`).
  - Values are deduplicated, decoded, and encoded properly to prevent recursive parameter stacking bugs.

---

## ⌨️ Search Console & Command System

Located in [`src/components/searchbar/`](file:///d:/Workz%20(Codingz)/niheet/src/components/searchbar/):

### Command Triggers
* **`#` (DOI)**: Directly searches by DOI code (e.g. `#10.5455/JBAU...`).
* **`|` (Archive Code)**: Searches by archive accession code (e.g. `|JBAU.90309`).
* **`@` (Author)**: Filters papers by author names (e.g. `@Nowshin`).
* **`/` (Page Navigation)**: Jumps directly to any page (`/library`, `/about`, `/contact`, `/terms`, `/privacy`).
* **`\` (Action Commands)**: Runs instant actions (e.g. `\top` smoothly scrolls to the top of the page).

### Dynamic 2D Keyboard Navigation & Triggers
* **Arrow Navigation**: Supports true directional 2-column navigation (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) inside the Filter & Command Triggers popover.
* **Contextual Information Banner**: Shows usage hints and format examples for the currently highlighted trigger.
* **Typo Resilience & Approximate Suggestions**: If a user mistypes or no exact match exists, similar and related items are displayed with a subdued, grayed-out style (`isFuzzyFaded`) so search never hits an unhelpful dead end.

---

## 📖 Reading & Focus Modes

Located at `/library/:id`:
1. **Standard Mode**: Full editorial view with Table of Contents jump index and interactive metadata metrics.
2. **Focus Mode**:
   - Collapses peripheral sidebars smoothly offscreen to the right.
   - An outset vertical book-spine tab remains visible at the screen edge for quick restoration.
3. **Deep Focus Mode**:
   - Requests native browser fullscreen.
   - Permanently hides the navbar upon downward scroll and suppresses all distraction chrome.
   - Pressing `ESC` or clicking the outset exit tab seamlessly restores standard view.

---

## 🔔 Compact Toast Notification System

Located in [`src/components/ui/Toast/`](file:///d:/Workz%20(Codingz)/niheet/src/components/ui/Toast/):

- **Compact Geometry**: Matches the exact height of the SearchBar console (44px) for concise notifications (title + icon only for state toggles like entering/exiting focus modes), expanding to 52px only when a subtitle is present.
- **Dynamic Physics Animation**:
  - **Spawn**: Spawns directly behind the bottom-center SearchBar console (`x: -320`), sliding out smoothly to the bottom-right of the viewport.
  - **Hold**: Remains stationary at the bottom right during its duration.
  - **Exit**: Continues gliding to the right offscreen (`x: 220`) with a spring decay.
- **Harmonious Color Codes**:
  - `mode`: Terracotta gradient (`#B35435 → #A04426`).
  - `success`: Sage green gradient (`#4A6B52 → #3B5742`).
  - `warning`: Sand & Amber gradient (`#D4A373 → #C38E5A`).
  - `urgent`: Deep Crimson alert (`#A83626 → #882214`).
  - `info`: Warm Dark Charcoal (`#2A2320 → #1F1917`).

---

## 🎨 Design System & Tokens

Centrally declared in [`src/index.css`](file:///d:/Workz%20(Codingz)/niheet/src/index.css):

```css
:root {
  /* 3 Curated Accents */
  --color-accent-1: #B35435;  /* Terracotta / Rust */
  --color-accent-2: #4A6B52;  /* Sage / Forest Green */
  --color-accent-3: #D4A373;  /* Sand / Warm Ochre */

  /* Neutral Surfaces */
  --bg-primary: #F8F5F0;      /* Warm off-white paper canvas */
  --bg-surface: #FFFFFF;      /* Clean card surface */
  --text-primary: #2A2320;    /* Dark charcoal ink */
  --text-muted: #6B5E58;      /* Secondary editorial text */
  --border-default: rgba(42, 35, 32, 0.1);

  /* Typography */
  --font-title: 'Zodiak', serif;
  --font-subtitle: 'General Sans', sans-serif;
  --font-body: 'Satoshi', sans-serif;
}
```

---

## 🛠 Development, Security & Build Commands

```bash
# Install dependencies
npm install

# Start local development server (with HMR)
npm run dev

# Audit dependencies for security vulnerabilities (0 vulnerabilities found)
npm audit

# Validate codebase against strict ESLint rules
npm run lint

# Typecheck and build optimized bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🏢 Attribution

- **Project Name**: nihit
- **Studio**: [forgebytez](https://forgebytez.pages.dev) — Digital craft studio based in Chittagong, Bangladesh.
- **License**: CC BY 4.0 Open-Access Scholarly Distribution.
