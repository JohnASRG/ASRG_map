/**
 * Utility functions
 */

/**
 * Debounce function calls
 */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Generate a unique ID from a title
 */
function generateID(title) {
  if (!title) return 'UNKNOWN_' + Math.random().toString(36).substr(2, 9);

  // Try to extract standard/regulation number
  const patterns = [
    /(ISO[\/\s]*\d+)/i,
    /(SAE[\/\s]*J\d+)/i,
    /(IEEE[\/\s]*\d+[\.\d]*)/i,
    /(UNECE[\/\s]*R\d+)/i,
    /(NIST[\/\s]*[\w\d\-]+)/i,
    /(CERT[\/\s]*[\w\d\-]+)/i,
    /(MISRA[\/\s]*[\w\d\-:]+)/i
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].replace(/[\s\/\-\.]/g, '_').toUpperCase();
    }
  }

  // Fallback: sanitize first part of title
  return title
    .substring(0, 50)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase();
}

/**
 * Parse date string in various formats
 */
function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;

  try {
    // Try common formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore parsing errors
  }

  return dateStr; // Return as-is if parsing fails
}

/**
 * Extract primary author from author string
 */
function extractPrimaryAuthor(authorStr) {
  if (!authorStr || authorStr.trim() === '') return 'Unknown';

  // Remove trailing/leading whitespace
  authorStr = authorStr.trim();

  // Split by common delimiters
  const parts = authorStr.split(/[,\/\n]/);

  // Return first part
  const primary = parts[0].trim();

  // Extract organization name if it's a longer description
  const orgPatterns = [
    /^(ISO)/i,
    /^(SAE)/i,
    /^(IEEE)/i,
    /^(UNECE)/i,
    /^(NIST)/i,
    /^(CERT)/i,
    /^(MISRA)/i,
    /^(Auto Alliance)/i,
    /^Alliance of Automobile/i
  ];

  for (const pattern of orgPatterns) {
    const match = primary.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // Return abbreviated form if too long
  if (primary.length > 30) {
    return primary.substring(0, 30) + '...';
  }

  return primary;
}

/**
 * Normalize type to category
 */
function normalizeType(type) {
  if (!type) return 'Unknown';

  type = type.toLowerCase().trim();

  if (type.includes('standard') || type.includes('norm')) return 'standard';
  if (type.includes('regulation')) return 'regulation';
  if (type.includes('working group') || type.includes('workgroup')) return 'workingGroup';
  if (type.includes('best practice')) return 'bestPractice';
  if (type.includes('guideline')) return 'guideline';
  if (type.includes('framework')) return 'framework';

  return 'unknown';
}

/**
 * Create a short title for display
 */
function createShortTitle(title) {
  if (!title) return 'Untitled';

  // Extract the key identifier (e.g., "ISO 21434" from full title)
  const patterns = [
    /(ISO[\/\s]*\d+)/i,
    /(SAE[\/\s]*J\d+[\w\/]*)/i,
    /(IEEE[\/\s]*\d+[\.\d]*)/i,
    /(UNECE[\/\s]*R\d+)/i,
    /(NIST[\/\s]*[\w\d\-]+)/i,
    /(CERT[\/\s]*[\w\d\-]+)/i,
    /(MISRA[\/\s]*[\w\d\-:]+)/i
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // Fallback: truncate title
  const lines = title.split('\n');
  const firstLine = lines[lines.length - 1] || lines[0]; // Often the ID is on the last line

  if (firstLine.length <= 40) return firstLine;
  return firstLine.substring(0, 40) + '...';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(str) {
  if (!str) return '';

  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Download data as file
 */
function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Show a temporary toast message
 */
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #323232;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
}
