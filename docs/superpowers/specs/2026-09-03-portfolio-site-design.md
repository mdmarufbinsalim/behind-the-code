# Portfolio Site Design — "Behind The Code"

Date: 2026-09-03
Status: Approved for planning

## Purpose

A personal portfolio site for Md. Maruf Bin Salim that tells a story: case
studies first (priority content), then work experience, then a short
about-me. The site should feel hand-crafted — sketched, not templated —
using a doodle/freehand visual language, while navigation between the
story overview and individual case studies feels seamless (no visible
page-load break).

## Non-goals (v1)

- No 3D animation (deferred as a possible fast-follow).
- No color accent — strict black & white, matching the existing
  logo/favicon.
- No headless CMS — content is authored in-repo.
- No blog/articles section — only case studies, experience, about.

## Content model

### Case studies (priority content)

- Location: `content/case-studies/<slug>.mdx`
- Frontmatter: `title`, `slug`, `role`, `stack: string[]`, `year`,
  `summary` (1–2 sentences, used on the card and as page description),
  `coverDoodle` (reference to an illustration/component for the card +
  hero).
- Body: freeform MDX narrative (problem → approach → what was built →
  outcome), able to use custom components (`<SketchCallout>`,
  `<BeforeAfter>`, `<SketchArrow>`, etc.) inline.
- The set of case studies is open-ended — the template must support
  any number without code changes, driven by reading all files in the
  `content/case-studies/` directory.

### Work experience

- Location: `content/experience.ts`
- A typed array of `{ role, company, start, end | "present", summary,
  highlights: string[] }`, rendered as a hand-drawn vertical timeline.

### About me

- Location: `content/about.ts`
- A small typed object: `{ intro, body (short paragraphs), photoOrDoodle
  }`. Short and personal in tone.

## Page structure

Single scrolling home page (`/`) with sections in this order:

1. **Hero** — large logo mark, animated hand-drawn tagline underline,
   sets the "sketchbook" tone.
2. **Case studies** — grid/row of cards (title, summary, cover doodle,
   sketchy border). This is the priority section, positioned right
   after the hero.
3. **Work experience** — hand-drawn vertical timeline connecting roles,
   entries reveal on scroll as if being sketched in.
4. **About me** — short personal section with an illustration, closing
   the narrative loop.
5. **Footer** — contact/social links, minimal.

Each case study also has its own route: `/case-studies/[slug]`,
rendering the MDX narrative body under a morphed-in hero (title,
summary, cover). A "back" link returns to the home page, morphing back
to the originating card's position.

## Navigation / transitions

Approach: **Framer Motion shared-element morph**, chosen over the
native View Transitions API (inconsistent cross-browser support today)
and a plain crossfade (no continuity, weaker "story" feel).

- Each case-study card and its detail-page hero share a Framer Motion
  `layoutId`. Clicking a card animates it into the hero position/size
  of the detail route instead of a hard navigation cut.
- MDX body content on the detail page fades in after the morph
  settles (~300–400ms).
- The same Framer Motion instance also drives scroll-reveal animations
  elsewhere on the site, so there is one animation system for the
  whole app rather than several libraries doing overlapping jobs.

## Visual system

- **Palette**: strict black & white, matching the existing
  `logo-black.svg` / `logo-white.svg` / favicon. Emphasis comes from
  stroke weight, motion, and doodle marks — not color.
- **Typography**: a handwritten Google Font (Caveat or Kalam) for
  headings/accents; existing clean sans (or Geist) retained for body
  copy, for readability.
- **Doodle primitives**: a small reusable component set backed by
  `roughjs`, rendering hand-drawn SVG shapes that re-randomize their
  wobble slightly per mount:
  - `<SketchBox>` — hand-drawn bordered container (used for cards).
  - `<SketchUnderline>` — animated underline accent.
  - `<SketchArrow>` — pointer/callout arrow.
  - `<SketchCircle>` — circles a highlighted word/element.
- **Scroll reveals**: sections/cards fade or slide in via Framer
  Motion's `whileInView`; sketchy borders "draw themselves" in via
  stroke-dashoffset animation as they enter.
- **Micro-interactions**: small hover wobble (rotate/scale jitter) on
  cards and buttons.

## Testing / validation plan

- Visual check in a real browser at each major milestone (home page
  layout, case-study morph transition, timeline, about section) —
  screenshot via headless Chrome or manual dev-server check, per this
  project's established workflow.
- Confirm the morph transition behaves correctly forward (card → page)
  and backward (page → card).
- Confirm the case-study template renders correctly with zero, one,
  and multiple MDX files present (open-ended content requirement).
- `pnpm build` must succeed with no type errors before any commit.
- Basic responsiveness check (mobile width) for hero, card grid, and
  timeline — not a full breakpoint audit, but nothing should visibly
  break.

## Open items deferred to implementation planning

- Exact copy/content for hero tagline, about-me text, and work
  experience entries (placeholder content acceptable until the user
  supplies real copy).
- Illustration assets for case-study cover doodles (start with simple
  rough.js-generated shapes; can be replaced with hand-drawn SVGs
  later).
