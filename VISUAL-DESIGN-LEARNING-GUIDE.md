# Visual Design Learning Guide
## Why Every Change Matters: Before vs After Analysis

This document walks through each visual design change made to the GO Transit prototype and explains *why* it improved the design. Use this as a reference when making visual decisions in future projects.

---

## 1. Color Palette: From Dreary to Energizing

### What Changed
- **Before:** Muted sage green (`#4a7729`) with grey-toned supporting colors
- **After:** Vibrant forest green (`#357a1e`) with a full supporting palette of mint greens, warm greys, and amber accents

### Why It Matters

**Saturation communicates energy and trust.** The original green was technically "on brand" but felt muddy on screen. Digital interfaces need slightly more saturated colors than print because screens emit light differently than ink reflects it. A brighter green feels more alive, more trustworthy, and more modern.

**A complete palette prevents ad-hoc color choices.** The original design used random greys and greens wherever needed. The new design has a deliberate system:
- `#357a1e` — Primary actions and brand identity
- `#e6f2e0` — Light green for icon containers and soft backgrounds
- `#f0f7ec` — Even lighter mint for input fields and subtle fills
- `#d5e6cc` — Green-tinted border color (feels warmer than pure grey borders)
- `#1a1d21` — Near-black for primary text (softer than pure `#000`)
- `#555b64` — Secondary text (readable but clearly subordinate)
- `#6b7280` — Muted labels and metadata
- `#d97706` — Amber for notification badges (stands out against green)

### The Design Principle
> **Build a color system, not a color choice.** Every color should have a clear role. If you can't explain why you used a particular shade, you probably haven't thought through the hierarchy.

### How to Apply This
When starting any project:
1. Pick your primary brand color and adjust for screen vibrancy
2. Create 2-3 lighter tints of it for backgrounds and containers
3. Choose a neutral grey scale (4-5 steps from near-white to near-black)
4. Pick one accent color that contrasts with your primary (amber/orange works great with green)
5. Document each color's purpose so you don't drift

---

## 2. Typography Hierarchy: Weight as a Weapon

### What Changed
- **Before:** Inconsistent font weights, some text felt flat and same-y
- **After:** Deliberate weight scale: 900 for headings, 800 for subheads, 700 for labels, 500 for body, regular for metadata

### Why It Matters

**Weight creates visual hierarchy without changing size.** Look at the Trip Details screen: "Miliken GO" (origin) is 16px/800 weight, while "Agincourt GO" (intermediate stop) is 14px/500. They're close in size, but the weight difference instantly tells you which stops matter.

**Font weight is faster to process than color.** Users scan bold text first, then read lighter text for details. This is called the "scan layer" — the bold items form a summary you can read in 2 seconds.

### The Design Principle
> **Design for scanning, not reading.** Most users will glance at your screen for 2-3 seconds before deciding where to focus. Bold text should tell the whole story at a glance.

### How to Apply This
Create a weight scale for each project:
- **900 (Black):** Page titles, hero numbers (use sparingly — 1-2 per screen)
- **800 (ExtraBold):** Section headers, card titles, prices
- **700 (Bold):** Labels, button text, important metadata
- **500 (Medium):** Supporting text, descriptions
- **400 (Regular):** Fine print, timestamps, tertiary info

---

## 3. Search Form: From Invisible to Inviting

### What Changed
- **Before:** Grey background fields with grey placeholder text — low contrast, hard to distinguish from surrounding elements
- **After:** Light mint background (`#f0f7ec`) with green border (`#d5e6cc`), green "FROM"/"TO" labels, green MapPin icon

### Why It Matters

**Input fields must look interactive.** The original grey-on-grey design violated a basic usability rule: interactive elements should visually stand out from static content. Users couldn't immediately tell "oh, I tap here."

**Color-coding creates belonging.** By making the search fields green-tinted, they visually "belong" to the GO Transit brand. This feels intentional rather than generic. Compare this to a plain white field with a grey border — it could be from any app.

**Labels above inputs beat placeholder text.** The green "FROM" and "TO" labels are always visible, even when the field has content. Placeholder-only labels disappear when you type, forcing users to rely on memory.

### The Design Principle
> **Interactive elements should pass the "squint test."** Squint at your screen — can you still identify where to tap? If input fields blend into the background, they'll feel dead.

### How to Apply This
For form fields:
1. Give them a distinct background color (even slightly tinted)
2. Add a visible border (not too heavy, 1-1.5px)
3. Use persistent labels above or inside the field
4. Include an icon to reinforce the field's purpose
5. Make sure the field looks different from read-only text

---

## 4. Card Design: Depth and Containment

### What Changed
- **Before:** Flat cards with minimal borders, unclear where one element ends and another begins
- **After:** Rounded cards (`border-radius: 16px`) with subtle borders (`#e4ebe2`), light background tints, and consistent padding

### Why It Matters

**Cards create visual chunks.** The human brain processes information in groups. A card with a clear border says "these things belong together." Without it, the eye has to work harder to figure out what's related.

**Subtle depth feels premium.** The new cards use a very light box-shadow (`0 2px 12px rgba(0,0,0,0.06)`) — you almost can't see it consciously, but it makes the card feel like it floats slightly above the page. This tiny detail separates "student project" from "production app."

**Consistent border-radius creates cohesion.** Every card, button, and container in the redesign uses `border-radius: 16px` (or `rounded-2xl`). This single consistent radius makes the whole app feel like one unified design, not a collage of different components.

### The Design Principle
> **Containment reduces cognitive load.** Every visual group your user doesn't have to mentally construct is energy saved for actual decision-making.

### How to Apply This
For card-based layouts:
1. Pick ONE border-radius and use it everywhere (12-16px for mobile)
2. Use a background tint that's barely visible (2-5% darker than the page)
3. Add a very subtle shadow (opacity under 10%)
4. Keep padding consistent within and between cards (16-20px is standard)
5. Make sure the border color is warmer than pure grey when possible

---

## 5. Status Bar: Layer Management

### What Changed
- **Before:** Screen content scrolled behind/into the iOS status bar area, creating visual collision
- **After:** Status bar has a gradient overlay (white to transparent) at z-index 100, and all screens have 48px top padding

### Why It Matters

**Overlapping system UI looks broken.** When your content collides with the phone's clock and signal icons, it immediately reads as "this developer didn't account for the phone frame." It's one of the fastest ways to make a prototype look unprofessional.

**The gradient trick is industry-standard.** A hard white bar would create a jarring cut. The gradient (white at top, transparent at bottom) creates a gentle fade that looks like the content naturally disappears under the status bar. This is exactly what Apple's own apps do.

### The Design Principle
> **Respect platform conventions.** Users expect certain areas of the screen to behave in specific ways. Fighting those expectations creates friction.

### How to Apply This
For mobile prototypes:
1. Always account for the safe area (status bar, notch, home indicator)
2. Use a gradient overlay rather than a hard-edge mask
3. Set consistent top padding on all screens
4. If a screen has a hero image/map, let it extend behind the bar but add the overlay on top
5. Test by scrolling — content should never collide with system UI

---

## 6. Icons: Consistency Over Creativity

### What Changed
- **Before:** Hand-drawn custom SVG icons with inconsistent stroke widths, sizes, and visual weight
- **After:** Lucide React icon set — a professional, open-source library with consistent 24px grid, 2px strokes, and rounded caps

### Why It Matters

**Inconsistent icons make the whole UI feel unfinished.** When one icon has thick strokes and another has thin ones, or when sizes vary randomly, the brain registers "these things don't match" — even if the user can't articulate why it feels off.

**Icon libraries exist for a reason.** Unless you're a skilled icon designer (which takes years of practice), custom icons will always look less polished than a well-made library. Using Lucide, Phosphor, or SF Symbols isn't "cheating" — it's good design judgment.

**Icons need color context.** The redesign places icons inside rounded green containers (`#e6f2e0` background, `#357a1e` icon). This gives each icon a clear "home" and makes them feel like intentional UI elements rather than floating graphics.

### The Design Principle
> **Consistency beats novelty.** A cohesive set of "boring" icons will always outperform a set of unique-but-mismatched custom ones. Save creativity for layout and interaction — use proven icon sets for UI elements.

### How to Apply This
When choosing icons:
1. Pick ONE icon library and stick with it for the whole project
2. Use consistent sizing (20-24px for inline, 16-18px for compact)
3. Match stroke width across all icons (2px is standard)
4. Give icons a container/background when they need emphasis
5. Use the brand color for active/primary icons, grey for inactive

---

## 7. Notification Badges: Amber vs Red

### What Changed
- **Before:** Generic red notification dots
- **After:** Amber/orange badges (`#d97706`) with white text showing the count, plus a white border ring

### Why It Matters

**Red implies danger or error.** In transit apps especially, red = cancelled/delayed/problem. Using red for routine notification badges creates false urgency. Amber says "hey, there's something new" without triggering anxiety.

**The white border ring prevents visual collision.** When a badge overlaps an icon, the 2px white border creates separation so both the badge and the icon remain readable. Without it, the badge color bleeds into the icon container.

**Showing the count is more useful than a dot.** A dot says "something new exists." A number says "2 new things exist." That tiny addition of information helps users prioritize — do I have 1 alert or 5?

### The Design Principle
> **Color carries meaning. Choose it intentionally.** Red = error/danger. Amber = attention/new. Green = success/active. Blue = information. Don't use these colors randomly.

### How to Apply This
For notification indicators:
1. Use amber/orange for "new content" badges (not red)
2. Reserve red for errors, cancellations, and critical warnings
3. Show a count when possible (more informative than a dot)
4. Add a border ring that matches the background color for separation
5. Clear the badge after the user interacts with the content

---

## 8. Interactive Feedback: The "Pressable" Pattern

### What Changed
- **Before:** Buttons had no press feedback — tapping felt unresponsive
- **After:** All interactive elements use a `.pressable` class with `scale(0.97)` on `:active`, creating a subtle "push in" effect

### Why It Matters

**Feedback confirms interaction.** Without press feedback, users wonder "did that actually register?" This leads to double-tapping, which can cause navigation bugs or duplicate actions.

**Subtle is better than dramatic.** The 3% scale-down is barely visible, but it provides just enough tactile feedback to feel "real." Compare this to a dramatic 20% shrink, which would feel cartoonish and distracting.

### The Design Principle
> **Every interactive element needs feedback.** If something is tappable, it must visually respond to being tapped. No exceptions.

### How to Apply This
For touch feedback:
1. Apply a subtle scale transform on `:active` (96-98%)
2. Keep the transition duration short (100-150ms)
3. Apply it to ALL tappable elements — buttons, cards, list items, icons
4. Consider adding a slight opacity change (90-95%) as an alternative

---

## 9. Section Headers: The Green Bar Pattern

### What Changed
- **Before:** Simple bold text for section headers in Trip Details
- **After:** Green rounded-top bar headers ("Your Trip", "Fare Details") with white content in rounded-bottom containers

### Why It Matters

**Visual containers create clear sections.** A bold text header says "this is a section." A colored bar with contained content says "everything below this bar until the next one belongs together." The second is much faster to parse.

**The rounded-top/rounded-bottom pattern creates a "ticket" or "card" metaphor.** This is especially appropriate for a transit app where physical tickets have headers and content sections.

**Color reinforces brand in functional elements.** By making section headers green, every part of the screen reinforces the GO Transit brand without needing logos everywhere.

### The Design Principle
> **Use visual containers to group related content.** The more clearly you delineate sections, the easier your interface is to scan.

---

## 10. Skeleton Loading: Perceived Performance

### What Changed
- **Before:** Content appeared all at once (or showed a spinner)
- **After:** Skeleton cards with shimmer animation appear for 900ms before real content loads

### Why It Matters

**Skeleton screens reduce perceived wait time.** Studies show users perceive skeleton loading as 15-30% faster than equivalent spinner loading. The brain starts processing the layout before the data arrives, so the transition feels smoother.

**Skeletons set expectations.** By mimicking the shape of the final content, skeletons tell users "cards are about to appear here." This prevents the jarring layout shift that happens when content pops in unexpectedly.

**The shimmer animation signals "alive."** A static grey box looks like a broken image. A shimmering grey box looks like content that's actively loading. Small difference, big impact on user confidence.

### The Design Principle
> **Design the loading state as carefully as the loaded state.** Loading is a real part of the user experience, not a technical afterthought.

### How to Apply This
For loading states:
1. Create skeleton versions of your content cards (match the approximate height and layout)
2. Use a very subtle shimmer animation (not too fast, not too slow — ~1.5s cycle)
3. Show 3-4 skeleton cards (enough to fill the viewport)
4. Transition from skeleton to real content without a layout shift
5. Keep skeleton colors muted (use your lightest background tint)

---

## Quick Reference Checklist

Use this checklist when designing your next project:

### Color
- [ ] Is my primary color vibrant enough for screens?
- [ ] Do I have 2-3 lighter tints for backgrounds?
- [ ] Is my grey scale warm (not blue/cold)?
- [ ] Do I have a clear accent color for alerts/badges?
- [ ] Can I explain the purpose of every color I've used?

### Typography
- [ ] Do I have 3-4 distinct weight levels?
- [ ] Can someone understand the page by reading only the bold text?
- [ ] Is my body text at least 14px on mobile?
- [ ] Are my labels/captions clearly subordinate to titles?

### Layout
- [ ] Is my border-radius consistent across all elements?
- [ ] Do cards have enough padding (16-20px)?
- [ ] Are interactive elements visually distinct from static content?
- [ ] Does content respect the safe area / status bar?

### Interaction
- [ ] Does every tappable element have press feedback?
- [ ] Are loading states designed (not just spinners)?
- [ ] Do notification badges use appropriate colors?
- [ ] Can users tell what's interactive by looking at the screen?

### Polish
- [ ] Does the design pass the "squint test"?
- [ ] Are icons from a consistent set?
- [ ] Is there a clear visual hierarchy on every screen?
- [ ] Would a stranger know where to tap first?

---

*This document was created during the Phase 1 visual refresh of the GO Transit prototype. Each principle above is demonstrated in the live prototype — compare the current design against the original Figma export to see these improvements in action.*
