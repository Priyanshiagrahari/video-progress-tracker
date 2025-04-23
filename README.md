# Video Progress Tracker

A sophisticated video progress tracking system that accurately measures unique viewing progress for educational videos.

## Features

- **Unique Progress Tracking**: Only counts segments that haven't been watched before
- **Prevent Skipping**: Fast-forwarding doesn't count as progress
- **Persistent Progress**: Saves viewing history and resumes from last position
- **Visual Progress Indicator**: Shows percentage of unique content watched

## How It Works

### Interval Tracking

The system tracks video watching using intervals (start and end times). When a user watches a video:

1. We record the start time when playback begins
2. We continuously update the end time as the video plays
3. When playback pauses or the user seeks to a new position, we finalize the interval

### Merging Intervals

To ensure we only count unique segments, we merge overlapping intervals:

1. Sort all intervals by start time
2. Iterate through the sorted intervals
3. If the current interval overlaps with the next one, merge them
4. Otherwise, add the current interval to the result and move to the next

For example:
- User watches 0-20 seconds
- User watches 15-30 seconds
- After merging: [0-30] (not [0-20, 15-30])

### Progress Calculation

Progress is calculated as the percentage of unique content watched:

\`\`\`
progress = (total unique seconds watched / video duration) * 100
\`\`\`

### Data Persistence

The system saves:
- List of watched intervals
- Last playback position
- Overall progress percentage

This allows for seamless resumption of playback and accurate progress tracking across sessions.

## Technical Implementation

- **Frontend**: Next.js with React
- **State Management**: React hooks and context
- **Data Persistence**: Server actions (would connect to a database in production)
- **Video Player**: Custom implementation with event listeners for accurate tracking

## Challenges and Solutions

### Challenge: Accurate Interval Tracking

**Solution**: Implemented a robust interval merging algorithm that handles all edge cases including overlapping segments, seeking, and playback rate changes.

### Challenge: Performance with Many Intervals

**Solution**: Optimized the interval merging algorithm to efficiently handle many intervals without performance degradation.

### Challenge: Seamless User Experience

**Solution**: Implemented background saving to persist progress without interrupting the user experience.

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Future Improvements

- Add authentication for multi-user support
- Implement analytics to track user engagement patterns
- Add support for different video sources and formats
- Implement offline support with local storage fallback
