# Behind The Code

A Next.js project bootstrapped with TypeScript and Tailwind CSS.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `pnpm dev` - start the development server
- `pnpm build` - build for production
- `pnpm start` - start the production server
- `pnpm lint` - run ESLint

## License

See [LICENSE](./LICENSE).

## Resume

The resume lives at `/resume`, rendered from `content/resume.ts`. The
downloadable PDF is printed from that same page, so the two can't drift:

```bash
pnpm resume:pdf     # regenerates public/md-maruf-bin-salim-bhuiyan-resume.pdf
```

Run it after editing the content, the page's markup, or the print styles in
`globals.css`. It reuses a server already running on :3000 and starts one
itself otherwise.
