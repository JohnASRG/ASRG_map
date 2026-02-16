# Automotive Cybersecurity Ecosystem Visualization

Interactive force-directed network graph visualizing relationships between automotive cybersecurity standards, regulations, working groups, and best practices.

## Features

- **Interactive Network Graph**: Force-directed layout powered by D3.js v7
- **Smart Search & Filtering**: Search by name/author and filter by type, author, and status
- **Detailed Information**: Click any node to view full details and connected standards
- **Multiple Color Schemes**: Color nodes by type, author, or status
- **Export & Share**: Export as PNG image or share via URL
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Vanilla JavaScript** - No frameworks, no build step
- **D3.js v7** - Force-directed graph visualization
- **Pure CSS** - Custom styling with CSS variables

## Project Structure

```
/Users/john/Projects/ASRG_map/
├── index.html                          # Main entry point
├── css/
│   ├── main.css                        # Layout, typography
│   ├── graph.css                       # D3 graph styles
│   ├── components.css                  # UI components
│   └── responsive.css                  # Mobile/tablet breakpoints
├── js/
│   ├── app.js                          # Main orchestrator
│   ├── config.js                       # Constants, colors, settings
│   ├── data/
│   │   ├── dataLoader.js              # CSV parsing
│   │   ├── dataProcessor.js           # Data transformation
│   │   └── graphBuilder.js            # Build node/link structure
│   ├── visualization/
│   │   ├── forceGraph.js              # D3 force simulation
│   │   ├── nodeRenderer.js            # Node rendering
│   │   ├── linkRenderer.js            # Edge rendering
│   │   └── interactions.js            # Drag, zoom, click handlers
│   ├── ui/
│   │   ├── searchFilter.js            # Search & filter UI
│   │   ├── detailPanel.js             # Detail sidebar
│   │   ├── legend.js                  # Graph legend
│   │   └── controls.js                # Control buttons
│   ├── export/
│   │   ├── imageExport.js             # PNG export
│   │   └── urlState.js                # URL state management
│   └── utils/
│       └── helpers.js                 # Utility functions
├── data/
│   ├── ASRG_Specifications_List-covesa - List.csv  # Source data
│   └── relationships.json             # Graph relationships
└── README.md                          # This file
```

## Data Model

### Nodes
Each entity from the CSV becomes a node with:
- **id**: Unique identifier (e.g., "ISO_21434")
- **title**: Full title
- **shortTitle**: Display name
- **type**: Norm/Standard, Regulation, Working Group, Best Practices
- **author**: Organization(s)
- **date**: Publication/release date
- **status**: Released, Draft, Work in Progress
- **degree**: Number of connections

### Relationships
Defined in `data/relationships.json`:
- **extends**: Builds upon another standard
- **references**: Cites or mentions
- **requires**: Mandatory for compliance
- **complements**: Works together with
- **partOf**: Member of a family/series

## Usage

### Running Locally

1. Open `index.html` in a modern web browser
2. Or use a local server:
   ```bash
   python3 -m http.server 8000
   # Then open http://localhost:8000
   ```

### Controls

- **Pan**: Click and drag on background
- **Zoom**: Mouse wheel or pinch gesture
- **Select Node**: Click on any node to view details
- **Search**: Type in search box to filter nodes
- **Filter**: Check/uncheck filter options
- **Color Scheme**: Switch between coloring by type, author, or status
- **Export PNG**: Download current view as image
- **Share**: Copy URL with current filters and selection
- **Reset View**: Re-center and restart simulation

### Adding Relationships

Edit `data/relationships.json` to add new connections:

```json
{
  "source": "ISO_21434",
  "target": "ISO_26262",
  "type": "complements",
  "description": "Cybersecurity complements functional safety"
}
```

### Customization

#### Colors
Edit `js/config.js` to change color schemes:
```javascript
colors: {
  nodeTypes: {
    'Norm / Standard': '#2196F3',
    'Regulation': '#F44336',
    // ...
  }
}
```

#### Force Simulation
Adjust physics parameters in `js/config.js`:
```javascript
simulation: {
  chargeStrength: -400,    // Node repulsion
  linkDistance: 150,       // Link length
  collisionRadius: 35      // Node collision
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES6+ support.

## License

Data sourced from COVESA Automotive Security Research Group.

## Contributing

To add new standards or relationships:
1. Add entries to the CSV file
2. Add relationships to `data/relationships.json`
3. Reload the page

## Performance

- Handles 100+ nodes smoothly
- Force simulation stabilizes in ~2 seconds
- Responsive 60fps interactions
- Optimized filtering and search
