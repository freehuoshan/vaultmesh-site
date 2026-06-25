# Task: Draft the next VaultMesh blog post

Follow these steps exactly, in order:

1. Read `blog/STYLE.md`. Internalize the voice, structure, length rules, and
   hard rules. The post you write must satisfy every rule in that file.

2. Read `blog/topics.json`. Find the first topic with `status: "queued"`.
   - If there are no queued topics, stop and print:
     `No queued topics — add some to blog/topics.json.` Do not continue.

3. List `blog/_posts/` and read the 5 newest files (by filename date prefix).
   For each, read only the YAML frontmatter and the first 3 lines of the body.
   The point is to see what's been covered recently so the new draft doesn't
   repeat themes or angles.

4. Draft a Markdown post for the chosen topic. Constraints:
   - 800–1200 words total.
   - YAML frontmatter at the top:
     ```yaml
     ---
     title: <may polish the topic's wording into sentence case, no trailing period>
     slug: <use the topic id exactly>
     date: <today UTC, YYYY-MM-DD>
     author: VaultMesh
     excerpt: <one sentence, ≤160 chars — used in meta description and RSS>
     tags: [<2–4 lowercase tags from STYLE.md's recurring set>]
     ---
     ```
   - Body follows STYLE.md structure: hook → explanation in 3–5 `##` sections
     → what it means for the user → short close.
   - Use `##` for section headings, never `#`.

5. Write the draft to `blog/_drafts/<YYYY-MM-DD>-<slug>.md`. If a file with
   that exact name already exists, append `-2` (or `-3`, etc.) to the slug
   portion of the filename. Never overwrite an existing draft.

5b. Generate a cover SVG for the post and write it to
    `blog/posts/covers/<slug>.svg`. The SVG must be 1200×630 px. Design
    guidelines:
    - Background: a dark gradient that matches the post's primary tag color
      (breaches → dark red, phishing → dark amber, 2fa → dark green,
      habits → dark purple, myths → dark teal, passwords/accounts → dark navy).
    - Left side (x 56–680): left accent bar (x=56, w=4, h=518) in the accent
      color; "PASSWORD SENSE" label (monospace, 13px, letter-spacing 4) at
      y=100; the post title wrapped to ≤28 chars per line in Georgia serif
      (52–60px); date + tags and "VAULTMESH" wordmark at y=580 in white 30%
      opacity.
    - Right side (x 700–1200): a UNIQUE thematic illustration drawn with SVG
      primitives (circles, lines, paths, polygons) that visually represents the
      post's topic — NOT just abstract shapes, but something conceptually
      related to the article. Be creative and specific to the topic.
    - No external images or fonts. SVG elements only.

6. Update `blog/topics.json` in place:
   - Set the chosen topic's `status` to `"drafted"`.
   - Add a `"draft_path"` field with the relative path to the new file.
   - Preserve the JSON formatting (2-space indent, trailing newline).

7. Print a short summary to stdout:
   - Draft path
   - Title
   - Approximate word count
   - The topic id that was consumed

**Do not run `git commit` or `git push`.** A human reviews the draft, edits
if needed, and runs `scripts/publish.sh` to publish.

## Hard rules (from STYLE.md — non-negotiable)

This is a blog about everyday password and account security for general
readers. It is NOT a product blog and NOT a deep technical blog.

- Stay at the common-sense level. Do not dive into cryptographic protocols,
  code, or implementation details. If a topic naturally needs a technical
  term, define it the first time in plain English.
- Never fabricate statistics, percentages, or "studies show" claims. If you
  use a number, it must come from a real, linkable source. If you don't have
  one, rephrase without the number.
- Never name competitor products negatively. Discuss categories of design
  ("hosted password vaults", "browser-stored passwords") without naming
  brands.
- Never use absolutes: "uncrackable", "100% safe", "totally private",
  "impossible to breach". All security advice has bounds.
- No fear-mongering. Calibrate risk. Worst-case scare tactics are forbidden.
- No emoji. No exclamation points. No marketing-speak.
- No fabricated quotes, anecdotes, or customer stories.
- **VaultMesh brand rule**: at most ONE mention per post, and only when the
  post is naturally about the *category* of password managers. Use neutral
  phrasing like "such as VaultMesh." Never write a CTA, never write
  "unlike X, VaultMesh…", never list product features. If the post is not
  about password managers as a topic, do not mention VaultMesh at all.
