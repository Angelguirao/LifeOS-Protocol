/**
 * LifeOS Protocol - Main Entry Point
 * 
 * This file exports all the functions and classes needed by LifeOS applications.
 */

import { LifeURIResolver } from './uriResolver.js';
import { getAllEventTypesList, isValidEventType } from './eventTypes.js';

// Create a singleton instance
const uriResolver = new LifeURIResolver();

/**
 * Create a LifeOS Event with proper URI generation
 */
export function createLifeOSEvent(eventData) {
  const {
    title,
    type,
    source = 'manual',
    timestamp = new Date().toISOString(),
    tags = [],
    mood,
    metadata = {},
    duration_minutes,
    location,
    energy_level,
    parent_event_id,
    related_events = []
  } = eventData;

  // Generate a unique event ID
  const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate URI
  const date = new Date(timestamp).toISOString().split('T')[0];
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const uri = `life://${date}/${source}/${type}/${slug}`;

  return {
    id: eventId,
    uri,
    protocol_version: '1.0',
    source,
    type,
    title,
    metadata,
    tags,
    mood,
    timestamp,
    duration_minutes,
    location,
    energy_level,
    parent_event_id,
    related_events,
    user_id: eventData.user_id
  };
}

/**
 * Validate a LifeOS Event against the schema
 */
export function validateLifeOSEvent(event) {
  const errors = [];
  
  // Required fields
  if (!event.title) errors.push('Title is required');
  if (!event.type) errors.push('Type is required');
  if (!event.source) errors.push('Source is required');
  if (!event.timestamp) errors.push('Timestamp is required');
  if (!event.uri) errors.push('URI is required');
  
  // Validate event type
  if (event.type && !isValidEventType(event.type)) {
    errors.push(`Invalid event type: ${event.type}`);
  }
  
  // Validate URI format
  try {
    uriResolver.parseURI(event.uri);
  } catch (error) {
    errors.push(`Invalid URI format: ${error.message}`);
  }
  
  // Validate mood range (1-10)
  if (event.mood && (event.mood < 1 || event.mood > 10)) {
    errors.push('Mood must be between 1 and 10');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate a LifeOS URI from event data
 */
export function generateLifeOSURI(event) {
  const date = new Date(event.timestamp).toISOString().split('T')[0];
  const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `life://${date}/${event.source}/${event.type}/${slug}`;
}

/**
 * Parse a LifeOS URI into components
 */
export function parseLifeOSURI(uri) {
  return uriResolver.parseURI(uri);
}

/**
 * Link multiple events together
 */
export function linkEvents(primaryEvent, relatedEvents) {
  if (!Array.isArray(relatedEvents)) {
    relatedEvents = [relatedEvents];
  }
  
  // Filter out invalid events
  const validRelatedEvents = relatedEvents.filter(event => 
    event && event.id && event.uri
  );
  
  // Update the primary event
  const updatedPrimaryEvent = {
    ...primaryEvent,
    related_events: validRelatedEvents.map(event => event.id)
  };
  
  // Update related events to point back to primary
  const updatedRelatedEvents = validRelatedEvents.map(event => ({
    ...event,
    parent_event_id: primaryEvent.id
  }));
  
  return updatedPrimaryEvent;
}

// Export all classes and functions
export { LifeURIResolver };
export { getAllEventTypesList, isValidEventType };
export { uriResolver };
