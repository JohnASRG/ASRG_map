/**
 * Node renderer for the force graph — rounded rectangles with embedded text
 */

class NodeRenderer {
  constructor(graphBuilder) {
    this.graphBuilder = graphBuilder;
    this.colorScheme = 'type'; // default color scheme
  }

  /**
   * Get node color based on current color scheme
   */
  getNodeColor(node) {
    switch (this.colorScheme) {
      case 'type':
        return CONFIG.colors.nodeTypes[node.type] || CONFIG.colors.nodeTypes['Unknown'];
      case 'author':
        return CONFIG.colors.nodeAuthors[node.authorShort] || CONFIG.colors.nodeAuthors['Unknown'];
      case 'status':
        return CONFIG.colors.nodeStatus[node.status] || CONFIG.colors.nodeStatus['Unknown'];
      default:
        return CONFIG.colors.nodeTypes[node.type] || CONFIG.colors.nodeTypes['Unknown'];
    }
  }

  /**
   * Set color scheme
   */
  setColorScheme(scheme) {
    this.colorScheme = scheme;
  }

  /**
   * Render nodes as rounded rectangles with title and type text
   */
  renderNodes(container, nodes) {
    const nodeGroup = container.append('g')
      .attr('class', 'nodes');

    const node = nodeGroup.selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('data-id', d => d.id);

    // Add rounded rectangles (centered on node position)
    node.append('rect')
      .attr('x', d => {
        const dim = this.graphBuilder.getNodeDimensions(d.degree);
        return -dim.width / 2;
      })
      .attr('y', d => {
        const dim = this.graphBuilder.getNodeDimensions(d.degree);
        return -dim.height / 2;
      })
      .attr('width', d => this.graphBuilder.getNodeDimensions(d.degree).width)
      .attr('height', d => this.graphBuilder.getNodeDimensions(d.degree).height)
      .attr('rx', CONFIG.nodes.cornerRadius)
      .attr('ry', CONFIG.nodes.cornerRadius)
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', CONFIG.nodes.strokeWidth);

    // Add title text (always visible, white, bold)
    node.append('text')
      .attr('class', 'node-title')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.15em')
      .text(d => this.truncateText(d.shortTitle, d.degree))
      .style('font-size', CONFIG.nodes.titleFontSize + 'px')
      .style('font-weight', '600')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Add type text (smaller, semi-transparent, shown on zoom)
    node.append('text')
      .attr('class', 'node-type')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.1em')
      .text(d => d.type)
      .style('font-size', CONFIG.nodes.typeFontSize + 'px')
      .style('fill', 'rgba(255,255,255,0.7)')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .style('opacity', 0); // Hidden by default, shown on zoom

    return node;
  }

  /**
   * Truncate text to fit within node width
   */
  truncateText(text, degree) {
    const dim = this.graphBuilder.getNodeDimensions(degree);
    const maxChars = Math.floor((dim.width - CONFIG.nodes.padding * 2) / 6.5);
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars - 1) + '\u2026';
  }

  /**
   * Update node positions during simulation
   */
  updatePositions(nodeSelection) {
    nodeSelection.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  /**
   * Update node colors (when color scheme changes)
   */
  updateColors(nodeSelection) {
    nodeSelection.select('rect')
      .transition()
      .duration(CONFIG.animation.duration)
      .attr('fill', d => this.getNodeColor(d));
  }

  /**
   * Highlight selected node
   */
  highlightNode(nodeSelection, nodeId) {
    nodeSelection.each(function(d) {
      const node = d3.select(this);
      const isSelected = d.id === nodeId;

      node.select('rect')
        .transition()
        .duration(CONFIG.animation.fadeDuration)
        .attr('stroke', isSelected ? CONFIG.colors.ui.selected : '#fff')
        .attr('stroke-width', isSelected ? 4 : CONFIG.nodes.strokeWidth);
    });
  }

  /**
   * Fade nodes based on filter
   */
  fadeNodes(nodeSelection, visibleIds) {
    nodeSelection.each(function(d) {
      const node = d3.select(this);
      const isVisible = visibleIds.has(d.id);

      node.transition()
        .duration(CONFIG.animation.fadeDuration)
        .style('opacity', isVisible ? CONFIG.colors.ui.normal : CONFIG.colors.ui.faded);
    });
  }

  /**
   * Highlight connected nodes
   */
  highlightConnected(nodeSelection, connectedIds) {
    nodeSelection.each(function(d) {
      const node = d3.select(this);
      const isConnected = connectedIds.has(d.id);

      node.select('rect')
        .transition()
        .duration(CONFIG.animation.fadeDuration)
        .attr('stroke', isConnected ? CONFIG.colors.ui.highlighted : '#fff')
        .attr('stroke-width', isConnected ? 3 : CONFIG.nodes.strokeWidth);
    });
  }

  /**
   * Update label visibility based on zoom level
   */
  updateLabelVisibility(nodeSelection, zoomLevel) {
    const shouldShowType = zoomLevel > CONFIG.nodes.labelThreshold;

    // Type sub-label visibility controlled by zoom
    nodeSelection.select('.node-type')
      .transition()
      .duration(CONFIG.animation.fadeDuration)
      .style('opacity', d => {
        // Always hide if faded
        const node = d3.select(`[data-id="${d.id}"]`);
        if (parseFloat(node.style('opacity')) < 0.5) return 0;

        // Show for important nodes (high degree) even at low zoom
        if (d.degree > 5) return 1;

        // Otherwise, show based on zoom level
        return shouldShowType ? 1 : 0;
      });
  }
}
