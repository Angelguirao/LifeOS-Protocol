/**
 * LifeOS Protocol - TypeScript Types
 * 
 * This file defines the TypeScript interfaces and types used by the LifeOS Protocol.
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
  eventsExported: number
  errors?: string[]
  lastSync: Date
  metadata?: Record<string, any>
}
