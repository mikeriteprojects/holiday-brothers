# Making Your Existing Site Beautiful — Claude Code Edition
*Adapted for a vanilla HTML/CSS/JS project already connected to Claude Code (Local session).*

Since your project isn't React/Next.js, Framer Motion and 21st.dev (both React libraries/components) won't paste in directly. Swapped for vanilla-compatible equivalents below — everything else from the original guide still applies.

---

## Step 1 — Skip it, you're already here
You've got Claude Code installed, git set up, and your project connected as a Local session. Nothing to do.

---

## Step 2 — Add Animation (vanilla version)

Framer Motion requires React. For plain HTML/CSS/JS, use **Motion** (motion.dev) — same team, same animation engine, vanilla JS API.

**Prompt to give Claude Code:**
> "Install the `motion` package (motion.dev, vanilla JS version of Framer Motion) via npm, or link it via CDN if we're not using a bundler. Use it to add scroll-triggered fades, staggered reveals on lists/cards, and smooth hover transitions on buttons and links throughout the site. Match the animation style to what's already there — don't change layout or content, just add motion."

If your project has no build step at all (just `<script>` tags), tell Claude Code that explicitly so it uses the CDN `<script type="module">` import instead of npm.

---

## Step 3 — Add a Design-Focused Skill

Same as the original guide — this part doesn't change.

**Prompt to give Claude Code:**
> "Create a `.claude/skills/design/SKILL.md` file for this project. In it, define: a typography scale, an 8px spacing grid, a color token system (primary/neutral/accent — pull the actual hex values from our existing CSS instead of inventing new ones), and component patterns for buttons, cards, and forms. Then audit our current HTML/CSS against this system and flag every place we're using inconsistent spacing, ad-hoc font sizes, or one-off colors."

This makes Claude Code extract *your* existing design language into a system, rather than imposing a generic one — important since you already have a site, not a blank slate.

---

## Step 4 — Component Inspiration (vanilla version)

21st.dev components are React + Tailwind, so you can't copy-paste them directly. Instead, use them as **visual reference** and have Claude Code rebuild the pattern in vanilla HTML/CSS/JS.

**Prompt to give Claude Code:**
> "I'm looking at a [hero section / pricing table / testimonial layout] on 21st.dev that I like — [describe it or paste a screenshot]. Recreate that layout and interaction pattern in plain HTML/CSS/JS, matching our existing design tokens from the skill file, and integrate it into [specific page/section] with our real content."

Screenshots work well here — Claude Code can read images, so you can literally screenshot a 21st.dev component and say "build this."

---

## The Actual Starter Prompt (run this first)

Instead of "build a new site," start with an **audit**, since you're improving an existing one:

```
This is an existing website (HTML/CSS/JS, no framework). Before changing anything:

1. Review the current structure — pages, sections, and existing CSS/JS.
2. Identify what's making it look generic or unpolished (spacing inconsistency,
   lack of hierarchy, flat/static elements, weak contrast, no motion, etc.)
3. Propose a short punch list of fixes, ordered by visual impact.

Don't change any code yet — just give me the audit and the plan.
```

Once you approve the plan, go section by section:

```
Starting with [section name]. Apply our design tokens from the skill file,
add Motion-based scroll/hover animations, and improve spacing/hierarchy.
Show me the diff before moving to the next section.
```

---

## Common Mistakes to Avoid (same as before, still true)
- **Skipping the design skill.** Without it, Claude Code will still make locally-nice-looking but globally-inconsistent changes.
- **Letting it rebuild instead of edit.** Be explicit: "edit in place," not "rewrite this page" — you want to keep your existing structure and content.
- **Vague prompts.** Reference actual file names and section names once you know them.
- **Skipping the audit step.** On an existing site, jumping straight to "make it beautiful" gives Claude Code no anchor — the audit gives both of you a shared punch list.
