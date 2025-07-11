/**
 * LifeOS Protocol - TypeScript Declarations
 * 
 * This file provides TypeScript type definitions for the LifeOS Protocol.
 */

/**
 * Core LifeOS Event interface
 */
export interface LifeOSEvent {
  id: string
  uri: string
  protocol_version: string
  source: string
  type: string
  title: string
  metadata: Record<string, any>
  tags: string[]
  mood?: number
  timestamp: string
  duration_minutes?: number
  location?: string
  energy_level?: number
  parent_event_id?: string
  related_events: string[]
  user_id?: string
}

/**
 * Event creation data (partial event data)
 */
export type LifeOSEventData = Partial<LifeOSEvent>

/**
 * Event validation result
 */
export interface EventValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Event linking result
 */
export interface EventLinkingResult {
  primary: LifeOSEvent
  related: LifeOSEvent[]
}

/**
 * URI components
 */
export interface URIComponents {
  date: string
  source: string
  type: string
  slug: string
  full: string
}

/**
 * Plugin capability
 */
export interface PluginCapability {
  type: string
  description: string
  configurable: boolean
  metadata?: Record<string, any>
}

/**
 * Plugin settings
 */
export interface PluginSettings {
  enabled: boolean
  autoSync: boolean
  syncInterval?: number
  credentials?: Record<string, any>
  customSettings?: Record<string, any>
  platform?: 'core' | 'premium' | 'both'
}

/**
 * Sync result
 */
export interface SyncResult {
  success: boolean
  eventsImported: number
  errors?: string[]
  lastSync: Date
  metadata?: Record<string, any>
}

export declare function createLifeOSEvent(eventData: any): any;
export declare function validateLifeOSEvent(event: any): any;
export declare function generateLifeOSURI(event: any): string;
export declare function parseLifeOSURI(uri: string): any;
export declare function linkEvents(primaryEvent: any, relatedEvents: any): any;

export declare class LifeURIResolver {
  constructor();
  parseURI(uri: string): any;
  generateURI(components: any): string;
  registerResolver(source: string, resolver: Function): void;
  resolveURI(uri: string): Promise<any>;
  validateLifeEvent(event: any): boolean;
}

export declare function getAllEventTypesList(): string[];
export declare function isValidEventType(type: string): boolean;

export declare const uriResolver: LifeURIResolver;
