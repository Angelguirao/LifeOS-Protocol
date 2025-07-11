/**
 * Basic LifeOS Protocol Usage Example
 * 
 * This example shows how to:
 * 1. Create LifeEvents
 * 2. Generate life:// URIs
 * 3. Resolve URIs back to events
 */

import { LifeURIResolver, BuiltInResolvers } from '../uriResolver.js';

// Create a resolver instance
const resolver = new LifeURIResolver();

// Set up a memory resolver for this example
const memoryEvents = new Map();
const memoryResolver = BuiltInResolvers.memoryResolver(memoryEvents);
resolver.registerResolver('spotify', memoryResolver);
resolver.registerResolver('journal', memoryResolver);

// Example 1: Create a LifeEvent and generate its URI
function createSpotifyEvent() {
  const event = {
    timestamp: "2025-07-09T09:00:00Z",
    source: "spotify",
    type: "music.play",
    title: "Pink + White",
    metadata: {
      artist: "Frank Ocean",
      album: "Blonde",
      duration: 212,
      track_id: "spotify:track:3xKsf9qdS1CyvXSMEid6g8"
    },
    linked_uris: [],
    tags: ["chill", "nostalgic"],
    mood: 8
  };

  // Generate the URI for this event
  const uri = resolver.generateURI({
    date: "2025-07-09",
    source: "spotify", 
    type: "music.play",
    slug: "pink+white"
  });

  console.log('Generated URI:', uri);
  // Output: life://2025-07-09/spotify/music.play/pink%2Bwhite

  // Store the event in memory
  const key = "2025-07-09/spotify/music.play/pink+white";
  memoryEvents.set(key, event);

  return { event, uri };
}

// Example 2: Create a journal entry that links to the music event
function createJournalEntry() {
  const musicEvent = createSpotifyEvent();
  
  const journalEvent = {
    timestamp: "2025-07-09T10:30:00Z",
    source: "journal",
    type: "journal.entry", 
    title: "Midyear Reflection",
    metadata: {
      content: "Listening to Frank Ocean while reflecting on the first half of the year...",
      word_count: 450
    },
    linked_uris: [musicEvent.uri],
    tags: ["reflection", "personal"],
    mood: 7
  };

  // Generate URI for journal entry
  const uri = resolver.generateURI({
    date: "2025-07-09",
    source: "journal",
    type: "journal.entry", 
    slug: "midyear-reflection"
  });

  console.log('Journal URI:', uri);
  // Output: life://2025-07-09/journal/journal.entry/midyear-reflection

  // Store the journal event
  const key = "2025-07-09/journal/journal.entry/midyear-reflection";
  memoryEvents.set(key, journalEvent);

  return { event: journalEvent, uri };
}

// Example 3: Resolve URIs back to events
async function resolveEvents() {
  console.log('\n--- Resolving Events ---');
  
  try {
    // Resolve the music event
    const musicURI = "life://2025-07-09/spotify/music.play/pink+white";
    const musicEvent = await resolver.resolveURI(musicURI);
    console.log('Resolved music event:', musicEvent.title);

    // Resolve the journal entry
    const journalURI = "life://2025-07-09/journal/journal.entry/midyear-reflection";
    const journalEvent = await resolver.resolveURI(journalURI);
    console.log('Resolved journal event:', journalEvent.title);
    console.log('Journal links to:', journalEvent.linked_uris);

  } catch (error) {
    console.error('Error resolving events:', error.message);
  }
}

// Example 4: Parse URI components
function parseURIExample() {
  const uri = "life://2025-07-09/spotify/music.play/pink+white";
  const parsed = resolver.parseURI(uri);
  
  console.log('\n--- Parsed URI Components ---');
  console.log('Date:', parsed.date);
  console.log('Source:', parsed.source);
  console.log('Type:', parsed.type);
  console.log('Slug:', parsed.slug);
}

// Run the examples
async function runExamples() {
  console.log('🧬 LifeOS Protocol Examples\n');
  
  console.log('--- Creating Events ---');
  createJournalEntry();
  
  console.log('\n--- URI Parsing ---');
  parseURIExample();
  
  await resolveEvents();
  
  console.log('\n--- Available Sources ---');
  console.log('Registered sources:', resolver.getRegisteredSources());
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export {
  createSpotifyEvent,
  createJournalEntry,
  resolveEvents,
  parseURIExample
}; 