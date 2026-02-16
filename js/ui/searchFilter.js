/**
 * Search and filter UI
 */

class SearchFilter {
  constructor(nodes) {
    this.nodes = nodes;
    this.allNodeIds = new Set(nodes.map(n => n.id));

    // Filter state
    this.activeFilters = {
      types: new Set(),
      authors: new Set(),
      statuses: new Set(),
      search: ''
    };

    // UI elements
    this.searchInput = document.getElementById('search-input');
    this.filterTypeContainer = document.getElementById('filter-type');
    this.filterAuthorContainer = document.getElementById('filter-author');
    this.filterStatusContainer = document.getElementById('filter-status');
    this.clearButton = document.getElementById('btn-clear-filters');
    this.searchResults = document.getElementById('search-results');

    this.init();
  }

  /**
   * Initialize UI
   */
  init() {
    // Get filter options
    const processor = new DataProcessor();
    const options = processor.getFilterOptions(this.nodes);

    // Render filter checkboxes
    this.renderFilterGroup(this.filterTypeContainer, options.types, 'type');
    this.renderFilterGroup(this.filterAuthorContainer, options.authors, 'author');
    this.renderFilterGroup(this.filterStatusContainer, options.statuses, 'status');

    // Setup search
    this.searchInput.addEventListener('input', debounce((e) => {
      this.activeFilters.search = e.target.value.toLowerCase();
      this.applyFilters();
    }, CONFIG.search.debounceDelay));

    // Setup clear button
    this.clearButton.addEventListener('click', () => {
      this.clearAllFilters();
    });
  }

  /**
   * Render filter checkbox group
   */
  renderFilterGroup(container, values, filterType) {
    values.forEach(value => {
      const label = document.createElement('label');
      label.className = 'filter-checkbox';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = value;
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.activeFilters[filterType + 's'].add(value);
        } else {
          this.activeFilters[filterType + 's'].delete(value);
        }
        this.applyFilters();
      });

      const text = document.createTextNode(value);

      label.appendChild(checkbox);
      label.appendChild(text);
      container.appendChild(label);
    });
  }

  /**
   * Apply all active filters
   */
  applyFilters() {
    const visibleIds = new Set();

    this.nodes.forEach(node => {
      // Check type filter
      const typeMatch = this.activeFilters.types.size === 0 ||
        this.activeFilters.types.has(node.type);

      // Check author filter
      const authorMatch = this.activeFilters.authors.size === 0 ||
        this.activeFilters.authors.has(node.authorShort);

      // Check status filter
      const statusMatch = this.activeFilters.statuses.size === 0 ||
        this.activeFilters.statuses.has(node.status);

      // Check search filter
      const searchMatch = this.activeFilters.search === '' ||
        node.title.toLowerCase().includes(this.activeFilters.search) ||
        node.shortTitle.toLowerCase().includes(this.activeFilters.search) ||
        node.author.toLowerCase().includes(this.activeFilters.search);

      // Node is visible if it matches all filters
      if (typeMatch && authorMatch && statusMatch && searchMatch) {
        visibleIds.add(node.id);
      }
    });

    // Update search results display
    this.updateSearchResults(visibleIds.size);

    // Dispatch event
    document.dispatchEvent(new CustomEvent(EVENTS.FILTERS_CHANGED, {
      detail: { visibleIds }
    }));
  }

  /**
   * Update search results count
   */
  updateSearchResults(count) {
    if (count === this.nodes.length) {
      this.searchResults.innerHTML = '';
    } else {
      this.searchResults.innerHTML = `Showing ${count} of ${this.nodes.length} items`;
    }
  }

  /**
   * Clear all filters
   */
  clearAllFilters() {
    // Clear filter sets
    this.activeFilters.types.clear();
    this.activeFilters.authors.clear();
    this.activeFilters.statuses.clear();
    this.activeFilters.search = '';

    // Clear UI
    this.searchInput.value = '';
    this.filterTypeContainer.querySelectorAll('input').forEach(cb => cb.checked = false);
    this.filterAuthorContainer.querySelectorAll('input').forEach(cb => cb.checked = false);
    this.filterStatusContainer.querySelectorAll('input').forEach(cb => cb.checked = false);

    // Apply filters (will show all)
    this.applyFilters();
  }

  /**
   * Set filters from URL state
   */
  setFilters(filters) {
    if (filters.types) {
      filters.types.forEach(type => {
        this.activeFilters.types.add(type);
        const checkbox = this.filterTypeContainer.querySelector(`input[value="${type}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    if (filters.authors) {
      filters.authors.forEach(author => {
        this.activeFilters.authors.add(author);
        const checkbox = this.filterAuthorContainer.querySelector(`input[value="${author}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    if (filters.statuses) {
      filters.statuses.forEach(status => {
        this.activeFilters.statuses.add(status);
        const checkbox = this.filterStatusContainer.querySelector(`input[value="${status}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    if (filters.search) {
      this.activeFilters.search = filters.search;
      this.searchInput.value = filters.search;
    }

    this.applyFilters();
  }

  /**
   * Get current filter state
   */
  getFilters() {
    return {
      types: Array.from(this.activeFilters.types),
      authors: Array.from(this.activeFilters.authors),
      statuses: Array.from(this.activeFilters.statuses),
      search: this.activeFilters.search
    };
  }
}
