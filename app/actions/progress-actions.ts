"use server"

import type { VideoProgress, WatchedInterval } from "@/lib/types"
import { calculateProgress } from "@/lib/interval-utils"

// In a real application, this would be stored in a database
// For this demo, we'll use a simple in-memory store
const progressStore: Record<string, VideoProgress> = {}

/**
 * Saves the user's progress for a specific video
 */
export async function saveProgress(
  userId: string,
  videoId: string,
  watchedIntervals: WatchedInterval[],
  lastPosition: number,
  videoDuration: number,
): Promise<VideoProgress> {
  const totalProgress = calculateProgress(watchedIntervals, videoDuration)

  const progress: VideoProgress = {
    userId,
    videoId,
    watchedIntervals,
    lastPosition,
    totalProgress,
  }

  // In a real app, this would be a database operation
  const key = `${userId}-${videoId}`
  progressStore[key] = progress

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return progress
}

/**
 * Retrieves the user's progress for a specific video
 */
export async function getProgress(userId: string, videoId: string): Promise<VideoProgress | null> {
  // In a real app, this would be a database query
  const key = `${userId}-${videoId}`

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return progressStore[key] || null
}
