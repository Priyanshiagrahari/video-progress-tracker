// Types for our application
export interface WatchedInterval {
  start: number
  end: number
}

export interface VideoProgress {
  userId: string
  videoId: string
  watchedIntervals: WatchedInterval[]
  lastPosition: number
  totalProgress: number // Percentage of unique content watched
}

export interface VideoMetadata {
  id: string
  title: string
  duration: number // in seconds
  thumbnailUrl: string
}
