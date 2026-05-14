---
title: Strong passwords vs complex passwords — they're not the same
slug: strong-vs-complex
date: 2026-05-14
author: VaultMesh
excerpt: Symbols and uppercase letters feel like strength, but length and unpredictability are what actually make a password hard to guess.
tags: [passwords, habits, myths]
---

Most password requirements you've encountered follow the same pattern: at least one uppercase letter, one number, one special character. Companies implemented this rule, IT departments enforced it, and somewhere along the way people accepted that mixing in a `!` and a capital letter is what makes a password safe.

The trouble is that this rule doesn't measure what it appears to measure. It measures *complexity* — whether different character types are present. What it doesn't measure is *strength* — how resistant a password actually is to someone trying to guess it. Those two things can come apart, and when they do, it matters.

## Why complexity doesn't equal strength

Think about how passwords get guessed. One common method works through prebuilt lists: databases of previously leaked passwords, common phrases, and known substitution patterns. Another method applies predictable transformations automatically — capitalize the first letter, swap `a` for `@` and `o` for `0`, tack a number and `!` onto the end.

These patterns are so well-understood that automated tools have them built in.

`P@ssw0rd1` satisfies almost any complexity rule. Uppercase, lowercase, symbol, number — it's all there. It also appears near the top of commonly-tried password lists, because the substitutions are exactly what tools are designed to try. An attacker isn't going to skip it because of the `@`.

The complexity is real. The strength is not.

This doesn't mean complexity rules are worthless — they do filter out the most obvious choices like `password` or `123456`. But they set a false ceiling. Once you've satisfied the minimum requirement, it's easy to stop there, and that often means a short, patterned password that happens to include a symbol.

## What actually makes a password hard to guess

The bigger driver of strength is length. Each character added to a password multiplies the number of possible combinations that would need to be tried to find it by brute force. A 20-character password made of plain lowercase letters has more possible combinations than a 6-character password with symbols, uppercase, and numbers mixed in. The longer one takes far more guesses to find — not because the characters are exotic, but because there are more of them.

Randomness is the other factor. A password invented by a person — even a careful person — tends to follow human patterns. Meaningful dates, names, references to things you care about, words that feel like they fit together. Attackers know what people tend to pick and weight their guesses to reflect that. A password where no human judgment shaped any single character doesn't carry those patterns. There's nothing to predict.

## The four-word example

A randomly selected word phrase — four words drawn from a word list by a genuinely random process — illustrates both principles working together. The phrase is long, and if the words were chosen at random rather than by a person, it's unpredictable.

The catch is the word "randomly." Sitting down and choosing four words that seem unrelated is not the same thing. That's human judgment, which means human patterns, which means something a guessing tool can partially exploit. The security of a word-based passphrase comes from the randomness of the selection, not the word count.

Tools like the EFF's diceware word list work by using physical dice to remove the person from the selection process entirely. You roll, you look up the result, you don't choose. That's the difference between a passphrase that's genuinely hard to guess and one that only feels that way.

## What to do with this

For a password you need to keep in your head — one that unlocks an important account, or serves as a master password — length and randomness matter more than symbols. A long phrase chosen through a random process will generally outperform a short, complex string you invented yourself, because the phrase has more characters and no predictable human patterns embedded in it.

For everything else, a password manager can generate and store fully random passwords for each of your accounts, at whatever length you specify. The length-versus-complexity tradeoff stops being something you have to reason through manually for every site.

One practical note: some sites impose restrictions that make long phrases impractical — no spaces allowed, character limits of 12 or 16. Work within those constraints, but treat them as a limitation of that site, not as guidance for how to think about passwords in general.

The goal is a password that's genuinely hard to guess. Complexity rules were an attempt to get there, but they measure the wrong thing. Length and randomness are closer to what actually counts.
