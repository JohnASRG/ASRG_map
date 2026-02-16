/**
 * Data loader for CSV and relationships
 */

class DataLoader {
  /**
   * Load CSV data
   */
  async loadCSV() {
    try {
      const data = await d3.csv(CONFIG.paths.csvData, (row) => {
        // Skip empty rows
        if (!row.Title || row.Title.trim() === '') return null;

        // Parse multi-select domain (comma-separated)
        const domains = row.Domain ?
          row.Domain.split(',').map(d => d.trim()).filter(d => d) :
          [];

        // Parse and clean the row
        return {
          title: row.Title.trim(),
          type: row.Type || 'Unknown',
          domain: domains, // Now an array
          status: row.Status || 'Unknown',
          version: row.Version || '',
          language: row.Language || 'English',
          country: row.Country || 'International',
          author: row.Author || 'Unknown',
          date: row.Date || '',
          link: row.Link || '',
          description: row.Description || ''
        };
      });

      // Filter out null entries
      const cleaned = data.filter(d => d !== null);

      console.log(`Loaded ${cleaned.length} entities from CSV`);
      return cleaned;
    } catch (error) {
      console.error('Error loading CSV:', error);
      throw new Error(`Failed to load CSV data: ${error.message}`);
    }
  }

  /**
   * Load relationships JSON
   */
  async loadRelationships() {
    try {
      const response = await fetch(CONFIG.paths.relationships);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(`Loaded ${data.relationships.length} relationships`);
      return data;
    } catch (error) {
      console.error('Error loading relationships:', error);
      throw new Error(`Failed to load relationships: ${error.message}`);
    }
  }

  /**
   * Load all data
   */
  async loadAll() {
    try {
      const [csvData, relationshipsData] = await Promise.all([
        this.loadCSV(),
        this.loadRelationships()
      ]);

      return {
        entities: csvData,
        relationships: relationshipsData
      };
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }
}
