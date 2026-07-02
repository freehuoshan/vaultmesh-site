---
title: "Four random words: the passphrase that's stronger than it looks"
slug: passphrase-vs-password
date: 2026-07-02
author: VaultMesh
excerpt: "A four-word passphrase can be easier to remember than a complex password and harder to guess — but only if the words are chosen randomly."
tags: [passwords, habits]
---

At some point you've probably been told to use a passphrase — a short string of random words — instead of the typical jumble of characters. The pitch is that it's both strong and memorable.

The pitch is mostly right. But there's a catch that's easy to miss: the randomness is doing most of the work, and most people skip it.

## Why four words can beat a complex password

Length is the main driver of password strength, not complexity. A password like `Tr0ub4d0r&3` looks secure because of the uppercase letters, numbers, and symbol. In practice, an attacker systematically guessing passwords knows about common character substitutions — replacing "a" with "@", "o" with "0" — and accounts for them. The password is shorter than it looks, and the substitutions don't add as much protection as they appear to.

Four common words — `correct horse battery staple` — is around 25 characters without spaces. That length forces an attacker to work through a much larger space of possibilities, even if the individual words are ordinary. The math behind this isn't mysterious: more characters means more combinations to try, and "more combinations to try" is what makes something hard to guess.

The catch is that this holds up specifically when the words are chosen by a process that isn't you.

## Why your own word choices are weaker than you think

When people pick four words themselves, they reach for things that feel unrelated: "blue river forest moon." That sounds random. It isn't.

Human "random" is predictable. We favor certain kinds of words — concrete nouns, common adjectives, things that sound vaguely poetic or interesting. Attackers who build guessing strategies know this and build their tools accordingly. A method that focuses on common English nouns and natural-sounding combinations will land on `blue river forest moon` far sooner than a genuinely random selection from a large wordlist.

True randomness means the selection is made by a process that has no knowledge of what words you might prefer. Rolled dice against a numbered wordlist produce that. A well-designed software passphrase generator using a cryptographically random source does the same thing. Your brain, picking words you'll remember, does not — even when it feels like you're being unpredictable.

## How to generate one properly

The Electronic Frontier Foundation publishes a wordlist designed for exactly this purpose. Each word in the list is assigned a five-digit number. You roll a six-sided die five times to get each number, look up the corresponding word, and repeat until you have four or five words. The process ensures your passphrase comes from a large, well-defined pool of words, selected by dice rather than preference. The list and full instructions are at [eff.org/dice](https://www.eff.org/dice).

Most password managers and passphrase generators can produce the same result automatically — the key is that the generation uses genuine randomness, not a hand-picked selection.

## When a passphrase is the right tool

A randomly generated passphrase works best for credentials you actually need to type from memory: the master password for a password manager, a device unlock passphrase, or anything else you'll enter regularly without copy-paste.

For individual website logins, you're generally better off letting a password manager generate something fully random and store it — you don't need to remember those, so memorability isn't a requirement, and a longer fully random string is stronger still.

The passphrase's advantage is in the narrow set of passwords where you need both strength and recallability. For those, a randomly selected four or five word phrase threads the needle.

## What to actually do

If you need a new passphrase — for a device, a manager's master password, or anything you'll type regularly — use a method that removes your own preferences from the outcome. Roll dice against a wordlist, or use a generator you trust. Aim for four to five words.

Write it down when you first create it and keep the paper somewhere sensible — not next to the device it protects. After a week of daily typing, most people have it memorized without trying, and the paper becomes a backup rather than a necessity.

The version that holds up is the one you didn't choose.
