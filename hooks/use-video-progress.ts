"use client"

import { useState, useEffect, useRef } from "react"
import type { WatchedInterval } from "@/lib/types"
import { mergeIntervals, calculateProgress } from "@/lib/interval-utils"
import { saveProgress, getProgress } from "@/app/actions/progress-actions"

interface UseVideoProgressProps {
  userId: string
  videoId: string
  videoDuration: number
  saveInterval?: number // How often to save progress (in ms)
}

export function useVideoProgress({
  userId,
  videoId,
  videoDuration,
  saveInterval = 5000, // Default to saving every 5 seconds
}: UseVideoProgressProps) {
  const [watchedIntervals, setWatchedIntervals] = useState<WatchedInterval[]>([])
  const [lastPosition, setLastPosition] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const currentIntervalRef = useRef<WatchedInterval | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved progress on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        const savedProgress = await getProgress(userId, videoId)

        if (savedProgress) {
          setWatchedIntervals(savedProgress.watchedIntervals)
          setLastPosition(savedProgress.lastPosition)
          setProgress(savedProgress.totalProgress)
        }
      } catch (error) {
        console.error("Failed to load progress:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()

    // Clean up any timeouts on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [userId, videoId])

  // Start tracking a new interval
  const startTracking = (currentTime: number) => {
    if (!currentIntervalRef.current) {
      currentIntervalRef.current = {
        start: currentTime,
        end: currentTime,
      }
    }
  }

  // Update the current interval's end time
  const updateTracking = (currentTime: number) => {
    if (currentIntervalRef.current) {
      currentIntervalRef.current.end = currentTime
    }
  }

  // Stop tracking and merge the interval
  const stopTracking = async () => {
    if (currentIntervalRef.current) {
      const newIntervals = mergeIntervals(watchedIntervals, currentIntervalRef.current)

      setWatchedIntervals(newIntervals)

      const newProgress = calculateProgress(newIntervals, videoDuration)
      setProgress(newProgress)

      currentIntervalRef.current = null

      // Save progress immediately when tracking stops
      await saveUserProgress(lastPosition)
    }
  }

  // Handle seeking (jumping to a new position)
  const handleSeek = async (newPosition: number) => {
    // Stop current tracking
    await stopTracking()

    // Update last position
    setLastPosition(newPosition)

    // Start new tracking from the seek position
    startTracking(newPosition)
  }

  // Save progress to the server
  const saveUserProgress = async (currentPosition: number) => {
    try {
      setLastPosition(currentPosition)

      await saveProgress(userId, videoId, watchedIntervals, currentPosition, videoDuration)
    } catch (error) {
      console.error("Failed to save progress:", error)
    }
  }

  // Schedule periodic saving
  const scheduleSave = (currentPosition: number) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveUserProgress(currentPosition)
    }, saveInterval)
  }

  return {
    watchedIntervals,
    lastPosition,
    progress,
    isLoading,
    startTracking,
    updateTracking,
    stopTracking,
    handleSeek,
    saveUserProgress,
  }
}
