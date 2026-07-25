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

Four types exist, and only these four appear anywhere in real data:
`text`, `image`, `video`, `mixed`. The renderer (`CaseStudyModal.jsx`,
`renderSection()`) checks `section.type` against exactly these four strings.

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

## 3. What happens on a mistake

**An unrecognized `type` value silently renders nothing.** The renderer's
branch chain (`text` → `image` → `video` → `mixed`) falls through to
`return null` for anything else — no error in the console, no visual
placeholder, nothing in the DOM at all. If a case study looks like it's
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
