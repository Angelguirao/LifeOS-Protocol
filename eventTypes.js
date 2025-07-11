/**
 * LifeOS Protocol Event Type Registry
 * 
 * Standard event types for consistent categorization across applications.
 * Format: <category>.<action>
 */

const EVENT_TYPES = {
  // Music & Media
  music: {
    play: "User started playing a track",
    pause: "User paused playback",
    skip: "User skipped to next track",
    like: "User liked a track",
    add_to_playlist: "User added track to playlist"
  },

  // Calendar & Scheduling
  calendar: {
    meeting: "Scheduled meeting or appointment",
    reminder: "Calendar reminder triggered",
    birthday: "Birthday or anniversary",
    travel: "Travel event (flight, hotel, etc.)",
    deadline: "Project or task deadline"
  },

  // Journal & Notes
  journal: {
    entry: "Journal entry or note",
    mood: "Mood tracking entry",
    thought: "Quick thought or idea",
    reflection: "Longer reflection or analysis",
    goal: "Goal setting or tracking"
  },

  // Fitness & Health
  fitness: {
    workout: "Exercise session",
    step: "Step count milestone",
    sleep: "Sleep tracking",
    weight: "Weight measurement",
    nutrition: "Food or meal logged"
  },

  // Location & Travel
  location: {
    arrive: "Arrived at a location",
    depart: "Left a location",
    visit: "Visited a place",
    commute: "Travel between locations"
  },

  // Photos & Media
  photo: {
    capture: "Photo taken",
    edit: "Photo edited",
    share: "Photo shared",
    album: "Album created or updated"
  },

  // Communication
  communication: {
    call: "Phone or video call",
    message: "Text or chat message",
    email: "Email sent or received",
    social: "Social media activity"
  },

  // Work & Productivity
  work: {
    task: "Task completed",
    project: "Project milestone",
    meeting: "Work meeting",
    focus: "Focus session",
    break: "Work break"
  },

  // Learning & Education
  learning: {
    course: "Course or lesson",
    reading: "Reading session",
    study: "Study session",
    skill: "Skill development"
  },

  // Finance
  finance: {
    purchase: "Purchase made",
    expense: "Expense logged",
    income: "Income received",
    budget: "Budget update"
  }
};

/**
 * Get all available event types
 * @returns {Object} All event types organized by category
 */
function getAllEventTypes() {
  return EVENT_TYPES;
}

/**
 * Get event types for a specific category
 * @param {string} category - The category (e.g., 'music', 'calendar')
 * @returns {Object} Event types for that category
 */
function getEventTypesByCategory(category) {
  return EVENT_TYPES[category] || {};
}

/**
 * Check if an event type is valid
 * @param {string} eventType - The event type to validate (e.g., 'music.play')
 * @returns {boolean} True if valid
 */
function isValidEventType(eventType) {
  const [category, action] = eventType.split('.');
  return EVENT_TYPES[category] && EVENT_TYPES[category][action];
}

/**
 * Get description for an event type
 * @param {string} eventType - The event type (e.g., 'music.play')
 * @returns {string} Description of the event type
 */
function getEventTypeDescription(eventType) {
  const [category, action] = eventType.split('.');
  return EVENT_TYPES[category]?.[action] || null;
}

/**
 * Get all event types as a flat list
 * @returns {Array<string>} Array of all event types (e.g., ['music.play', 'calendar.meeting'])
 */
function getAllEventTypesList() {
  const types = [];
  for (const [category, actions] of Object.entries(EVENT_TYPES)) {
    for (const action of Object.keys(actions)) {
      types.push(`${category}.${action}`);
    }
  }
  return types;
}

export {
  EVENT_TYPES,
  getAllEventTypes,
  getEventTypesByCategory,
  isValidEventType,
  getEventTypeDescription,
  getAllEventTypesList
}; 