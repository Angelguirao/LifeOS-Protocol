/**
 * LifeOS Protocol URI Resolver
 * 
 * Handles parsing and resolving life:// URIs according to the LifeOS Protocol.
 * Format: life://<date>/<source>/<type>/<slug>
 */

class LifeURIResolver {
  constructor() {
    this.resolvers = new Map();
  }

  /**
   * Parse a life:// URI into its components
   * @param {string} uri - The life:// URI to parse
   * @returns {Object} Parsed URI components
   */
  parseURI(uri) {
    if (!uri.startsWith('life://')) {
      throw new Error('Invalid life:// URI format');
    }

    const path = uri.substring(6); // Remove 'life://'
    const parts = path.split('/').filter(part => part.length > 0); // Remove empty parts

    if (parts.length < 4) {
      throw new Error('life:// URI must have format: life://<date>/<source>/<type>/<slug>');
    }

    const [date, source, type, ...slugParts] = parts;
    const slug = decodeURIComponent(slugParts.join('/'));

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }

    return {
      date,
      source,
      type,
      slug,
      full: uri
    };
  }

  /**
   * Generate a life:// URI from components
   * @param {Object} components - URI components
   * @returns {string} Generated life:// URI
   */
  generateURI(components) {
    const { date, source, type, slug } = components;
    
    if (!date || !source || !type || !slug) {
      throw new Error('Missing required URI components');
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }

    // Encode slug for URL safety
    const encodedSlug = encodeURIComponent(slug);
    
    return `life://${date}/${source}/${type}/${encodedSlug}`;
  }

  /**
   * Register a resolver for a specific source
   * @param {string} source - The source to register resolver for
   * @param {Function} resolver - Function that resolves URIs to LifeEvents
   */
  registerResolver(source, resolver) {
    if (typeof resolver !== 'function') {
      throw new Error('Resolver must be a function');
    }
    this.resolvers.set(source, resolver);
  }

  /**
   * Resolve a life:// URI to a LifeEvent
   * @param {string} uri - The life:// URI to resolve
   * @returns {Promise<Object>} The resolved LifeEvent
   */
  async resolveURI(uri) {
    const parsed = this.parseURI(uri);
    const resolver = this.resolvers.get(parsed.source);

    if (!resolver) {
      throw new Error(`No resolver registered for source: ${parsed.source}`);
    }

    try {
      const event = await resolver(parsed);
      
      // Validate the returned event against schema
      this.validateLifeEvent(event);
      
      return event;
    } catch (error) {
      throw new Error(`Failed to resolve URI ${uri}: ${error.message}`);
    }
  }

  /**
   * Validate a LifeEvent against the schema
   * @param {Object} event - The LifeEvent to validate
   */
  validateLifeEvent(event) {
    const required = ['timestamp', 'source', 'type', 'title'];
    
    for (const field of required) {
      if (!event[field]) {
        throw new Error(`Missing required field: ${field}. LifeEvents must include timestamp, source, type, and title.`);
      }
    }

    // Validate timestamp format
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(event.timestamp)) {
      throw new Error(`Invalid timestamp format: "${event.timestamp}". Expected ISO 8601 format (e.g., "2025-07-09T09:00:00Z")`);
    }

    // Validate type format (category.action)
    if (!/^[a-z]+\.[a-z]+$/.test(event.type)) {
      throw new Error(`Invalid event type: "${event.type}". Expected format: category.action (e.g., "music.play", "calendar.meeting")`);
    }

    // Validate source format
    if (typeof event.source !== 'string' || event.source.length === 0) {
      throw new Error(`Invalid source: "${event.source}". Source must be a non-empty string identifying the application or service.`);
    }

    // Validate title format
    if (typeof event.title !== 'string' || event.title.length === 0) {
      throw new Error(`Invalid title: "${event.title}". Title must be a non-empty string describing the event.`);
    }

    // Validate linked_uris if present
    if (event.linked_uris && Array.isArray(event.linked_uris)) {
      for (const uri of event.linked_uris) {
        if (!uri.startsWith('life://')) {
          throw new Error(`Invalid linked URI: "${uri}". All linked URIs must start with "life://"`);
        }
      }
    }

    // Validate mood if present
    if (event.mood !== undefined) {
      if (!Number.isInteger(event.mood) || event.mood < 1 || event.mood > 10) {
        throw new Error(`Invalid mood: ${event.mood}. Mood must be an integer between 1 and 10.`);
      }
    }

    // Validate duration if present
    if (event.duration !== undefined) {
      if (!Number.isInteger(event.duration) || event.duration < 0) {
        throw new Error(`Invalid duration: ${event.duration}. Duration must be a non-negative integer (seconds).`);
      }
    }
  }

  /**
   * Get all registered sources
   * @returns {Array<string>} List of registered sources
   */
  getRegisteredSources() {
    return Array.from(this.resolvers.keys());
  }

  /**
   * Check if a source has a resolver
   * @param {string} source - The source to check
   * @returns {boolean} True if resolver exists
   */
  hasResolver(source) {
    return this.resolvers.has(source);
  }
}

// Built-in resolvers for common sources
class BuiltInResolvers {
  /**
   * File system resolver for local LifeEvents
   * Note: Only works in Node.js environments
   */
  static async fileSystemResolver(basePath = './events') {
    throw new Error('fileSystemResolver is not available in browser environments. Use Node.js for file system operations.');
  }

  /**
   * Memory resolver for testing
   */
  static memoryResolver(events = new Map()) {
    return async (parsed) => {
      const key = `${parsed.date}/${parsed.source}/${parsed.type}/${parsed.slug}`;
      const event = events.get(key);
      
      if (!event) {
        throw new Error(`Event not found: ${key}`);
      }
      
      return event;
    };
  }
}

export { LifeURIResolver, BuiltInResolvers }; 