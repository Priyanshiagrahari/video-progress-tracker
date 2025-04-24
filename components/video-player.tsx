"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useVideoProgress } from "@/hooks/use-video-progress"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"

interface VideoPlayerProps {
  userId: string
  videoId: string
  videoUrl: string
  title: string
}

export function VideoPlayer({ userId, videoId, videoUrl, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const { lastPosition, progress, isLoading, startTracking, updateTracking, stopTracking, handleSeek } =
    useVideoProgress({
      userId,
      videoId,
      videoDuration: duration,
    })

  // Initialize video player
  useEffect(() => {
    if (videoRef.current && !isInitialized && !isLoading) {
      const video = videoRef.current

      // Set initial duration
      if (video.readyState >= 1) {
        setDuration(video.duration)
      }

      // Set video to last position
      if (lastPosition > 0) {
        video.currentTime = lastPosition
        setCurrentTime(lastPosition)
      }

      setIsInitialized(true)
    }
  }, [videoRef, isInitialized, isLoading, lastPosition])

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => {
      setIsPlaying(true)
      startTracking(video.currentTime)
    }

    const onPause = () => {
      setIsPlaying(false)
      stopTracking()
    }

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      if (isPlaying) {
        updateTracking(video.currentTime)
      }
    }

    const onSeeking = () => {
      handleSeek(video.currentTime)
    }

    const onLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const onEnded = () => {
      setIsPlaying(false)
      stopTracking()
    }

    // Add event listeners
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("seeking", onSeeking)
    video.addEventListener("loadedmetadata", onLoadedMetadata)
    video.addEventListener("ended", onEnded)

    // Clean up
    return () => {
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("seeking", onSeeking)
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.removeEventListener("ended", onEnded)
    }
  }, [isPlaying, startTracking, updateTracking, stopTracking, handleSeek])

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  // Handle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  // Handle seeking
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const newTime = clickPosition * duration

    video.currentTime = newTime
  }

  // Skip forward/backward
  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading video...</div>
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      <div className="relative bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full aspect-video" src={videoUrl} playsInline />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress indicator */}
          <div className="mb-2">
            <div className="relative h-2 bg-gray-700 rounded cursor-pointer" onClick={handleProgressBarClick}>
              <div
                className="absolute top-0 left-0 h-full bg-gray-500 rounded"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div className="absolute top-0 left-0 h-full bg-green-500 rounded" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="text-white hover:bg-white/20">
                <SkipBack size={20} />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => skip(10)} className="text-white hover:bg-white/20">
                <SkipForward size={20} />
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-white text-sm font-medium">Progress: {progress.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Overall Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}
