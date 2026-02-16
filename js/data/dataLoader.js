/**
 * Data loader for CSV and relationships
 */

class DataLoader {
  /**
   * Load CSV data
   */
  async loadCSV() {
    try {
      const data = await d3.csv(CONFIG.paths.csvData, (row, index) => {
        // Skip first 4 header rows and empty row
        if (index < 4) return null;

        // Skip empty rows
        if (!row.Title || row.Title.trim() === '') return null;

        // Parse and clean the row
        return {
          link: row.Link || '',
          title: row.Title.trim(),
          type: row.Type || 'Unknown',
          date: row.Date || '',
          domain: row.Domain || '',
          status: row.Status || 'Unknown',
          version: row.Version || '',
          language: row.Language || 'English',
          author: row.Author || 'Unknown'
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
