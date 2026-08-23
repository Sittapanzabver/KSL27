## Goal
On the homepage hero, stretch the left content (title, champion banner, description, CTAs) to span the full grid width, and remove the empty right column where the "Match of the Week" card used to render.

## Why it's empty
The right column renders a featured upcoming match (`upcoming[0]`). The 2026 season is finished, so `fetchUpcomingMatches` returns nothing and the right column collapses, leaving the left column at `lg:col-span-8` with empty whitespace beside it on desktop.

## Changes (single file: `src/routes/index.tsx`)

1. **Hero container (line ~84)** — restore proper centering and drop the redundant ad-hoc spacing tokens added previously. Replace the current overloaded class string with a clean version, and switch the inner grid from a 12-col split to a single full-width column:
   ```
   <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 sm:py-20 md:py-28">
   ```

2. **Left content wrapper (line ~85)** — remove `col-span-12 lg:col-span-8` so it fills the container:
   ```
   <div className="w-full">
   ```

3. **Featured match block (lines ~133–163)** — delete the entire `{featured && ( ... )}` JSX block, since it's the right-column card that's no longer needed. Also remove the now-unused `featured` variable (line 59) and the `fetchUpcomingMatches` import + call if nothing else uses them (verify first; `upcoming`/`fetchUpcomingMatches` is only referenced for `featured`).

## Result
- Hero content (KORAT SUPER LEAGUE title, champion banner, description, stats, CTA buttons) spans the full width of the `max-w-7xl` container on all breakpoints.
- No empty space on the right at `lg+` viewports.
- Mobile layout is unaffected (was already single column).
