# Case study `sections` reference

This documents the `projects` table and the `sections` JSON shape that
`CaseStudyModal.jsx` renders. It's a reference for hand-editing case study
content in the Supabase dashboard — not a schema enforced anywhere in code.
Nothing validates this shape at write time, so a typo fails silently (see
[§3](#3-what-happens-on-a-mistake)).

Confirmed against the live `projects` table and all 9 real case studies
(Lead Agent, Zentri, Stacks, Breathe, Artez, Piel Canela, Pamper, SceneIt,
Folio) — not inferred from code alone.

## 1. `projects` table schema

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | `NOT NULL` |
| `title` | `text` | `NOT NULL`. Also the only source of the URL hash — the client computes `slugify(title)` on the fly. There is no `slug` column. |
| `image_url` | `text` | Card thumbnail |
| `created_at` | `timestamptz` | Not read anywhere in the UI currently |
| `description` | `text` | Card subtitle. Not shown inside the modal itself |
| `link_url` | `text` | Nullable. Powers "Visit Site" in the modal, and — for non-case-study cards — makes the card an external link |
| `sort_order` | `integer` | Ascending order for both the homepage carousel and the `/work` grid |
| `is_active` | `boolean` | Only `is_active = true` rows are fetched at all. This is the only publish/draft control that exists — there is no separate draft/published state |
| `is_case_study` | `boolean` | **This is the flag.** It lives on `projects` itself, not a join or separate table. `true` → card opens the modal; `false` + `link_url` set → card is a plain external link; neither → static, unclickable card |
| `team` | `jsonb` | Array of `{ name, avatar_url }`. Code defensively handles it arriving as either a parsed array or a JSON string (`typeof team === "string" ? JSON.parse(team) : team`) |
| `services` | **`ARRAY`** (native Postgres array) | **Not `jsonb`.** No string-parsing guard exists for this column in `CaseStudyModal.jsx` — none is needed, because Postgres arrays always come back from Supabase already deserialized as a real JS array. Don't hand-edit this the way you'd edit `team` or `sections`: pasting a JSON-string value into this column (the way you might for a jsonb column) is the one column here where that would be the wrong move. |
| `project_date` | `text` | Displayed as-is. Free text, not a real date type |
| `overview` | `text` | The paragraph shown at the top of the modal |
| `sections` | `jsonb` | The array documented below. Same string-or-parsed defensive handling as `team` |

## 2. Section types

Seven types exist: `text`, `image`, `video`, `mixed`, `highlights`,
`stats`, and `comparison`. The renderer (`CaseStudyModal.jsx`,
`renderSection()`) checks `section.type` against exactly these seven
strings. The first four are confirmed in real production data across all
9 case studies (see §4); `highlights`, `stats`, and `comparison` are new
and not yet used in any live case study — all three are built and ready,
waiting for content.

### `text`

No `layout` field — this type doesn't have layout variants.

| Field | Type | Required? |
|---|---|---|
| `type` | `"text"` | required |
| `title` | string | optional — omit to skip the heading |
| `content` | string | optional — omit to skip the paragraph |

Renders as a 2-column layout (title in a narrow left column, content in a
wide right column on desktop; stacks to 1 column on mobile).

```json
{
  "type": "text",
  "title": "The Challenge",
  "content": "This project threw me into the deep end..."
}
```

### `image`

| Field | Type | Required? |
|---|---|---|
| `type` | `"image"` | required |
| `images` | array of URL strings | required (empty array renders nothing) |
| `layout` | `"full"` \| `"half"` \| `"grid"` | optional, defaults to `"full"` |

Layout behavior:
- `"full"` — first image only (`images[0]`), full-width
- `"half"` — first **two** images (`images.slice(0, 2)`), side by side in a 2-column grid, `4:3` aspect ratio each. Extra images beyond 2 are silently ignored.
- `"grid"` — **all** images, 3-column grid, square (`1:1`) aspect ratio each

```json
{
  "type": "image",
  "images": ["https://.../675shots_so.webp"],
  "layout": "full"
}
```

```json
{
  "type": "image",
  "images": ["https://.../shot-a.webp", "https://.../shot-b.webp"],
  "layout": "half"
}
```

### `video`

Structurally a parallel copy of `image` — same three layout values, and it
reuses `image`'s CSS classes (there's no dedicated video styling).

| Field | Type | Required? |
|---|---|---|
| `type` | `"video"` | required |
| `videos` | array of URL strings | required (empty array renders nothing) |
| `poster` | URL string | optional. Only used by the `"full"` layout — `"half"`/`"grid"` layouts don't display a poster per item |
| `layout` | `"full"` \| `"half"` \| `"grid"` | optional, defaults to `"full"` |

Every video renders `autoPlay loop muted playsInline`. If the browser
blocks autoplay, it fails silently — no fallback UI, just a frozen frame
(the poster, if one was given).

Layout behavior mirrors `image` exactly: `"full"` = first video only,
`"half"` = first two side by side, `"grid"` = all videos, 3-column.

```json
{
  "type": "video",
  "videos": ["https://.../Video.mp4"],
  "poster": "https://.../poster.webp",
  "layout": "full"
}
```

### `mixed`

| Field | Type | Required? |
|---|---|---|
| `type` | `"mixed"` | required |
| `media` | array of `{ url: string, type: "video" \| "image", poster?: string }` | required |
| `layout` | string | **accepted but has no effect — see warning below** |

**⚠️ `layout` does nothing on `mixed` sections.** The field is read into a
CSS class name (`case-study-section-mixed layout-${layout}`) but there is
no CSS rule anywhere that targets that class, and the actual JSX structure
is hardcoded regardless of the value: it always takes `media.slice(0, 2)`
and lays them out side by side in a 2-column grid. Setting `"layout":
"grid"` or `"layout": "full"` on a `mixed` section will **not** change how
it renders — it'll still show exactly 2 items, side by side, same as
`"half"` (or no `layout` at all). Every real `mixed` section in production
today only ever uses 2 media items for this reason. If you want a `mixed`
section with a different arrangement (more than 2 items, a different
grid), that's new rendering work, not a config value that already exists.

Each item in `media` is checked individually: `type: "video"` renders a
`<video autoPlay loop muted playsInline>`, anything else renders an
`<img>`.

```json
{
  "type": "mixed",
  "media": [
    { "url": "https://.../Video.mp4", "type": "video" },
    { "url": "https://.../740shots_so.webp", "type": "image" }
  ],
  "layout": "half"
}
```

### `highlights`

A row of numbered cards — e.g. "01 Design", "02 Leadership", "03 XFN
Work" — each a short title plus a 1-2 sentence description. This is
**intentionally separate from `overview` and from the `text` type**: it
does not replace either. `overview` is the paragraph field on the
`projects` table itself, shown once at the top of every case study
regardless of `sections` content. `text` sections handle a headline +
longer paragraph anywhere in the flow. `highlights` is purely the
numbered-card grid — if you want an intro headline sitting above the
cards, add a separate `text` section immediately before the
`highlights` section in the array; don't try to cram a headline into
this type's fields.

No `layout` field — always renders as a grid, sized to however many
cards there are (see below).

| Field | Type | Required? |
|---|---|---|
| `type` | `"highlights"` | required |
| `items` | array of `{ number, title, description }` | required. 2–4 entries expected; not hard-capped, but the grid is designed around that range |
| `items[].number` | string | optional per item, but expected in practice (e.g. `"01"`) — it's typed exactly as you want it displayed, not auto-generated from array position |
| `items[].title` | string | optional per item — omit to skip the title |
| `items[].description` | string | optional per item — omit to skip the description |

Grid sizing: the column count equals the number of items, capped at 3 —
2 items renders 2 even columns (not 2 columns + an empty third gap), 3
renders 3, and 4 still renders 3 columns (wraps to a 3+1 layout, keeping
the "3 across" look intact rather than squeezing to 4 columns). Collapses
to 1 column on mobile at the same `768px` breakpoint as every other
grid-based section type.

```json
{
  "type": "highlights",
  "items": [
    { "number": "01", "title": "Design", "description": "Owned the design for..." },
    { "number": "02", "title": "Leadership", "description": "Led a team through..." },
    { "number": "03", "title": "XFN Work", "description": "Proactively generated ideas..." }
  ]
}
```

### `stats`

A row of big count-up numbers, each with a short label underneath — e.g.
"5,000+ / cups of coffee sold". Ported from the homepage's old
`StatsSection` (deleted, recoverable from git history at commit
`e6a8b6c^`): same IntersectionObserver trigger (fires once, the first
time the section scrolls into view — reopening/rescrolling to it doesn't
replay it), same ease-out-cubic easing, same 2-second/60fps timing.

No `layout` field.

| Field | Type | Required? |
|---|---|---|
| `type` | `"stats"` | required |
| `items` | array of `{ value, label }` | required. 2–4 entries expected |
| `items[].value` | **string**, not a number | required for the count-up to mean anything. Typed exactly as it should display — `"5,000+"`, `"4x"`, `"300+"` are all valid as-is, no separate prefix/suffix fields needed |
| `items[].label` | string | optional — short, a few words. Rendered exactly as typed (no automatic capitalization) |

How the count-up handles the string `value`: it pulls out the first
numeric substring (digits, an optional decimal point, optional
thousands-commas) and animates that from 0 up to its real value, then
re-attaches whatever text came before/after it on every frame — so
`"5,000+"` animates as `"0+"` → `"2,341+"` → `"5,000+"`, preserving both
the comma formatting and the `+`. If a `value` has no numeric substring
at all (e.g. a plain word), it's rendered as-is with no animation —
there's nothing to count up to.

Unlike `highlights`, this type is left-aligned via `justify-content:
space-between` rather than the old homepage component's
`justify-content: space-around` — the first number sits flush left,
matching every other section type's alignment, rather than being inset
the way the old (now-deleted) homepage Statistics section was.

```json
{
  "type": "stats",
  "items": [
    { "value": "5,000+", "label": "cups of coffee sold" },
    { "value": "4x", "label": "increase in order conversion" },
    { "value": "300+", "label": "weekly active users" }
  ]
}
```

### `comparison`

A before/after pair — two images side by side, each with a small pill
label above it ("First Iteration" / "Final Design", or "Before" /
"After") and an optional caption underneath describing what changed. An
intro headline above this (e.g. "Visual Language — ...") is a separate
`text` section placed before it, same pattern as `highlights`: this type
is only the two-image comparison itself.

Images only — no video support in this type.

No `layout` field — always two images side by side (one column on
mobile).

| Field | Type | Required? |
|---|---|---|
| `type` | `"comparison"` | required |
| `before` | object | required |
| `after` | object | required |
| `before.url` / `after.url` | URL string | required — a panel with no `url` renders nothing at all for that side |
| `before.label` / `after.label` | string | required in practice — this is the pill text; omit and no pill renders for that panel |
| `before.caption` / `after.caption` | string | optional — omit to skip the caption for that panel |

**Note on the pill styling:** this codebase's original `.pill` class (the
homepage nav's pills) no longer exists — it was removed when the nav was
rebuilt from 3 pill buttons into the hamburger menu. This type reuses
`.case-study-pill` instead, the pill style already used for the
`services` list in this same modal (small, bordered, uppercase-ish
letter-spacing) — visually the closest live equivalent, not a new style.

```json
{
  "type": "comparison",
  "before": {
    "url": "https://.../early-wireframe.png",
    "label": "First Iteration",
    "caption": "First dashboard concept with the existing design system for solo accounts."
  },
  "after": {
    "url": "https://.../final-design.png",
    "label": "Final Design",
    "caption": "Iterated on visual styles to make it more welcoming — dark banner for trust, clearer onboarding."
  }
}
```

## 3. What happens on a mistake

**An unrecognized `type` value silently renders nothing.** The renderer's
branch chain (`text` → `image` → `video` → `highlights` → `stats` →
`comparison` → `mixed`) falls through to `return null` for anything
else — no error in the console, no visual placeholder, nothing in the
DOM at all. If a case
study looks like it's
"missing" a section after you edit it in the Supabase dashboard, **the
first thing to check is a typo'd or misspelled `type` string** — e.g.
`"Text"`, `"Image"`, `" text"` (stray whitespace), or a leftover type from
a different project you copy-pasted from. This is the single easiest
mistake to make when hand-editing this JSON, and it produces no feedback
that anything went wrong.

Other silent-failure spots worth knowing:
- `image`/`video` `"half"` layout: a 3rd+ image/video in the array is silently dropped, not an error.
- `mixed`: as above, `layout` is silently ignored — no error, just no visual change.
- `team`/`sections` being valid JSON but the wrong *shape* (e.g. `sections` as an object instead of an array) will throw at parse/render time rather than fail silently, since the code calls `.map()`/`.length` on it directly.

## 4. Real section sequences (worked examples)

| Project | Sequence | Section count | Notes |
|---|---|---|---|
| Zentri | `image → text` | 2 | Simplest case study on the site |
| Artez | `image → image → text` | 3 | |
| Lead Agent | `image → image → text → image → text` | 5 | No `video`/`mixed` at all |
| Breathe | `image → image → text → image → text` | 5 | Same shape as Lead Agent |
| Piel Canela | `image → mixed → text → image → text → image → text` | 7 | |
| Pamper | `image → mixed → text → image → text → image → text` | 7 | Same shape as Piel Canela |
| Folio | `image → mixed → text → image → text → image → text` | 7 | Same shape as Piel Canela/Pamper |
| SceneIt | `video → image → text → image → text → text → image → text` | 8 | Only project with two consecutive `text` sections |
| Stacks | `video → mixed → text → video → text → video` | 6 | Only project ending on a non-`text` section; most video-heavy |

Patterns worth noting before designing new types:
- The most common shape across the site is **`image → mixed → text →
  image → text → image → text`** (Piel Canela, Pamper, Folio all use it
  verbatim) — effectively a repeating `[visual, text]` rhythm after an
  opening `image`+`mixed` pair.
- Every case study except Stacks ends on a `text` section.
- `mixed` never opens a case study and never appears twice in the same
  project.
- `video` only appears in the two most media-heavy case studies
  (Stacks, SceneIt) — everywhere else, motion is handled via `mixed`
  instead of a standalone `video` section.
