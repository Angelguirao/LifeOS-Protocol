# LifeOS Protocol Implementation Guide

This guide shows how to integrate the LifeOS Protocol into your applications.

## 🚀 Quick Start

### 1. Install the Protocol

```bash
npm install lifeos-protocol
```

### 2. Basic Usage

```javascript
const { LifeURIResolver, BuiltInResolvers } = require('lifeos-protocol');

// Create a resolver
const resolver = new LifeURIResolver();

// Register a resolver for your data source
resolver.registerResolver('myapp', async (parsed) => {
  // Fetch event from your storage
  const event = await fetchEventFromDatabase(parsed);
  return event;
});

// Generate a life:// URI
const uri = resolver.generateURI({
  date: '2025-07-09',
  source: 'myapp',
  type: 'user.action',
  slug: 'user-login'
});

// Resolve a life:// URI
const event = await resolver.resolveURI('life://2025-07-09/myapp/user.action/user-login');
```

## 📋 LifeEvent Schema

Every LifeEvent must have these required fields:

```javascript
{
  "timestamp": "2025-07-09T09:00:00Z",  // ISO 8601
  "source": "spotify",                   // Your app/service name
  "type": "music.play",                  // category.action format
  "title": "Pink + White",              // Human-readable title
  "metadata": {                          // Optional source-specific data
    "artist": "Frank Ocean",
    "duration": 212
  },
  "linked_uris": [                      // Optional links to other events
    "life://2025-07-09/journal/entry/midyear-reflection"
  ]
}
```

## 🔗 URI Format

LifeOS uses a custom URI scheme: `life://<date>/<source>/<type>/<slug>`

**Examples:**
- `life://2025-07-09/spotify/music.play/pink+white`
- `life://2025-07-09/calendar/meeting/team-standup`
- `life://2025-07-09/journal/entry/midyear-reflection`

## 🛠️ Integration Patterns

### Pattern 1: Event Publisher

Your app creates LifeEvents and publishes them:

```javascript
// When user listens to music
const event = {
  timestamp: new Date().toISOString(),
  source: 'myapp',
  type: 'music.play',
  title: song.title,
  metadata: {
    artist: song.artist,
    album: song.album,
    duration: song.duration
  }
};

// Generate URI for this event
const uri = resolver.generateURI({
  date: event.timestamp.split('T')[0],
  source: event.source,
  type: event.type,
  slug: song.id
});

// Store event and URI
await storeEvent(event, uri);
```

### Pattern 2: Event Consumer

Your app reads LifeEvents from other sources:

```javascript
// Register resolver for external source
resolver.registerResolver('spotify', async (parsed) => {
  // Fetch from Spotify API or local cache
  return await fetchSpotifyEvent(parsed);
});

// Resolve and use events
const musicEvent = await resolver.resolveURI('life://2025-07-09/spotify/music.play/pink+white');
console.log(`User listened to ${musicEvent.title} by ${musicEvent.metadata.artist}`);
```

### Pattern 3: Event Linker

Your app creates links between events:

```javascript
// Journal entry that references music
const journalEvent = {
  timestamp: new Date().toISOString(),
  source: 'journal',
  type: 'journal.entry',
  title: 'Today\'s thoughts',
  metadata: {
    content: 'Listening to Frank Ocean while reflecting...'
  },
  linked_uris: [
    'life://2025-07-09/spotify/music.play/pink+white'
  ]
};
```

## 🔌 Built-in Resolvers

The protocol includes ready-to-use resolvers:

```javascript
// File system resolver
const fileResolver = BuiltInResolvers.fileSystemResolver('./events');
resolver.registerResolver('local', fileResolver);

// Memory resolver (for testing)
const memoryResolver = BuiltInResolvers.memoryResolver();
resolver.registerResolver('test', memoryResolver);
```

## ✅ Validation

The protocol automatically validates LifeEvents:

```javascript
// This will throw an error if event is invalid
const event = await resolver.resolveURI(uri);
```

## 🎯 Common Event Types

| Category | Actions | Example |
|----------|---------|---------|
| `music` | `play`, `pause`, `skip` | `music.play` |
| `calendar` | `meeting`, `reminder`, `birthday` | `calendar.meeting` |
| `journal` | `entry`, `mood`, `thought` | `journal.entry` |
| `fitness` | `workout`, `step`, `sleep` | `fitness.workout` |
| `photo` | `capture`, `edit`, `share` | `photo.capture` |
| `location` | `arrive`, `depart`, `visit` | `location.arrive` |

## 🔐 Privacy Considerations

- Store events locally when possible
- Encrypt sensitive metadata
- Use pseudonymous slugs for privacy
- Implement proper access controls

## 🧪 Testing

```bash
# Run the example
npm test

# Validate schema
npm run validate
```

## 📚 Next Steps

- Check out the [examples](./examples/) directory
- Read the [schema documentation](./lifeevent.schema.json)
- Join the community at [lifeos.dev](https://lifeos.dev) 