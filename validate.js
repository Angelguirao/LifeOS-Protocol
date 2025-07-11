#!/usr/bin/env node

/**
 * LifeOS Protocol Event Validator
 * 
 * CLI tool to validate LifeEvents against the schema.
 * Usage: node validate.js <event-file.json>
 */

import fs from 'fs';
import path from 'path';
import { LifeURIResolver } from './uriResolver.js';
import { isValidEventType, getEventTypeDescription } from './eventTypes.js';

// Load the schema
const schema = JSON.parse(fs.readFileSync('./lifeevent.schema.json', 'utf8'));

class LifeEventValidator {
  constructor() {
    this.resolver = new LifeURIResolver();
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate a single LifeEvent
   * @param {Object} event - The LifeEvent to validate
   * @returns {boolean} True if valid
   */
  validateEvent(event) {
    this.errors = [];
    this.warnings = [];

    try {
      // Use the resolver's validation
      this.resolver.validateLifeEvent(event);
    } catch (error) {
      this.errors.push(error.message);
    }

    // Additional validations
    this.validateEventType(event);
    this.validateMetadata(event);
    this.validateLinkedURIs(event);
    this.validateTimestamps(event);

    return this.errors.length === 0;
  }

  /**
   * Validate event type against registry
   * @param {Object} event - The LifeEvent to validate
   */
  validateEventType(event) {
    if (event.type && !isValidEventType(event.type)) {
      this.warnings.push(`Event type "${event.type}" is not in the standard registry. Consider using a standard type.`);
    }
  }

  /**
   * Validate metadata structure
   * @param {Object} event - The LifeEvent to validate
   */
  validateMetadata(event) {
    if (event.metadata && typeof event.metadata !== 'object') {
      this.errors.push('Metadata must be an object');
    }
  }

  /**
   * Validate linked URIs
   * @param {Object} event - The LifeEvent to validate
   */
  validateLinkedURIs(event) {
    if (event.linked_uris) {
      if (!Array.isArray(event.linked_uris)) {
        this.errors.push('linked_uris must be an array');
        return;
      }

      for (const uri of event.linked_uris) {
        try {
          this.resolver.parseURI(uri);
        } catch (error) {
          this.errors.push(`Invalid linked URI: ${uri} - ${error.message}`);
        }
      }
    }
  }

  /**
   * Validate timestamp consistency
   * @param {Object} event - The LifeEvent to validate
   */
  validateTimestamps(event) {
    if (event.created_at && event.timestamp) {
      const created = new Date(event.created_at);
      const timestamp = new Date(event.timestamp);
      
      if (created < timestamp) {
        this.warnings.push('created_at is before timestamp. This might indicate an issue.');
      }
    }
  }

  /**
   * Get validation results
   * @returns {Object} Validation results
   */
  getResults() {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Print validation results
   */
  printResults() {
    const results = this.getResults();
    
    if (results.valid) {
      console.log('✅ LifeEvent is valid!');
    } else {
      console.log('❌ LifeEvent has validation errors:');
      results.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      results.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
  }
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node validate.js <event-file.json>');
    console.log('Or pipe JSON: echo \'{"timestamp":"..."}\' | node validate.js');
    process.exit(1);
  }

  const validator = new LifeEventValidator();
  let event;

  // Check if input is piped
  if (!process.stdin.isTTY) {
    // Read from stdin
    let input = '';
    process.stdin.on('data', chunk => {
      input += chunk;
    });
    process.stdin.on('end', () => {
      try {
        event = JSON.parse(input);
        const isValid = validator.validateEvent(event);
        validator.printResults();
        process.exit(isValid ? 0 : 1);
      } catch (error) {
        console.error('❌ Invalid JSON:', error.message);
        process.exit(1);
      }
    });
  } else {
    // Read from file
    const filePath = args[0];
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      event = JSON.parse(content);
      
      const isValid = validator.validateEvent(event);
      validator.printResults();
      
      // Print event details if valid
      if (isValid) {
        console.log('\n📋 Event Details:');
        console.log(`  Title: ${event.title}`);
        console.log(`  Type: ${event.type}${getEventTypeDescription(event.type) ? ` (${getEventTypeDescription(event.type)})` : ''}`);
        console.log(`  Source: ${event.source}`);
        console.log(`  Timestamp: ${event.timestamp}`);
        if (event.linked_uris && event.linked_uris.length > 0) {
          console.log(`  Linked Events: ${event.linked_uris.length}`);
        }
      }
      
      process.exit(isValid ? 0 : 1);
    } catch (error) {
      console.error('❌ Error reading file:', error.message);
      process.exit(1);
    }
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { LifeEventValidator }; 