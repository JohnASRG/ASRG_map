/**
 * Image export functionality
 */

class ImageExport {
  constructor(forceGraph) {
    this.forceGraph = forceGraph;

    // Listen for export event
    document.addEventListener(EVENTS.EXPORT_PNG, () => {
      this.exportPNG();
    });
  }

  /**
   * Export graph as PNG
   */
  async exportPNG() {
    try {
      // Get SVG element
      const svg = this.forceGraph.getSVG();
      if (!svg) {
        throw new Error('SVG not found');
      }

      // Clone SVG
      const clonedSvg = svg.cloneNode(true);

      // Set explicit dimensions
      clonedSvg.setAttribute('width', CONFIG.export.imageWidth);
      clonedSvg.setAttribute('height', CONFIG.export.imageHeight);

      // Add white background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', CONFIG.export.imageBackground);
      clonedSvg.insertBefore(rect, clonedSvg.firstChild);

      // Serialize SVG to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = CONFIG.export.imageWidth;
      canvas.height = CONFIG.export.imageHeight;
      const ctx = canvas.getContext('2d');

      // Create image from SVG
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Draw image on canvas
        ctx.fillStyle = CONFIG.export.imageBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Convert to PNG and download
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          link.download = `automotive-cybersecurity-map-${Date.now()}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();

          URL.revokeObjectURL(url);
          URL.revokeObjectURL(link.href);

          showToast('Image exported successfully!');
        });
      };

      img.onerror = () => {
        throw new Error('Failed to load SVG image');
      };

      img.src = url;

    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed. Please try again.');
    }
  }
}
