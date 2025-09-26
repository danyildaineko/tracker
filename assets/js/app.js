/**
 * Habit Tracker - Core Application Logic
 * 
 * This file contains the core utilities, storage management, and business logic
 * for the habit tracking application. It handles date calculations, localStorage
 * operations, and habit-related computations like streaks and scheduling.
 * 
 * @author Habit Tracker Contributors
 * @license MIT
 */

const { useEffect, useMemo, useRef, useState } = React;

// Application constants
const STORAGE_KEY = "habit-tracker-v2";
const THEME_KEY = "habit-tracker-theme";
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Zurich";

// ========================================
// DATE AND TIME UTILITIES
// ========================================
/**
 * Get ISO date string (YYYY-MM-DD) for a given date in the user's timezone
 * @param {Date} [d=new Date()] - The date to format
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
function isoDate(d = new Date()) {
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric" }).format(d);
  const m = new Intl.DateTimeFormat("en-CA", { timeZone: tz, month: "2-digit" }).format(d);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: tz, day: "2-digit" }).format(d);
  return `${y}-${m}-${day}`;
}

/**
 * Add or subtract days from an ISO date string
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @param {number} delta - Number of days to add (positive) or subtract (negative)
 * @returns {string} New ISO date string
 */
function addDays(dateStr, delta) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return isoDate(dt);
}
function monthRange(dateStr) {
  const [y, m] = dateStr.split("-").map(Number);
  const first = `${y}-${String(m).padStart(2, '0')}-01`;
  const start = new Date(first + "T00:00:00");
  const end = new Date(Date.UTC(y, m, 0)); // last day of month
  const days = [];
  let d = isoDate(start);
  while (true) {
    days.push(d);
    if (d === isoDate(end)) break;
    d = addDays(d, 1);
    if (days.length > 40) break;
  }
  return days;
}
function startOfWeek(dateStr, weekStartsOn = 1) {
  const date = new Date(dateStr + "T00:00:00");
  const day = (date.getDay() + 7 - weekStartsOn) % 7;
  return addDays(isoDate(date), -day);
}
function range(n) { return [...Array(n).keys()]; }
function uid() { return Math.random().toString(36).slice(2, 10); }
function classNames(...xs) { return xs.filter(Boolean).join(" "); }

// ========================================
// LOCAL STORAGE MANAGEMENT
// ========================================
function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw);
    parsed.habits = parsed.habits.map((h, i) => ({ order: i, ...h, order: h.order ?? i }));
    return parsed;
  } catch {
    const today = isoDate();
    return {
      habits: [
        { id: uid(), name: "Work", color: "bg-blue-100 dark:bg-blue-900/40", icon: "💼", repeatDays: [0,1,2,3,4,5,6], createdAt: today, order: 0 },
        { id: uid(), name: "Study", color: "bg-purple-100 dark:bg-purple-900/40", icon: "📚", repeatDays: [0,1,2,3,4,5,6], createdAt: today, order: 1 },
        { id: uid(), name: "Art", color: "bg-pink-100 dark:bg-pink-900/40", icon: "🎨", repeatDays: [0,1,2,3,4,5,6], createdAt: today, order: 2 },
        { id: uid(), name: "Exercises", color: "bg-green-100 dark:bg-green-900/40", icon: "💪", repeatDays: [0,1,2,3,4,5,6], createdAt: today, order: 3 },
        { id: uid(), name: "Meditation", color: "bg-indigo-100 dark:bg-indigo-900/40", icon: "🧘", repeatDays: [0,1,2,3,4,5,6], createdAt: today, order: 4 },
        { id: uid(), name: "Journal", color: "bg-amber-100 dark:bg-amber-900/40", icon: "📝", repeatDays: [0,1,2,3,4,5,6], createdAt: today, order: 5 },
        { id: uid(), name: "Read", color: "bg-orange-100 dark:bg-orange-900/40", icon: "📖", repeatDays: [0,1,2,3,4,5,6], createdAt: today, order: 6 },
      ],
      completions: {},
    };
  }
}
function saveStore(store) { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }

// ========================================
// HABIT BUSINESS LOGIC
// ========================================
function hasCompleted(store, date, habitId) { return !!store.completions[date]?.includes(habitId); }
function isScheduled(h, date) {
  const dt = new Date(date + "T00:00:00");
  const dow = dt.getDay();
  return h.repeatDays.includes(dow) && (!h.archived);
}
function calcStreak(store, habit, fromDate) {
  let streak = 0; let d = fromDate;
  while (true) {
    const beforeCreated = d < habit.createdAt;
    const scheduled = isScheduled(habit, d);
    const done = hasCompleted(store, d, habit.id);
    if (scheduled && done) streak += 1; else if (scheduled && !done) break;
    if (beforeCreated) break;
    const prev = addDays(d, -1); if (prev === d) break; d = prev; if (streak > 3650) break;
  }
  return streak;
}
