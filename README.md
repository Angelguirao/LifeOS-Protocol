
# 🧬 LifeOS Protocol

> The open standard for linking, structuring, and integrating the moments of your life.

The **LifeOS Protocol** defines a universal schema and linking system for personal life data — enabling apps, plugins, and AI assistants to store, interconnect, and navigate life events in a structured, privacy-respecting, and extensible way.

---

## 🎯 Purpose

Today, your life is scattered across dozens of apps — calendar, journal, fitness trackers, photos, chats. Each knows something, but none understand the whole.

**LifeOS Protocol is how we fix that**:

- ✅ A common format for all life events  
- 🔗 A universal URI to link them together  
- 🌐 A portable, open system anyone can build on  

---

## 🧩 Core Concepts

### 1. **LifeEvent**

Every moment is a `LifeEvent`. It includes:

| Field         | Description                                 |
|---------------|---------------------------------------------|
| `timestamp`   | When it happened                            |
| `type`        | What kind of event (e.g. `music.play`)      |
| `source`      | Where it came from (`spotify`, `calendar`)  |
| `title`       | A human-readable label                      |
| `metadata`    | Flexible, source-specific data              |
| `linked_uris` | Links to other events via `life://` URIs    |

---

### 2. **life:// URIs**

A custom URI format that acts like `https://` — but for your life.

**Format:**

```
life://<date>/<source>/<type>/<slug>
```

**Example:**

```
life://2025-07-09/spotify/music.play/pink+white
```

Use `life://` links inside your journal, plugins, dashboards, and notes — creating a connected, navigable life graph.

---

### 3. **Resolvers**

Any tool that implements the protocol can resolve a `life://...` URI to its underlying `LifeEvent` via:

- API (remote or local)
- File system/database lookup
- Plugin cache

---

## 🛠️ What It Enables

- 📝 Journals that link to real events  
- 🧠 AI that can navigate your memories with context  
- 🗺️ Graphs of interconnected moods, habits, and thoughts  
- 🔌 Plugins that work across apps via a shared protocol  

---

## 🔌 Built for Extensibility

The protocol supports:

- ✅ Plugins that import/export events (e.g., Spotify, Apple Health, Obsidian)
- ✅ Offline-first or cloud-hosted implementations
- ✅ Rich queries, tag graphs, and semantic search
- ✅ Human-readable + machine-resolvable identifiers

---

## 🌐 Sample LifeEvent

```json
{
  "timestamp": "2025-07-09T09:00:00Z",
  "source": "spotify",
  "type": "music.play",
  "title": "Pink + White",
  "metadata": {
    "artist": "Frank Ocean",
    "duration": 212
  },
  "linked_uris": [
    "life://2025-07-09/journal/entry/midyear-reflection"
  ]
}
```

---

## ✅ Why Open

We believe your memories are **yours**. You should be able to:

- Store them locally  
- Link them across tools  
- Build apps without gatekeepers  
- Let AI understand you — on your terms  

This protocol is designed to **liberate your data** and enable anyone to build tools that work with your life, not just on top of it.

---

## 📦 Use Cases

- 📝 Journal in Obsidian, linking to `life://` events  
- 📅 Visualize events across moods, media, and meetings  
- 🤖 Let GPTs reference moments across your life graph  
- 📲 Build apps that sync, store, or analyze your life with shared meaning  

---

## 📚 Learn More

- 📄 [`lifeevent.schema.json`](./lifeevent.schema.json)  
- 🛠️ `uriResolver.js` (coming soon)  
- 🔄 Plugin Integrations  
- 🧠 Philosophy & Design Notes  

---

## 🧑‍💻 Want to Use It?

- As a **developer** → Integrate the protocol in your app  
- As a **user** → Try the LifeOS Hosted App or install plugins  
- As a **builder** → Fork and extend the protocol  

---

## ⚖️ License

Apache 2.0 — because your life should be free, not fenced in.
