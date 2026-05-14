# Password Sense — Writing Style Guide

This is the contract for anyone (human or AI) writing a post for the VaultMesh blog. Read it fully before drafting.

## What this blog is

Password Sense is a blog about **everyday password and account security** — the practical, common-sense kind. Posts are written for people who use online accounts, not for engineers, not for cryptographers. The goal is to leave a reader with one or two concrete habits they can actually apply, not to make them feel they need a security degree.

The blog is published by the team behind VaultMesh, but this is **not a product blog**. We do not pitch VaultMesh, do not write competitive comparisons, do not run promotions. The blog's value comes from being useful to read, not from selling.

## Audience

Default reader: someone with a normal amount of online accounts — email, banking, shopping, work — who would like to be a bit safer but does not have time for a deep technical dive.

- Assume **no engineering background.** No assumed familiarity with crypto, networking, or security tooling.
- Technical readers are welcome to stop by, but they are not who you write for.
- Never condescend. The reader is smart, just busy and not specialized.

## Tone

- **Plain English.** Short sentences. Concrete examples over abstract claims.
- **Friendly and direct.** Like a security-aware friend explaining over coffee.
- **No fear-mongering.** "You are one click from total ruin" is forbidden. Real, calibrated risk beats worst-case dread every time.
- **No condescension.** "Believe it or not…" or "Many people don't realize…" patronize the reader. Cut them.
- **No marketing-speak.** "Revolutionary," "game-changing," "ultimate guide" — none of it.

## Structure

Posts should follow roughly this shape:

1. **Hook** — a common misconception or real-world frustration, in 1–2 short paragraphs. State the problem in human terms.
2. **What's actually true** — the core explanation. Use `##` headings to break this up. Two or three sections is usually enough.
3. **What to do about it** — concrete, applicable actions. The reader should be able to close the post and act on something today.
4. **Close** — one short paragraph. No "in conclusion."

**Length: 600–900 words.** Common-sense topics don't need length. If a post wants to grow longer, ask whether it's drifting into territory the reader didn't sign up for.

## Formatting conventions

- `##` for section headings (the post title is the `<h1>`).
- Inline code with backticks for things like example passwords or filenames: `correct-horse-battery-staple`.
- Block code (fenced ```) only when truly useful — most posts won't have any.
- Links: prefer official sources (browser vendor docs, NIST, the affected service's own help center). Avoid linking to news pieces or blog posts.
- Lists: use sparingly. Prose usually reads better. If a list is genuinely the right shape, keep it under 6 items.
- No images. The blog is text-only by design.

## Hard rules — never break these

- **No fabricated numbers, statistics, or "studies show."** If you cite a figure, it must come from a real, linkable source. If you don't have one, rephrase without the number.
- **No naming competitor products negatively.** You may discuss categories of design ("hosted password vaults," "browser-stored passwords") without naming brands.
- **No absolutes.** Avoid "uncrackable," "100% safe," "impossible to breach," "totally private." All security advice has bounds — say what they are.
- **No fear-mongering.** No worst-case scare tactics. Risk should be calibrated and proportionate.
- **No emoji. No exclamation points.** The voice stays calm.
- **No fabricated quotes or anecdotes.** "A friend once told me…" is fine if it actually happened to a real person. Inventing one is not.
- **VaultMesh brand appearance**: at most **one** mention per post, only when the post is naturally discussing the *category* of password managers, and only in a neutral phrasing like "such as VaultMesh." No call-to-action, no "unlike X, VaultMesh…" lines, no product features mentioned. If a post is not about password managers as a topic, do not mention VaultMesh at all.

## Tag set

Pick 2–4 tags per post from this recurring set. Don't invent new tags unless none of these fit:

`passwords`, `phishing`, `2fa`, `breaches`, `habits`, `myths`, `password-managers`, `accounts`.

## Frontmatter

```yaml
---
title: <sentence case, no trailing period>
slug: <kebab-case, matches the topic id>
date: <YYYY-MM-DD, UTC>
author: VaultMesh
excerpt: <one sentence, ≤160 chars — used in meta description and RSS>
tags: [<2–4 from the set above>]
---
```

## Closing checklist before submitting a draft

- Read it from the top. Does it sound like a friend giving advice, or like a textbook / an ad? It should sound like the first.
- Is every claim something you actually know is true? No invented stats, no hand-wavy "everyone agrees."
- Is it within 600–900 words?
- Is there at least one concrete action a reader could take after reading?
- If you mentioned VaultMesh, was it natural, neutral, and just once?
- Did you cut at least one sentence that wasn't earning its place?
