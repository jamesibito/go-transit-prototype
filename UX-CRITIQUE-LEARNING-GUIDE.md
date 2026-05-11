# GO Transit App — UX Critique Learning Guide

> A detailed breakdown of 8 usability and design issues found in your GO Transit prototype, written for an early-career designer who wants to understand *why* each issue matters and *how* to avoid it in future projects.

---

## How to Read This Document

Each issue follows this structure:

1. **What's happening** — a plain description of the current design
2. **Why it's a problem** — the UX principle being violated and who it affects
3. **The design principle** — a reusable rule you can apply to any project
4. **What good looks like** — how other apps solve this, and what we'll build
5. **Impact & effort** — how much this matters vs. how hard it is to fix

Impact is rated: **High** (users will notice and be frustrated), **Medium** (it weakens the experience but isn't blocking), **Low** (polish issue, nice-to-have).

---

## Issue 1: The Home Screen Doesn't Answer the User's First Question

### What's happening

The landing screen shows a greeting ("Good morning / Where are you headed?"), a "New Trip?" button, and a list of Saved Lines showing past departure times like "9:54 AM" and "8:54 AM."

### Why it's a problem

When a commuter opens a transit app, they have one urgent question: **"When is my next train?"** Your current home screen makes them work to find that answer — they'd need to tap "New Trip?", fill in a search, and wait for results. That's 3-4 taps for the most common action.

The saved lines section shows *past* departure times with no context. "9:54 AM" means nothing if I'm looking at the app at 2:00 PM. Are these upcoming? Historical? The user can't tell.

### The design principle

> **"Surface the most important information at the point of highest attention."**

The home screen gets the most views of any screen in your app. It's your most valuable real estate. The information shown there should match the user's most frequent need — which for transit is "next departure from my usual station."

This is sometimes called the **"glance test"** — can a user get the answer they need within 2 seconds of opening the app, without tapping anything?

Apps that do this well:
- **Citymapper** shows "Leave in X min" countdown for your saved routes
- **Google Maps** shows commute time from your current location on the home tab
- **Transit App** shows a real-time countdown for nearby departures

### What good looks like

We'll replace the static saved lines with a **"Next Departure" card** that shows:
- The next train from the user's saved station
- A countdown ("Leaves in 12 min")
- The line name and destination
- A subtle "View all departures" link

This way, the user opens the app and instantly sees what they need.

### Impact: HIGH | Effort: MEDIUM

This is the single highest-value change because it affects every single app open. It transforms the app from "a tool I use to search" into "a tool that already knows what I need."

---

## Issue 2: Search Results Appear Instantly (No Loading State)

### What's happening

When the user taps "See Schedule" on the search screen, the bottom sheet slides up and results are already there — fully populated, no delay.

### Why it's a problem

In a real app, tapping "See Schedule" would trigger a network request to fetch train times. That takes anywhere from 200ms to 3 seconds. If your prototype shows results instantly, it feels *fake* — and when a recruiter or interviewer uses your portfolio piece, that fakeness undermines the credibility of your entire case study.

More importantly: **loading states are part of the design.** A senior designer reviewing your portfolio will notice their absence. It signals that you haven't thought about the full user journey, which includes waiting, errors, and empty results.

### The design principle

> **"Design for every state, not just the happy path."**

Every screen in an app has multiple states:
1. **Empty state** — no data yet (first-time user, no results found)
2. **Loading state** — data is being fetched
3. **Loaded state** — data is displayed (this is the only one you currently have)
4. **Error state** — something went wrong

These are sometimes called the **"5 states of UI"** (add "partial" for large lists). Designing all of them shows maturity and thoroughness. In your portfolio, it demonstrates you understand real-world product constraints.

### What good looks like

We'll add a **shimmer/skeleton loading state** that shows for ~800ms before results appear. This consists of grey placeholder rectangles that pulse with a subtle animation, mimicking the shape of trip cards. It's a small addition that makes the entire flow feel 10x more real.

### Impact: HIGH | Effort: LOW

This is your best return-on-investment fix. It takes very little code but dramatically increases the perceived quality of the prototype.

---

## Issue 3: All Trip Cards Look the Same (No Visual Hierarchy)

### What's happening

In the search results bottom sheet, there are 5 upcoming trips listed. Every card looks identical — same size, same color, same visual weight. The only difference is the departure time.

### Why it's a problem

When a commuter scans a list of departures, they're looking for **one thing**: the next available train. Making all 5 cards look the same forces the user to read each time and mentally calculate which one is next. That's unnecessary cognitive work.

### The design principle

> **"The most important item should be the most visually prominent."**

This is called **visual hierarchy** — using size, color, spacing, or labels to guide the user's eye to what matters most. In a list of upcoming departures, the first/next departure is almost always what the user wants. Cards 2-5 are backup options.

You see this pattern everywhere:
- **Spotify** makes the currently playing song larger than the queue
- **Uber** highlights the recommended ride option with a border and "Recommended" badge
- **iOS Weather** makes today's forecast larger than the 10-day forecast items

### What good looks like

We'll make the first trip card visually distinct:
- Add a small green **"Next"** badge in the top-right corner
- Give it a slightly different background tint or subtle left border
- Keep cards 2-5 as they are — the contrast alone makes card 1 stand out

### Impact: MEDIUM | Effort: LOW

A small visual change that shows you understand information hierarchy — a core UX skill.

---

## Issue 4: The "Return Trip" Toggle Has No Explanation

### What's happening

On the Fares screen (E-Ticket tab), there's a toggle labeled "Return Trip" between the search form and the passenger selectors. Toggling it on/off has no visible effect — no price change, no explanation of what it does.

### Why it's a problem

The user is about to make a purchasing decision. They're looking at fares. A mystery toggle creates uncertainty: *"If I turn this on, does my price double? Is there a discount? Does it add a return ticket to my cart?"*

Uncertainty in a purchasing flow causes **abandonment**. If the user doesn't understand a control, they either ignore it (missing out on value) or leave the screen entirely.

### The design principle

> **"Every interactive element should communicate its consequence before the user acts."**

This is about **affordance** and **feedback**. A toggle should either:
- Have a descriptive label that explains the outcome ("Add same-day return — free with e-ticket")
- Show an immediate visible change when toggled (price updates, a return trip appears in the summary)
- Ideally, both

### What good looks like

We'll add a one-line description below the toggle that explains what it does:
- OFF: "Add a return trip to your fare"
- ON: "Same-day return included — no extra charge"

This removes ambiguity and actually encourages users to enable it (which is good for their experience).

### Impact: MEDIUM | Effort: LOW

Simple copy change, but it shows you think about microcopy and decision-support in transactional flows.

---

## Issue 5: There's No Ticket After "Buying" One

### What's happening

On the Trip Details screen, there's a "Buy E-Ticket" button. Tapping it navigates to the Fares screen — a form where you'd configure a new ticket purchase. There's no confirmation, no ticket, no receipt.

### Why it's a problem

This is the **core job** of the app. A transit app exists so users can get from A to B, and the ticket is the artifact that enables that. The user journey is:

`Search → Pick a trip → Buy a ticket → **Have a ticket** → Board the train`

Your prototype covers steps 1-3 but skips the payoff. It's like a shopping app that has a beautiful product page and cart but no order confirmation. The user's mental model expects closure, and when it doesn't arrive, the experience feels incomplete.

For a portfolio piece, this is especially important because **interviewers will click through the entire flow**. If it dead-ends at the Fares screen, they'll remember that more than all the polish you put into other screens.

### The design principle

> **"Complete the core user journey from trigger to resolution."**

In UX, this is called **"closing the loop."** Every user journey has a beginning (need), middle (action), and end (resolution). Your prototype handles the beginning and middle beautifully but is missing the resolution.

The resolution for a transit ticket purchase is: seeing your ticket, ready to use. Think of how satisfying it feels when you buy a concert ticket and see the barcode appear. That's the moment of value delivery.

### What good looks like

We'll add a **Ticket Confirmation screen** that appears after purchase:
- Animated checkmark at the top ("Ticket Purchased!")
- A ticket-shaped card with a QR code
- Trip details (route, time, date)
- A "Save to Wallet" button (non-functional but realistic)
- "Done" button to return home

This single screen transforms the prototype from "a set of screens" into "a complete product experience."

### Impact: HIGH | Effort: HIGH (but worth it)

This is the most work of any fix, but it completes the story. A portfolio reviewer will remember the satisfying end-to-end flow.

---

## Issue 6: Service Alert Badges Never Clear

### What's happening

On the Service Updates screen, each line/stop has an amber badge with a number (e.g., "1" or "2"). When you expand an alert and read it, the badge stays the same. There's no way to dismiss or mark alerts as read.

### Why it's a problem

Badge numbers create a **psychological contract** with the user: "You have unread information." When that number never goes away, the contract is broken — the user feels like the app isn't listening to them. Over time, they learn to ignore the badges entirely (this is called **notification fatigue**).

### The design principle

> **"Acknowledge user actions. If you show a count, let the user reduce it."**

Any indicator of "unread" or "new" content should have a clear path to "read" or "dismissed." Otherwise, it's visual noise that trains users to ignore important signals.

### What good looks like

We'll make the badge count decrement when the user expands and reads an alert. Once all alerts for a line are read, the badge disappears. This is a subtle but satisfying interaction.

### Impact: MEDIUM | Effort: MEDIUM

Shows attention to micro-interactions and state management — things that separate junior portfolios from standout ones.

---

## Issue 7: Some Text Fails Accessibility Contrast Standards

### What's happening

Several places in the app use light grey text (#888 or #999) on white backgrounds. Examples:
- "Trip time: 35 min" on Trip Details
- "Stouffville" line labels on trip cards
- "Today, Thu May 7" on the results sheet
- Age range subtexts on the Fares screen

### Why it's a problem

The Web Content Accessibility Guidelines (WCAG) require a contrast ratio of at least **4.5:1** for normal text. `#888` on white (#fff) has a ratio of about **3.5:1** — below the threshold. This means users with low vision, older users, or anyone in bright sunlight will struggle to read these labels.

Accessibility isn't just about screen readers. It's about making sure your design works for the widest possible range of people and conditions.

### The design principle

> **"If text carries meaning, it must be readable by everyone."**

A good rule of thumb: if you need to squint to read it on your phone outside, it's too low contrast. Decorative text can be lighter, but informational text (times, labels, descriptions) needs to meet the 4.5:1 standard.

Tools to check this:
- **WebAIM Contrast Checker** (webaim.org/resources/contrastchecker)
- **Figma plugins**: "Stark" or "A11y - Color Contrast Checker"
- **Chrome DevTools**: Inspect element → color picker shows contrast ratio

### What good looks like

We'll bump muted text from #888/#999 to **#666**, which gives a contrast ratio of ~5.7:1 — comfortably above the WCAG AA threshold while still looking secondary and muted.

### Impact: MEDIUM | Effort: LOW

Accessibility awareness is increasingly expected in junior portfolios. This is an easy win that shows you think beyond the visual surface.

---

## Issue 8: Menu Drawer Doesn't Show Where You Are

### What's happening

The hamburger menu opens a green drawer with navigation items: Trip Planning, Fares, Service Updates, About GO, Settings. None of them indicate which screen is currently active.

### Why it's a problem

When a user opens a menu, they're doing two things: (1) looking for where to go next, and (2) confirming where they are now. Without an active state indicator, the menu only serves purpose #1.

This matters more when screens look similar (e.g., Fares and Trip Details both have green buttons and similar layouts). The menu is a wayfinding tool — it should orient the user.

### The design principle

> **"Always show the user where they are within the navigation structure."**

This is one of Jakob Nielsen's 10 usability heuristics: **"Visibility of system status."** The system (your app) should always keep users informed about what's going on — and that includes their current location.

You see active states everywhere:
- iOS tab bars highlight the active tab
- Sidebar menus in web apps bold or highlight the current page
- Breadcrumbs show the current position in a hierarchy

### What good looks like

We'll add a subtle left-side accent bar and slightly lighter text color on the active menu item. It's a tiny visual cue that provides orientation.

### Impact: LOW | Effort: LOW

A small detail, but it shows you understand navigation patterns and system status communication.

---

## Summary: Your Learning Checklist

These 8 issues map to fundamental UX principles that apply to *every* project you'll work on:

| # | Principle | One-line reminder |
|---|---|---|
| 1 | Surface key info at highest attention | Home screen = most frequent need |
| 2 | Design all states, not just the happy path | Loading, empty, error, loaded |
| 3 | Visual hierarchy guides the eye | Most important = most prominent |
| 4 | Controls must explain their consequence | Labels + feedback before action |
| 5 | Complete the core journey | Trigger → Action → Resolution |
| 6 | Acknowledge user actions | If you show a count, let them clear it |
| 7 | Accessible contrast is non-negotiable | 4.5:1 for all informational text |
| 8 | Show where the user is | Active states in navigation |

Save this checklist. Before finalizing any future project, walk through each item and ask: "Does my design address this?" If you can answer yes to all 8, your work will be significantly stronger than most junior portfolios.

---

*Document generated as part of the GO Transit App Redesign case study — May 2026*
