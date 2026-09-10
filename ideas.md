# 3D Campus Navigation Map — Design Brainstorm

## Three Stylistic Approaches

### Approach 1: "Cartographer's Blueprint"
- A technical, blueprint-inspired aesthetic with the drone image as the ground plane, overlaid with wireframe 3D building extrusions, glowing navigation paths, and a clean HUD-style sidebar. Monochrome with cyan/teal accent lines.
- Probability: 0.07

### Approach 2: "Satellite Explorer"
- The drone image becomes an interactive satellite view with 3D pin markers, subtle elevation effects, and a glassmorphic control panel. Earthy tones complemented by vibrant marker colors. Feels like Google Earth meets a campus guide.
- Probability: 0.04

### Approach 3: "Architectural Diorama"
- A tilted isometric 3D view where the drone image is draped over a 3D terrain mesh with buildings extruded as solid colored blocks. Warm, inviting palette with a wooden/diorama feel. Playful but functional.
- Probability: 0.02

---

## Chosen Approach: "Satellite Explorer"

### Design Movement
Satellite Explorer — inspired by Google Earth's satellite mode and modern mapping applications. The drone image serves as the textured ground plane of a 3D scene, with interactive 3D location markers (pins/icons) placed at building locations. Users can orbit, zoom, and tilt the camera to navigate the campus in 3D space.

### Core Principles
1. **Immersive 3D Navigation** — The drone image is the foundation of a Three.js scene; users freely explore with orbit controls
2. **Intuitive Wayfinding** — Each location has a clearly visible 3D pin/marker with hover tooltips and click-to-zoom
3. **Clean Overlay UI** — Glassmorphic sidebar and search panel that don't obstruct the 3D view
4. **Responsive & Performant** — Smooth 60fps navigation with optimized textures and LOD markers

### Color Philosophy
- **Base**: The natural colors of the drone image (earth tones, greens, concrete grays)
- **Markers**: Vibrant primary colors — red pins for buildings, blue for sports, green for nature, orange for services
- **UI Panels**: Frosted glass (backdrop-blur) with white/dark text depending on background
- **Accents**: Warm amber (#F59E0B) for active/selected markers, soft white for text

### Layout Paradigm
- Full-screen 3D canvas as the primary view (no traditional page layout)
- Floating glassmorphic sidebar on the left for building list/search
- Mini-map compass in bottom-right corner
- Top bar with title and navigation mode toggle

### Signature Elements
1. **3D Pin Markers** — Animated location pins that bob gently, scale on hover, and show pulsing rings
2. **Glassmorphic Panels** — Translucent control panels with backdrop-blur over the 3D scene
3. **Smooth Camera Transitions** — GSAP/Tween.js powered camera fly-to when clicking locations

### Interaction Philosophy
- Click a marker → camera smoothly flies to that location with a zoom-in effect
- Hover a marker → tooltip appears with building name
- Search → filters the marker list, highlights matching markers
- Drag/orbit → free exploration of the campus

### Animation
- Markers: gentle floating animation (sine wave, 2s cycle)
- Camera fly-to: 1.5s eased transition using GSAP
- Panel entrance: slide-in from left with fade, 300ms ease-out
- Hover scale: 1.2x with 150ms ease-out
- Pulsing ring on selected marker: expanding circle, 1s cycle

### Typography System
- **Headings**: "Space Grotesk" — geometric, modern, maps to the tech-forward feel
- **Body**: "Inter" — clean, readable for panel text and descriptions
- **Hierarchy**: Bold 2xl for title, medium for labels, regular for descriptions

### Brand Essence
**A campus you can walk through from the sky** — for students, visitors, and staff who need intuitive campus navigation. Unlike flat maps, this is an immersive aerial experience.
- Personality: **Navigational**, **Immersive**, **Welcoming**

### Brand Voice
- Headlines: Short, action-oriented ("Explore Campus", "Find Your Building")
- CTAs: "Fly to [Building]", "View Details", "Get Directions"
- Examples:
  - "Navigate the campus from above — click any marker to fly there"
  - "Search for your destination and let us guide you there"

### Wordmark & Logo
A bold geometric compass/pin icon in amber/gold (#F59E0B) on a dark translucent background. Simple SVG with a map pin shape containing a compass rose element.

### Signature Brand Color
**Amber Gold (#F59E0B)** — warm, distinctive, stands out against the earth-toned drone image.
