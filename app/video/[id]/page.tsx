import { VideoPlayer } from "@/components/video-player"
import type { VideoMetadata } from "@/lib/types"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Mock data - in a real app, this would come from a database
const mockVideos: Record<string, VideoMetadata & { videoUrl: string }> = {
  "video-1": {
    id: "video-1",
    title: "Introduction to React",
    duration: 600,
    thumbnailUrl: "/placeholder.svg?height=360&width=640",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  "video-2": {
    id: "video-2",
    title: "Advanced JavaScript Concepts",
    duration: 900,
    thumbnailUrl: "/placeholder.svg?height=360&width=640",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  "video-3": {
    id: "video-3",
    title: "Building with Next.js",
    duration: 1200,
    thumbnailUrl: "/placeholder.svg?height=360&width=640",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
}

// Mock user ID - in a real app, this would come from authentication
const mockUserId = "user-123"

interface VideoPageProps {
  params: {
    id: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const videoId = params.id
  const video = mockVideos[videoId]

  if (!video) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Video not found</h1>
        <Link href="/" className="text-blue-500 hover:underline flex items-center gap-1">
          <ArrowLeft size={16} />
          Back to videos
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/" className="text-blue-500 hover:underline flex items-center gap-1 mb-4">
        <ArrowLeft size={16} />
        Back to videos
      </Link>

      <VideoPlayer userId={mockUserId} videoId={video.id} videoUrl={video.videoUrl} title={video.title} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">About this video</h2>
        <p className="text-gray-700">
          This is a sample video for the Video Progress Tracker application. The system tracks your unique viewing
          progress, ensuring that only newly watched segments contribute to your overall progress.
        </p>
      </div>
    </div>
  )
}
