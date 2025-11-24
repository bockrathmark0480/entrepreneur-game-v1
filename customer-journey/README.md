# AI Automation Journey

An enterprise-grade, interactive web application that presents a customer's journey through AI and agent-driven business automations as a high-fantasy adventure inside a worn ancient book.

## Features

- **Fantasy Book Theme**: Ancient book aesthetic with parchment textures, golden accents, and runic motifs
- **Interactive Map**: Navigate through automation "chapters" on an interactive fantasy map
- **Page-Turn Animations**: Smooth Framer Motion animations for page transitions
- **ROI Calculator**: Dynamic ROI projections with interactive sliders
- **Package Comparison**: Three-tier package selection with detailed feature comparison
- **Cart Persistence**: Selected automations persist across sessions via localStorage
- **Accessible**: WCAG 2.1 AA compliant with full keyboard navigation
- **Responsive**: Mobile-first design that works on all screen sizes

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Preview production build
npm run preview
```

## Project Structure

```
customer-journey/
├── public/
│   └── assets/           # Static assets (textures, icons, diagrams)
├── src/
│   ├── components/
│   │   ├── book/         # BookLayout wrapper component
│   │   ├── modals/       # ConfirmModal, SuggestionsModal
│   │   └── pages/        # Page components (LandingCover, TitleMap, etc.)
│   ├── config/
│   │   └── automationJourneyConfig.ts  # Main configuration file
│   ├── context/
│   │   └── JourneyContext.tsx          # Application state management
│   ├── hooks/            # Custom React hooks
│   ├── tests/            # Unit tests
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions (ROI calculations, etc.)
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

## Customizing via automationJourneyConfig

The entire journey experience is driven by a single configuration object in `src/config/automationJourneyConfig.ts`. Here's how to customize it:

### Brand Configuration

```typescript
brand: {
  companyName: "Your Company Name",
  logoUrl: "/assets/logo.svg",
  colorScheme: {
    parchment: "#F6E7C1",  // Background color
    ink: "#2B1B0E",        // Text color
    gold: "#D4AF37",       // Accent color
  },
}
```

### Adding/Modifying Chapters

Each chapter represents an automation workflow:

```typescript
chapters: [
  {
    id: "chapter-1",                    // Unique identifier
    title: "Chapter I: Your Title",     // Display title
    summaryOneLiner: "Brief description of what this automation does.",
    diagram: {
      type: "svg",                      // svg, png, or mermaid
      src: "/assets/diagrams/1.svg",
    },
    hoverInfo: [                        // Bullet points shown on hover
      "What it does",
      "Why it's important",
    ],
    tools: ["Tool 1", "Tool 2"],        // Integration tools used
    pricing: {
      costUSD: 2500,                    // Implementation cost
      implHours: 8,                     // Hours to implement
    },
    savings: {
      hoursPerWeek: 6,                  // Time saved per week
      dollarsPerYear: 15600,            // Annual savings
    },
    mapPosition: { x: 15, y: 25 },      // Position on map (percentage)
  },
  // ... more chapters
]
```

### ROI Calculator Sliders

Customize the ROI calculation inputs:

```typescript
roi: {
  assumptions: {
    workWeeksPerYear: "50 weeks",
    // ... other assumptions shown to users
  },
  sliders: [
    {
      id: "avgHourlyCost",
      label: "Average hourly cost ($)",
      min: 20,
      max: 200,
      step: 5,
      default: 65,
    },
    // ... more sliders
  ],
}
```

### Packages

Define your service packages:

```typescript
packages: [
  {
    tier: "Core",                       // Core, Growth, or Scale
    includedChapterIds: ["chapter-1", "chapter-2"],
    priceUSD: 5500,
    description: "Package description",
    features: [
      "Feature 1",
      "Feature 2",
    ],
  },
  // ... more packages
]
```

## Application Flow

1. **LandingCover**: Front cover with welcome message and "Begin" CTA
2. **TitleMap**: Interactive map with clickable chapter locations
3. **ChapterPage**: Individual chapter with diagram, tools, and pricing
4. **ExecutiveSummaryROI**: ROI calculator and package selection
5. **CheckoutBackCover**: Cart summary and demo payment flow

## State Management

The app uses React Context + useReducer for state management:

- **JourneyContext**: Central state including cart, ROI inputs, and navigation
- **localStorage**: Automatic persistence of cart and preferences
- **Debounced saves**: Prevents excessive storage writes

## Animations

Powered by Framer Motion:

- `open-book`: Book opening transition from cover
- `page-turn-forward`: Navigate to next page
- `page-turn-back`: Navigate to previous page
- `map-burn`: Dramatic transition from map to chapter
- `treasure-erupt`: Celebration animation on checkout
- `hero-return`: Success animation after payment

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Focus management in modals
- `prefers-reduced-motion` support
- Semantic HTML structure
- Color contrast compliance

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm run test:coverage
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+
- Chrome for Android

## Legal Notice

This application uses a high-fantasy theme but contains NO copyrighted Lord of the Rings or other licensed content. All visual elements are original or open-licensed.

## License

Proprietary - MAB AI Strategies LLC
