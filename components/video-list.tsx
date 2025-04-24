"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import type { VideoMetadata } from "@/lib/types"
import { getProgress } from "@/app/actions/progress-actions"
import { Progress } from "@/components/ui/progress"

interface VideoListProps {
  videos: VideoMetadata[]
  userId: string
}

export function VideoList({ videos, userId }: VideoListProps) {
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAllProgress() {
      try {
        const progressPromises = videos.map((video) =>
          getProgress(userId, video.id).then((progress) => ({
            videoId: video.id,
            progress: progress?.totalProgress || 0,
          })),
        )

        const results = await Promise.all(progressPromises)

        const progressMap: Record<string, number> = {}
        results.forEach((result) => {
          progressMap[result.videoId] = result.progress
        })

        setVideoProgress(progressMap)
      } catch (error) {
        console.error("Failed to load progress data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAllProgress()
  }, [videos, userId])

  if (isLoading) {
    return <div className="p-4">Loading videos...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Link key={video.id} href={`/video/${video.id}`} className="group block">
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={video.title}
              width={640}
              height={360}
              className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="font-medium">{video.title}</h3>
            <div className="mt-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{videoProgress[video.id]?.toFixed(1) || 0}%</span>
              </div>
              <Progress value={videoProgress[video.id] || 0} className="h-1.5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
