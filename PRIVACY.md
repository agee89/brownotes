# Privacy Policy - Bro Notes

**Last Updated:** January 2024  
**Version:** 3.0.0

## Overview

Bro Notes is committed to protecting your privacy. This extension is designed with a **privacy-first** approach.

## Data Collection

### What We DON'T Collect
- ❌ **No personal information** - We don't collect names, emails, or any personal data
- ❌ **No browsing history** - We don't track which websites you visit
- ❌ **No webpage content** - We don't read or access the content of web pages
- ❌ **No analytics** - We don't use Google Analytics or any tracking services
- ❌ **No telemetry** - We don't send usage data anywhere
- ❌ **No cookies** - We don't set any cookies
- ❌ **No external servers** - We don't communicate with any external servers

### What We DO Store
- ✅ **Your notes** - Stored locally in your browser using Chrome Storage API
- ✅ **Your settings** - Nickname and preferences stored locally
- ✅ **Your labels** - Label names stored locally

**All data is stored locally in your browser and never leaves your device.**

## Data Storage

### Chrome Storage API
- All data is stored using Chrome's `chrome.storage.local` API
- Data is stored on your device only
- Data persists across browser sessions
- Data is tied to your Chrome profile

### Storage Location
- **Windows:** `%LOCALAPPDATA%\Google\Chrome\User Data\Default\Local Extension Settings\`
- **Mac:** `~/Library/Application Support/Google/Chrome/Default/Local Extension Settings/`
- **Linux:** `~/.config/google-chrome/Default/Local Extension Settings/`

## Permissions

### Why We Need Them

**`storage`**
- To save your notes locally
- To persist settings across sessions

**`activeTab`**
- To inject the drawer UI into the current tab
- Only when you click the extension icon

**`scripting`**
- To inject content scripts into tabs
- Required for the drawer to appear

**`host_permissions: <all_urls>`**
- To make the extension available on all websites
- Does NOT mean we read webpage content
- Only used to inject the drawer UI

## Data Security

### Local Storage
- All data stored locally in your browser
- Protected by Chrome's security model
- No transmission over network
- No server-side storage

### Export/Import
- You can export your data as JSON
- You control where the file is saved
- Import validates data before loading
- No data sent to external services

## Third-Party Services

**We use ZERO third-party services:**
- ❌ No analytics (Google Analytics, etc.)
- ❌ No crash reporting (Sentry, etc.)
- ❌ No CDNs (all code is local)
- ❌ No external APIs
- ❌ No cloud storage
- ❌ No advertising networks

## Data Deletion

### How to Delete Your Data

**Option 1: Clear from Extension**
1. Open Bro Notes
2. Go to Settings
3. Delete individual notes or labels

**Option 2: Uninstall Extension**
1. Go to `chrome://extensions/`
2. Remove Bro Notes
3. All data is automatically deleted

**Option 3: Clear Chrome Data**
1. Go to `chrome://settings/clearBrowserData`
2. Select "Site settings" or "Hosted app data"
3. Clear data

## Open Source

- ✅ **Source code is public** - You can audit the code
- ✅ **No obfuscation** - Code is readable
- ✅ **No hidden functionality** - What you see is what you get
- ✅ **Community reviewed** - Open to security audits

## Children's Privacy

Bro Notes does not knowingly collect any information from children under 13. The extension is designed for general use and does not target children.

## Changes to Privacy Policy

We may update this privacy policy from time to time. Changes will be reflected in:
- This document
- Extension version number
- CHANGELOG.md

## Contact

If you have questions about this privacy policy:
- Open an issue on GitHub
- Review the source code
- Check the documentation

## Your Rights

You have the right to:
- ✅ **Access your data** - All data is in Chrome Storage (see Storage Location above)
- ✅ **Export your data** - Use the export feature
- ✅ **Delete your data** - Uninstall the extension or clear data
- ✅ **Control your data** - All data stays on your device

## Compliance

### GDPR (EU)
- ✅ No personal data collected
- ✅ No data processing
- ✅ No data transfers
- ✅ User has full control

### CCPA (California)
- ✅ No personal information sold
- ✅ No personal information shared
- ✅ No personal information collected

### Other Regulations
Since we don't collect any data, we comply with virtually all privacy regulations worldwide.

## Summary

**In simple terms:**
- We don't collect anything
- We don't send anything anywhere
- Everything stays on your device
- You have full control
- You can verify this by reading the source code

---

**Bro Notes** - Privacy-first note taking 🔒

Version 3.0.0 | [README](README.md) | [Source Code](https://github.com/yourusername/bronotes)
