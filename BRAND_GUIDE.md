# PookAi Brand Guide
*Version 1.0 - Web3 AI SaaS Design System*

## Brand Overview
PookAi is a sophisticated AI concierge for founders, transforming email chaos into actionable voice calls. The brand embodies minimal sophistication, technical excellence, and founder-focused utility.

## Design Philosophy
- **Minimal Web3 Aesthetic**: Clean, purposeful, premium
- **NeoPOP Influence**: Elevated surfaces, tactical interactions, depth
- **Founder-Focused**: Professional, efficient, no-nonsense
- **Technical Excellence**: Precision, reliability, innovation

## Color Palette

### Primary Colors
```css
/* Orange System */
--primary: 18 85% 65%        /* #F4A261 - Primary Orange (lighter, sophisticated) */
--primary-dark: 18 85% 45%   /* #E76F51 - Orange shadow/depth */
--primary-foreground: 0 0% 0% /* #000000 - Black text on orange */

/* Monochrome System */
--background: 0 0% 0%         /* #000000 - Pure black background */
--foreground: 0 0% 100%       /* #FFFFFF - Pure white text */
--surface: 0 0% 7%            /* #121212 - Dark grey surface */
--surface-elevated: 0 0% 10%  /* #1A1A1A - Elevated surface */

/* Grey System */
--muted: 0 0% 20%            /* #333333 - Muted elements */
--muted-foreground: 0 0% 80% /* #CCCCCC - Muted text */
--border: 0 0% 20%           /* #333333 - Subtle borders */
```

### Usage Guidelines
- **Orange**: Primary actions, highlights, brand accent, CTAs
- **Black**: Backgrounds, primary text on light surfaces
- **White**: Primary text, high contrast elements
- **Grey**: Secondary text, borders, subtle elements

## Typography

### Font Stack
```css
/* Primary Font */
font-family: 'Jost', system-ui, -apple-system, sans-serif;

/* Technical Font */
font-family: 'JetBrains Mono', monospace;
```

### Typography Scale
```css
/* Headings */
.text-7xl { font-size: 4.5rem; line-height: 1; }     /* Hero titles */
.text-6xl { font-size: 3.75rem; line-height: 1; }    /* Page titles */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; } /* Section headers */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }   /* Subsections */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; } /* Body large */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* Body */
.text-base { font-size: 1rem; line-height: 1.5rem; }   /* Body default */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* Small text */
```

### Font Weights
- **Light (300)**: Large body text, descriptions
- **Regular (400)**: Default body text
- **Medium (500)**: Emphasized text, data display
- **Semibold (600)**: Headings, important labels
- **Bold (700)**: Hero text, primary headings

## NeoPOP Component System

### Button System
```css
/* Primary Button */
.neopop-button-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 2px solid hsl(var(--primary));
  border-radius: 8px; /* Square corners */
  box-shadow: 3px 3px 0 hsl(var(--primary-dark));
}

/* Secondary Button */
.neopop-button-secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
  border: 2px solid hsl(var(--border));
  border-radius: 8px; /* Square corners */
  box-shadow: 3px 3px 0 hsl(0 0% 10%);
}
```

### Card System
```css
.neopop-card {
  background: hsl(var(--surface-elevated));
  border: 2px solid hsl(var(--border));
  border-radius: 12px; /* Slightly rounded for cards */
  box-shadow: 4px 4px 0 hsl(var(--muted));
}
```

### Elevation Levels
1. **Surface** (0px): Base background
2. **Elevated** (4px shadow): Cards, panels
3. **Floating** (8px shadow): Dropdowns, tooltips
4. **Modal** (16px shadow): Overlays, dialogs

## Logo & Branding

### Logo Construction
- **Icon**: Microphone symbol in orange square with NeoPOP shadow
- **Typography**: "PookAi" in Jost Semibold, white text
- **Spacing**: 12px between icon and text
- **Minimum Size**: 120px width total

### Logo Variations
1. **Primary**: Orange icon + white text (dark backgrounds)
2. **Reverse**: White icon + black text (light backgrounds)
3. **Icon Only**: Orange microphone icon with shadow

## Spacing System
```css
/* 4px base unit scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
```

## Component Guidelines

### Buttons
- **Shape**: Square corners (8px border-radius)
- **States**: Default, hover (-1px transform), active (+2px transform)
- **Shadows**: 3px offset for depth, darker color variant
- **Padding**: 16px horizontal, 12px vertical minimum

### Cards
- **Shape**: Rounded corners (12px border-radius)
- **Elevation**: 4px shadow offset
- **Padding**: 32px internal spacing
- **Borders**: 2px solid border

### Icons
- **Size**: 16px, 20px, 24px, 32px standard sizes
- **Style**: Outline style, 2px stroke width
- **Color**: Inherit from parent or use orange for accent

### Data Display
- **Font**: JetBrains Mono for technical data
- **Spacing**: Increased letter-spacing (0.02em)
- **Weight**: Medium (500) for emphasis

## Voice & Tone
- **Professional**: Serious about founder productivity
- **Direct**: No fluff, straight to the point
- **Technical**: Sophisticated but not intimidating
- **Confident**: Reliable AI assistant positioning

## Usage Examples

### Marketing Materials
- Use orange sparingly as accent color
- Maintain high contrast for readability
- Apply NeoPOP shadows to key elements
- Keep layouts minimal and spacious

### UI Components
- Consistent square button styling
- Elevated card presentations
- Orange highlighting for primary actions
- Clean typography hierarchy

### Technical Documentation
- JetBrains Mono for code snippets
- Clear visual hierarchy
- Orange highlighting for important information
- Consistent spacing and alignment

## Brand Applications
- Website design and UI
- Marketing materials and presentations
- Social media assets
- Product documentation
- Email templates
- Business cards and stationery

---

*This brand guide ensures consistent visual identity across all PookAi touchpoints and marketing materials.*