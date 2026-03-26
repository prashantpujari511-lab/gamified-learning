const XP_PER_LEVEL = 50;

const TRACK_GAME_IDS = Object.freeze({
  primary: [
    "math_adventure",
    "number_sprint",
    "counting_castle",
    "shape_color",
    "mini_science_lab",
    "nature_explorer",
    "alphabet_treasure",
    "word_builder_sprint",
    "sentence_starter"
  ],
  middle: [
    "math_logic_arena",
    "fraction_sprint",
    "ratio_race",
    "science_quiz_battle_arena",
    "lab_challenge",
    "bio_explorer",
    "grammar_ninja",
    "sentence_fixer",
    "word_master"
  ],
  high: [
    "physics_formula_rush",
    "quant_challenge",
    "speed_math_arena",
    "physics_simulation_game",
    "cyber_security_escape_room",
    "science_battle_grid",
    "coding_challenge_arena",
    "word_logic_sprint",
    "language_analyzer"
  ],
  college: ["placement_preparation_battle", "banking_exam_simulator_game"]
});

const TRACKS = Object.freeze(Object.keys(TRACK_GAME_IDS));
const GAME_IDS = TRACK_GAME_IDS.primary;

function createDefaultLevelState() {
  return {
    currentLevel: 1,
    bestStars: 0,
    totalStars: 0
  };
}

function createDefaultTrackProgress(track) {
  const ids = TRACK_GAME_IDS[track] || [];
  const progress = {};
  ids.forEach((gameId) => {
    progress[gameId] = createDefaultLevelState();
  });
  return progress;
}

function createDefaultGameProgress() {
  const all = {};
  TRACKS.forEach((track) => {
    all[track] = createDefaultTrackProgress(track);
  });
  return all;
}

function createDefaultPrimaryProgress() {
  return { primary: createDefaultTrackProgress("primary") };
}

function getTrackGameIds(track) {
  const normalizedTrack = String(track || "").trim().toLowerCase();
  return TRACK_GAME_IDS[normalizedTrack] || [];
}

const DATE_FORMATTER_CACHE = new Map();

function normalizeTimeZone(timeZone) {
  const zone = String(timeZone || "").trim();
  if (!zone) return "UTC";

  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: zone }).format(new Date());
    return zone;
  } catch {
    return "UTC";
  }
}

function getDateFormatter(timeZone) {
  const safeTimeZone = normalizeTimeZone(timeZone);
  if (!DATE_FORMATTER_CACHE.has(safeTimeZone)) {
    DATE_FORMATTER_CACHE.set(
      safeTimeZone,
      new Intl.DateTimeFormat("en-CA", {
        timeZone: safeTimeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
    );
  }

  return DATE_FORMATTER_CACHE.get(safeTimeZone);
}

function toDateKey(value, timeZone = "UTC") {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";

  const formatter = getDateFormatter(timeZone);
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) return "";
  return `${year}-${month}-${day}`;
}

function buildActivityCounts(logs, days = 365, timeZone = "UTC") {
  const safeTimeZone = normalizeTimeZone(timeZone);
  const validKeys = new Set();
  const cursor = new Date();

  for (let i = 0; i < days; i += 1) {
    validKeys.add(toDateKey(cursor, safeTimeZone));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const counts = {};
  (Array.isArray(logs) ? logs : []).forEach((log) => {
    const key = toDateKey(log && log.completedAt, safeTimeZone);
    if (!key) return;
    if (!validKeys.has(key)) return;

    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
}

function calculateCurrentStreak(activityCounts, timeZone = "UTC") {
  const safeTimeZone = normalizeTimeZone(timeZone);
  const counts = activityCounts || {};
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = toDateKey(cursor, safeTimeZone);
    if (!counts[key]) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

function buildDashboardPayload(user, options = {}) {
  const timeZone = normalizeTimeZone(options && options.timeZone);
  const xp = Number.isFinite(user && user.xp) ? user.xp : 0;
  const level = Math.floor(xp / XP_PER_LEVEL);
  const progress = xp % XP_PER_LEVEL;
  const activityCounts = buildActivityCounts(user && user.gameLogs, 365, timeZone);
  const streak = calculateCurrentStreak(activityCounts, timeZone);

  return {
    name: user && user.name,
    email: user && user.email,
    phone: user && user.phone,
    profileImage: user && user.profileImage,
    age: user && user.age,
    xp,
    level,
    progress,
    streak,
    activityCounts
  };
}

module.exports = {
  XP_PER_LEVEL,
  TRACKS,
  TRACK_GAME_IDS,
  GAME_IDS,
  getTrackGameIds,
  createDefaultLevelState,
  createDefaultGameProgress,
  createDefaultTrackProgress,
  createDefaultPrimaryProgress,
  buildDashboardPayload
};
