import { VideoList } from "@/components/video-list"
import type { VideoMetadata } from "@/lib/types"

// Mock data - in a real app, this would come from a database
const mockVideos: VideoMetadata[] = [
  {
    id: "video-1",
    title: "Introduction to React",
    duration: 600, // 10 minutes
    thumbnailUrl: "/placeholder.svg?height=360&width=640",
  },
  {
    id: "video-2",
    title: "Advanced JavaScript Concepts",
    duration: 900, // 15 minutes
    thumbnailUrl: "/placeholder.svg?height=360&width=640",
  },
  {
    id: "video-3",
    title: "Building with Next.js",
    duration: 1200, // 20 minutes
    thumbnailUrl: "/placeholder.svg?height=360&width=640",
  },
]

// Mock user ID - in a real app, this would come from authentication
const mockUserId = "user-123"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Video Lectures</h1>
      <VideoList videos={mockVideos} userId={mockUserId} />
    </main>
  )
}
