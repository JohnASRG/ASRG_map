/**
 * Interaction handlers for the force graph
 */

class Interactions {
  constructor(simulation, nodeRenderer) {
    this.simulation = simulation;
    this.nodeRenderer = nodeRenderer;
    this.selectedNode = null;
  }

  /**
   * Setup drag behavior
   */
  setupDrag(nodeSelection) {
    const drag = d3.drag()
      .on('start', (event, d) => this.dragStarted(event, d))
      .on('drag', (event, d) => this.dragging(event, d))
      .on('end', (event, d) => this.dragEnded(event, d));

    nodeSelection.call(drag);
  }

  dragStarted(event, d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragging(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragEnded(event, d) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  /**
   * Setup click behavior
   */
  setupClick(nodeSelection) {
    nodeSelection.on('click', (event, d) => {
      event.stopPropagation();
      this.selectNode(d);
    });
  }

  /**
   * Setup hover behavior
   */
  setupHover(nodeSelection) {
    nodeSelection
      .on('mouseenter', (event, d) => {
        if (this.selectedNode !== d.id) {
          this.showTooltip(event, d);
        }
      })
      .on('mouseleave', () => {
        this.hideTooltip();
      });
  }

  /**
   * Select a node
   */
  selectNode(node) {
    this.selectedNode = node.id;

    // Dispatch event
    document.dispatchEvent(new CustomEvent(EVENTS.NODE_SELECTED, {
      detail: { node }
    }));
  }

  /**
   * Deselect current node
   */
  deselectNode() {
    this.selectedNode = null;

    // Dispatch event
    document.dispatchEvent(new CustomEvent(EVENTS.NODE_DESELECTED));
  }

  /**
   * Show tooltip
   */
  showTooltip(event, node) {
    let tooltip = document.getElementById('node-tooltip');

    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'node-tooltip';
      tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 10000;
        max-width: 300px;
      `;
      document.body.appendChild(tooltip);
    }

    tooltip.innerHTML = `
      <strong>${escapeHTML(node.shortTitle)}</strong><br>
      <span style="opacity: 0.8;">${escapeHTML(node.type)}</span><br>
      <span style="opacity: 0.7;">Connections: ${node.degree}</span>
    `;

    tooltip.style.display = 'block';
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY + 10) + 'px';
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    const tooltip = document.getElementById('node-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  /**
   * Setup background click (deselect)
   */
  setupBackgroundClick(svg) {
    svg.on('click', () => {
      this.deselectNode();
    });
  }

  /**
   * Get selected node ID
   */
  getSelectedNode() {
    return this.selectedNode;
  }
}
