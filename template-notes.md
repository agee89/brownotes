Fitur template notes akan sangat berguna. Ini rekomendasi template yang relevan untuk berbagai use case:

## 📋 Template Notes yang Perlu Dimasukkan:

### 1. **Meeting Notes** 📝
```markdown
# Meeting: [Topic]

**Date:** {{date}}
**Time:** {{time}}
**Attendees:** 
- 
- 

## Agenda
1. 
2. 
3. 

## Discussion Points
- 

## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Meeting
**Date:** 
**Topics:** 

---
*Notes by {{nickname}}*
```

### 2. **Daily Journal** 📅
```markdown
# Daily Journal - {{date}}

## 🌅 Morning
**Mood:** 
**Goals for today:**
- [ ] 
- [ ] 
- [ ] 

## 📝 Notes & Thoughts


## ✅ Accomplishments
- 

## 🌙 Evening Reflection
**What went well:**

**What could be better:**

**Grateful for:**

---
**Energy Level:** ⭐⭐⭐⭐⭐
```

### 3. **Todo List** ✅
```markdown
# Todo - {{date}}

## 🔥 High Priority
- [ ] 
- [ ] 

## 📌 Medium Priority
- [ ] 
- [ ] 

## 💡 Low Priority
- [ ] 
- [ ] 

## ✅ Completed
- [x] 

## 📅 Scheduled for Later
- [ ] 

---
*Last updated: {{datetime}}*
```

### 4. **Code Snippet** 💻
```markdown
# Code Snippet: [Title]

**Language:** 
**Purpose:** 
**Date:** {{date}}

## Code
\`\`\`javascript
// Your code here

\`\`\`

## Usage
\`\`\`javascript
// Example usage

\`\`\`

## Notes
- 

## References
- 

---
**Tags:** #code #snippet
```

### 5. **Bug Report** 🐛
```markdown
# Bug Report: [Title]

**Date:** {{date}}
**Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low
**Status:** [ ] Open [ ] In Progress [ ] Resolved

## Description


## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior


## Actual Behavior


## Environment
- Browser: 
- OS: 
- Version: 

## Screenshots/Logs
\`\`\`

\`\`\`

## Solution
- [ ] 

---
**Reported by:** {{nickname}}
```

### 6. **Project Planning** 🎯
```markdown
# Project: [Name]

**Start Date:** {{date}}
**Deadline:** 
**Status:** [ ] Planning [ ] In Progress [ ] Review [ ] Completed

## Objective


## Scope
### In Scope
- 

### Out of Scope
- 

## Milestones
- [ ] Milestone 1 - 
- [ ] Milestone 2 - 
- [ ] Milestone 3 - 

## Resources Needed
- 

## Risks & Challenges
- 

## Success Criteria
- 

---
**Project Lead:** {{nickname}}
```

### 7. **Learning Notes** 📚
```markdown
# Learning: [Topic]

**Date:** {{date}}
**Source:** 
**Category:** 

## Key Concepts
- 

## Summary


## Code Examples
\`\`\`

\`\`\`

## Important Points
- 💡 
- ⚠️ 
- ✅ 

## Questions
- [ ] 

## Related Topics
- 

## Practice Tasks
- [ ] 
- [ ] 

---
**Tags:** #learning #notes
```

### 8. **Brainstorming** 💡
```markdown
# Brainstorming: [Topic]

**Date:** {{date}}
**Goal:** 

## Ideas
1. 💡 
2. 💡 
3. 💡 

## Pros & Cons
### Idea 1
**Pros:**
- 

**Cons:**
- 

## Next Steps
- [ ] 
- [ ] 

## Resources
- 

---
*Keep thinking! 🚀*
```

### 9. **Book/Article Notes** 📖
```markdown
# Notes: [Title]

**Author:** 
**Type:** [ ] Book [ ] Article [ ] Video [ ] Podcast
**Date Read:** {{date}}
**Rating:** ⭐⭐⭐⭐⭐

## Summary


## Key Takeaways
1. 
2. 
3. 

## Favorite Quotes
> 

## My Thoughts


## Action Items
- [ ] 
- [ ] 

## Related Reading
- 

---
**Tags:** #reading #notes
```

### 10. **Weekly Review** 📊
```markdown
# Weekly Review - Week {{week}}

**Period:** {{date}} - 
**Overall Rating:** ⭐⭐⭐⭐⭐

## 🎯 Goals Achieved
- [x] 
- [x] 

## 📈 Progress
**What went well:**
- 

**What needs improvement:**
- 

## 📝 Key Learnings
- 

## 🔥 Highlights
- 

## 📅 Next Week Goals
- [ ] 
- [ ] 
- [ ] 

## 💭 Reflections


---
*Reviewed by {{nickname}}*
```

### 11. **Quick Note** ⚡
```markdown
# Quick Note

**Date:** {{datetime}}

---
*Quick capture*
```

### 12. **Research Notes** 🔬
```markdown
# Research: [Topic]

**Date:** {{date}}
**Research Question:** 

## Background


## Findings
### Finding 1
**Source:** 
**Summary:** 

### Finding 2
**Source:** 
**Summary:** 

## Data/Evidence
- 

## Analysis


## Conclusions
- 

## Further Research Needed
- [ ] 

## References
1. 
2. 

---
**Tags:** #research
```

---

## 🎨 Implementasi Suggestion:

### Template Structure (JSON):
```javascript
const noteTemplates = [
  {
    id: 'meeting',
    name: 'Meeting Notes',
    icon: '📝',
    category: 'work',
    content: '# Meeting: [Topic]\n\n**Date:** {{date}}...'
  },
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    icon: '📅',
    category: 'personal',
    content: '# Daily Journal - {{date}}...'
  },
  // ... dst
];
```

### Variables yang Bisa Di-replace:
- `{{date}}` - Tanggal hari ini (format: 9 May 2026)
- `{{datetime}}` - Tanggal + waktu (format: 9 May 2026, 14:30)
- `{{time}}` - Waktu saja (format: 14:30)
- `{{nickname}}` - Nickname user dari settings
- `{{week}}` - Nomor minggu dalam tahun

### UI Flow:
1. Button "Template" dengan icon /toolbar/preset.svg di editor, posisi kanan di toolbar.
2. Modal popup dengan grid template cards
3. Click template → auto-fill editor dengan content termasuk title
4. User bisa langsung edit
5. Support dark mode