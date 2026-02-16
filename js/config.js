/**
 * Global configuration for the automotive cybersecurity visualization
 */
const CONFIG = {
  // File paths
  paths: {
    csvData: 'data/ASRG_Specifications_List-covesa - List.csv',
    relationships: 'data/relationships.json'
  },

  // Color schemes
  colors: {
    // Node colors by type
    nodeTypes: {
      'Norm / Standard': '#2196F3',
      'Regulation': '#F44336',
      'Working Group': '#4CAF50',
      'Best Practices': '#FF9800',
      'Guidelines': '#9C27B0',
      'Framework': '#00BCD4',
      'Unknown': '#9E9E9E'
    },

    // Node colors by author
    nodeAuthors: {
      'ISO': '#1976D2',
      'SAE': '#388E3C',
      'IEEE': '#F57C00',
      'UNECE': '#C62828',
      'NIST': '#7B1FA2',
      'CERT': '#0097A7',
      'MISRA': '#5D4037',
      'Auto Alliance': '#455A64',
      'Unknown': '#9E9E9E'
    },

    // Node colors by status
    nodeStatus: {
      'Released': '#4CAF50',
      'Draft': '#FF9800',
      'Work in Progress': '#FFC107',
      'Withdrawn': '#F44336',
      'Unknown': '#9E9E9E'
    },

    // Relationship colors (from relationships.json)
    relationships: {
      extends: '#4CAF50',
      references: '#2196F3',
      requires: '#FF9800',
      complements: '#9C27B0',
      partOf: '#00BCD4'
    },

    // UI colors
    ui: {
      selected: '#FFD700',
      highlighted: '#FFA500',
      faded: 0.1,
      normal: 1.0
    }
  },

  // Force simulation parameters
  simulation: {
    chargeStrength: -400,
    linkDistance: 150,
    collisionRadius: 35,
    centerStrength: 0.05,
    alphaDecay: 0.02,
    velocityDecay: 0.4
  },

  // Node rendering
  nodes: {
    minRadius: 8,
    maxRadius: 25,
    defaultRadius: 12,
    labelThreshold: 1.2, // Show labels when zoom > this value
    strokeWidth: 2
  },

  // Link rendering
  links: {
    strokeWidth: 1.5,
    opacity: 0.6,
    opacityHighlight: 1.0,
    arrowSize: 8
  },

  // Search and filter
  search: {
    debounceDelay: 300,
    minChars: 2
  },

  // Animation
  animation: {
    duration: 300,
    fadeDuration: 200
  },

  // Export
  export: {
    imageWidth: 1920,
    imageHeight: 1080,
    imageBackground: '#ffffff'
  }
};

// Event names for inter-module communication
const EVENTS = {
  NODE_SELECTED: 'node:selected',
  NODE_DESELECTED: 'node:deselected',
  FILTERS_CHANGED: 'filters:changed',
  SEARCH_CHANGED: 'search:changed',
  COLOR_SCHEME_CHANGED: 'colorScheme:changed',
  SIMULATION_PAUSED: 'simulation:paused',
  SIMULATION_RESUMED: 'simulation:resumed',
  VIEW_RESET: 'view:reset',
  EXPORT_PNG: 'export:png',
  SHARE_URL: 'share:url'
};
