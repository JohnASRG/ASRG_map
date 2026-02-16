/**
 * Detail panel UI
 */

class DetailPanel {
  constructor(graphData) {
    this.nodes = graphData.nodes;
    this.links = graphData.links;
    this.neighbors = graphData.neighbors;

    // UI elements
    this.panel = document.getElementById('detail-panel');
    this.content = document.getElementById('detail-content');
    this.closeButton = document.getElementById('btn-close-detail');

    this.currentNode = null;

    this.init();
  }

  /**
   * Initialize panel
   */
  init() {
    // Setup close button
    this.closeButton.addEventListener('click', () => {
      this.hide();
    });

    // Listen for node selection
    document.addEventListener(EVENTS.NODE_SELECTED, (e) => {
      this.show(e.detail.node);
    });

    document.addEventListener(EVENTS.NODE_DESELECTED, () => {
      this.hide();
    });
  }

  /**
   * Show panel with node details
   */
  show(node) {
    this.currentNode = node;

    // Get connected nodes
    const connectedNodes = this.getConnectedNodes(node.id);
    const connectedLinks = this.getConnectedLinks(node.id);

    // Build HTML
    const html = `
      <div class="detail-header">
        <h2>${escapeHTML(node.shortTitle)}</h2>
        <div class="detail-type" style="background: ${this.getNodeColor(node)}">
          ${escapeHTML(node.type)}
        </div>
      </div>

      <div class="detail-section">
        <h3>Full Title</h3>
        <p>${escapeHTML(node.title)}</p>
      </div>

      ${node.description ? `
      <div class="detail-section">
        <h3>Description</h3>
        <p>${escapeHTML(node.description)}</p>
      </div>
      ` : ''}

      <div class="detail-section">
        <h3>Information</h3>
        <table class="detail-table">
          <tr>
            <td><strong>Author:</strong></td>
            <td>${escapeHTML(node.author)}</td>
          </tr>
          ${node.country ? `
          <tr>
            <td><strong>Country:</strong></td>
            <td>${escapeHTML(node.country)}</td>
          </tr>
          ` : ''}
          ${node.date ? `
          <tr>
            <td><strong>Date:</strong></td>
            <td>${escapeHTML(node.date)}</td>
          </tr>
          ` : ''}
          ${node.status ? `
          <tr>
            <td><strong>Status:</strong></td>
            <td>${escapeHTML(node.status)}</td>
          </tr>
          ` : ''}
          ${node.version ? `
          <tr>
            <td><strong>Version:</strong></td>
            <td>${escapeHTML(node.version)}</td>
          </tr>
          ` : ''}
          ${node.language ? `
          <tr>
            <td><strong>Language:</strong></td>
            <td>${escapeHTML(node.language)}</td>
          </tr>
          ` : ''}
          ${node.domain && node.domain.length > 0 ? `
          <tr>
            <td><strong>Domains:</strong></td>
            <td>${node.domain.map(d => `<span class="domain-tag">${escapeHTML(d)}</span>`).join(' ')}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      ${node.link && node.link.trim() !== '' && node.link !== 'Link' ? `
      <div class="detail-section">
        <a href="${escapeHTML(node.link)}" target="_blank" class="btn btn-primary">
          View Document ↗
        </a>
      </div>
      ` : ''}

      ${connectedNodes.length > 0 ? `
      <div class="detail-section">
        <h3>Connected Standards (${connectedNodes.length})</h3>
        <div class="connected-list">
          ${this.renderConnectedNodes(connectedNodes, connectedLinks, node.id)}
        </div>
      </div>
      ` : `
      <div class="detail-section">
        <p style="opacity: 0.6;">No connections in this dataset</p>
      </div>
      `}
    `;

    this.content.innerHTML = html;
    this.panel.classList.add('visible');

    // Add click handlers for connected nodes
    this.content.querySelectorAll('[data-node-id]').forEach(el => {
      el.addEventListener('click', () => {
        const nodeId = el.getAttribute('data-node-id');
        const clickedNode = this.nodes.find(n => n.id === nodeId);
        if (clickedNode) {
          document.dispatchEvent(new CustomEvent(EVENTS.NODE_SELECTED, {
            detail: { node: clickedNode }
          }));
        }
      });
    });
  }

  /**
   * Hide panel
   */
  hide() {
    this.panel.classList.remove('visible');
    this.currentNode = null;
  }

  /**
   * Get connected nodes
   */
  getConnectedNodes(nodeId) {
    const neighborIds = this.neighbors.get(nodeId);
    if (!neighborIds) return [];

    return this.nodes.filter(node => neighborIds.has(node.id));
  }

  /**
   * Get connected links
   */
  getConnectedLinks(nodeId) {
    return this.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return sourceId === nodeId || targetId === nodeId;
    });
  }

  /**
   * Render connected nodes list
   */
  renderConnectedNodes(connectedNodes, connectedLinks, currentNodeId) {
    return connectedNodes.map(node => {
      // Find the link(s) between current node and this node
      const link = connectedLinks.find(l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return (sourceId === currentNodeId && targetId === node.id) ||
               (targetId === currentNodeId && sourceId === node.id);
      });

      const relType = link ? link.type : '';
      const relColor = link ? link.color : '#999';

      return `
        <div class="connected-item" data-node-id="${node.id}">
          <div class="connected-indicator" style="background: ${relColor}" title="${relType}"></div>
          <div class="connected-info">
            <div class="connected-title">${escapeHTML(node.shortTitle)}</div>
            <div class="connected-meta">${escapeHTML(node.type)}</div>
            ${link && link.description ? `
              <div class="connected-rel">${escapeHTML(link.description)}</div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Get node color
   */
  getNodeColor(node) {
    return CONFIG.colors.nodeTypes[node.type] || CONFIG.colors.nodeTypes['Unknown'];
  }
}
