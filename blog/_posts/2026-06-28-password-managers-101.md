---
title: What a password manager actually does (and doesn't do)
slug: password-managers-101
date: 2026-06-28
author: VaultMesh
excerpt: Password managers are simpler than they sound — here's what they store, how the master password works, and what happens if you forget it.
tags: [passwords, password-managers, habits]
---

Most people have heard they should use a password manager. Far fewer actually use one. The gap is usually not skepticism — it's uncertainty. What does a password manager actually do? Is it storing your passwords somewhere on the internet? What happens if someone gets in?

These are reasonable questions. Here's what's actually going on.

## It's a locked box for credentials

A password manager stores your usernames, passwords, and sometimes notes or card numbers in an encrypted file or database. When you want to log in somewhere, it looks up the credentials for that site and fills them in for you.

The encryption is the important part. The contents of that file are scrambled in a way that makes them unreadable without the right key. That key comes from your master password — the one password you do have to remember. Without it, the file is just noise to anyone who gets hold of it.

What a password manager does not do: it doesn't send your passwords to websites on your behalf, doesn't manage your sessions, and doesn't do anything when you're not actively using it. It's a storage tool, not an agent acting on your behalf.

## The master password is the only one you hold

Your master password is never stored anywhere. Not on your device, not on any server. When you type it in, the app uses it to decrypt the database, shows you your credentials, and then discards the password from memory when you lock the app.

This is why forgetting your master password is a real problem. There is no "forgot password" link. No one can send you a reset email, because no one else holds your master password to verify against. Some managers let you set up an emergency recovery method — a printed recovery key, a trusted contact — but these are opt-in features. If you skip them and forget your password, the database stays locked.

The upside of this design is that it also means no one can get in through a back door. If a company's servers are breached, attackers get encrypted files they can't read without a master password they don't have.

## Where the database actually lives

Different managers make different choices about where the database file sits.

Some store it on their own servers and sync it to all your devices automatically. This is convenient — change a password on your phone and it's updated on your laptop within seconds. The tradeoff is that you're trusting the company's infrastructure to stay secure and available.

Others keep the database entirely on your device, or let you choose where to store it — a local folder, a sync service you already use, or nothing at all. A local-first approach like this means you're not dependent on any company's uptime or server security. The tradeoff is that syncing across devices takes a bit more setup. VaultMesh is one example of a local-first option if you want to see what that looks like in practice.

Neither approach is wrong. The right choice depends on how much you're comfortable relying on third-party infrastructure versus how much you prefer to manage things yourself.

## How this compares to browser-saved passwords

Browsers offer to save passwords too, and many people already use this. It's not a bad start. The gaps show up over time: browser-saved passwords are tied to a specific browser, can be harder to use across different apps, and the security model depends on whether you have a device lock set.

A dedicated password manager is more consistent across browsers and apps, gives you one place to see and audit everything you've stored, and tends to have more explicit controls around locking and access.

## What to actually do

If you've never used a password manager, start small. Pick the accounts you care most about — email, banking, one or two work accounts — and move those into the manager first. While you're at it, let it generate a new, random password for each one. That's the main practical benefit: you stop having to think of passwords yourself.

Pick a master password that's long and unusual — something you'll remember even after a week away from a computer. Write it down on paper and keep it somewhere sensible: not on a sticky note on your monitor, but not so hidden you can't find it in an emergency.

That's enough to start. The rest — migrating every account, exploring sync options, turning on two-factor authentication — can happen gradually.

A password manager doesn't solve every security problem. It doesn't protect you if someone is watching your screen, and it doesn't help if your master password itself is easy to guess. But for the specific problem of having too many accounts to handle responsibly, it's the most practical solution available.
