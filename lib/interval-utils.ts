import type { WatchedInterval } from "./types"

/**
 * Merges a new interval with existing watched intervals
 * Returns the updated list of non-overlapping intervals
 */
export function mergeIntervals(existingIntervals: WatchedInterval[], newInterval: WatchedInterval): WatchedInterval[] {
  // Validate the new interval
  if (newInterval.start >= newInterval.end || newInterval.start < 0) {
    return existingIntervals
  }

  // Create a copy of existing intervals
  const intervals = [...existingIntervals]

  // Add the new interval
  intervals.push(newInterval)

  // Sort intervals by start time
  intervals.sort((a, b) => a.start - b.start)

  // Merge overlapping intervals
  const merged: WatchedInterval[] = []
  let current = intervals[0]

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i]

    // If current interval overlaps with next interval, merge them
    if (current.end >= next.start) {
      current.end = Math.max(current.end, next.end)
    } else {
      // No overlap, add current to result and move to next
      merged.push(current)
      current = next
    }
  }

  // Add the last interval
  merged.push(current)

  return merged
}

/**
 * Calculates the total duration of watched intervals
 */
export function calculateWatchedDuration(intervals: WatchedInterval[]): number {
  return intervals.reduce((total, interval) => {
    return total + (interval.end - interval.start)
  }, 0)
}

/**
 * Calculates progress percentage based on watched intervals and video duration
 */
export function calculateProgress(intervals: WatchedInterval[], videoDuration: number): number {
  if (videoDuration <= 0) return 0

  const watchedDuration = calculateWatchedDuration(intervals)
  const percentage = (watchedDuration / videoDuration) * 100

  // Ensure progress doesn't exceed 100%
  return Math.min(Math.round(percentage * 10) / 10, 100)
}
