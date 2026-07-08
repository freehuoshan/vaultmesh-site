---
title: "SIM swapping: when someone steals your phone number"
slug: sim-swap-explained
date: 2026-07-08
author: VaultMesh
excerpt: A SIM swap attack transfers your phone number to someone else's device — and with it, any verification codes your accounts send via text.
tags: [2fa, accounts, habits]
---

Your phone number does more than receive calls. For many accounts, it's a security checkpoint: a bank texts a code before allowing a transfer, an email provider sends a login verification, an account recovery flow delivers a one-time password. Whoever holds that number receives those messages.

A SIM swap attack is a method for someone else to end up with it.

## How it works

Mobile carriers support the transfer of phone numbers between SIM cards — this is what allows you to keep your number when you switch providers or get a new phone. The same process becomes an attack vector when someone impersonates you to your carrier.

The attacker contacts customer service or visits a store, claiming to be you and requesting a number transfer. They may have personal information gathered from social media, past data breaches, or public records to help them pass identity verification. If they satisfy the carrier's checks, the carrier transfers your number to a SIM card in the attacker's control.

At that point, your phone loses its connection. Their device starts receiving your calls and texts. Any service sending a code to your number is now sending it to them.

## What it enables

SMS-based two-factor authentication sends a code to your phone number when you log in. If an attacker holds your number, they receive that code. Combined with your password — which they may already have from a breach or phishing attack — they can complete the login and take over the account.

Account recovery flows that rely on a phone number are equally vulnerable. The attacker can use your number to trigger password resets on accounts connected to it, locking you out before you realize what's happening.

SIM swapping is less common than phishing and considerably more targeted. It tends to focus on people with something specific worth taking — cryptocurrency holdings, valuable social media accounts, or access to business systems. For most people the direct risk is lower than other threats. It's still worth addressing at the places where SMS is your only security layer.

## What reduces the exposure

**Set a PIN on your carrier account.** Most mobile carriers let you add an account PIN or passcode that must be provided before changes like number transfers can be made. This doesn't eliminate the risk entirely — a determined attacker may find ways around it — but it raises the bar significantly against opportunistic attempts. Log into your carrier's account portal or call customer service to set this up.

**Use an authenticator app instead of SMS for important accounts.** An authenticator app generates codes locally on your device rather than receiving them via text. A SIM swap has no effect on it — the attacker's device won't generate your codes just because they have your number. For email, banking, and any account with significant value, switching from SMS codes to an authenticator app is the more durable option.

**Turn on account-change notifications from your carrier.** Many carriers can send an alert when significant account changes are made, including number transfers. Catching a SIM swap early — while you still have time to contact your carrier and reverse it — dramatically limits the damage.

## Keeping it in proportion

A carrier PIN and authenticator-based two-factor authentication for your most important accounts handles most of the realistic exposure for most people. You don't need to treat every text message as a threat.

The larger point is that SMS verification, while better than nothing, is a weaker link in the chain than it appears. Where the option to use something better exists, it's worth taking. That's true regardless of SIM swapping — SMS codes can also be intercepted in other ways, and phishing sites can prompt you to hand them over in real time. Authenticator apps don't have these weaknesses.
