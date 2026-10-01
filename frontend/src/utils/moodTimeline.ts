import type { SelectedMood } from "@/api/types";

export interface MoodTimelineDay {
  date: Date;
  mood: SelectedMood | undefined;
  isToday: boolean;
}

interface MoodEntry {
  mood: SelectedMood | undefined;
  created_at: string;
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getMoodTimeline = (
  moods: MoodEntry[],
  numDays: number,
  startedAt: string
): MoodTimelineDay[] => {
  const today = startOfDay(new Date());
  const firstDay = startOfDay(new Date(startedAt));

  const latestMoodByDay = new Map<number, MoodEntry>();
  for (const mood of moods) {
    const createdAt = new Date(mood.created_at);
    const dayKey = startOfDay(createdAt).getTime();
    const existing = latestMoodByDay.get(dayKey);
    if (!existing || new Date(existing.created_at) < createdAt) {
      latestMoodByDay.set(dayKey, mood);
    }
  }

  const timeline: MoodTimelineDay[] = [];
  for (let daysAgo = 0; daysAgo < numDays; daysAgo++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
    if (date < firstDay) {
      break;
    }
    timeline.push({
      date,
      mood: latestMoodByDay.get(date.getTime())?.mood,
      isToday: daysAgo === 0,
    });
  }
  return timeline;
};
