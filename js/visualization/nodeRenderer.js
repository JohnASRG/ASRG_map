/**
 * Node renderer for the force graph
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
   * Render nodes
   */
  renderNodes(container, nodes) {
    const nodeGroup = container.append('g')
      .attr('class', 'nodes');

    const node = nodeGroup.selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('data-id', d => d.id);

    // Add circles
    node.append('circle')
      .attr('r', d => this.graphBuilder.getNodeRadius(d.degree))
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', CONFIG.nodes.strokeWidth);

    // Add labels
    node.append('text')
      .attr('class', 'node-label')
      .attr('dx', d => this.graphBuilder.getNodeRadius(d.degree) + 4)
      .attr('dy', '.35em')
      .text(d => d.shortTitle)
      .style('font-size', '11px')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .style('opacity', 0); // Hidden by default, shown on zoom or hover

    return node;
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
    nodeSelection.select('circle')
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

      node.select('circle')
        .transition()
        .duration(CONFIG.animation.fadeDuration)
        .attr('stroke', isSelected ? CONFIG.colors.ui.selected : '#fff')
        .attr('stroke-width', isSelected ? 4 : CONFIG.nodes.strokeWidth);

      node.select('text')
        .transition()
        .duration(CONFIG.animation.fadeDuration)
        .style('opacity', isSelected ? 1 : 0);
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

      node.select('circle')
        .transition()
        .duration(CONFIG.animation.fadeDuration)
        .attr('stroke', isConnected ? CONFIG.colors.ui.highlighted : '#fff')
        .attr('stroke-width', isConnected ? 3 : CONFIG.nodes.strokeWidth);

      node.select('text')
        .transition()
        .duration(CONFIG.animation.fadeDuration)
        .style('opacity', isConnected ? 1 : 0);
    });
  }

  /**
   * Update label visibility based on zoom level
   */
  updateLabelVisibility(nodeSelection, zoomLevel) {
    const shouldShowLabels = zoomLevel > CONFIG.nodes.labelThreshold;

    nodeSelection.select('text')
      .transition()
      .duration(CONFIG.animation.fadeDuration)
      .style('opacity', d => {
        // Always hide if faded
        const node = d3.select(`[data-id="${d.id}"]`);
        if (parseFloat(node.style('opacity')) < 0.5) return 0;

        // Show important nodes (high degree) even at low zoom
        if (d.degree > 5) return 1;

        // Otherwise, show based on zoom level
        return shouldShowLabels ? 1 : 0;
      });
  }
}
