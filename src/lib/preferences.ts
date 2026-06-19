import { supabase } from "@/integrations/supabase/client";

export interface UserPreferences {
  weeklyGoal: number;
  lastCategory: string | null;
  tutorialSeen: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  weeklyGoal: 3,
  lastCategory: null,
  tutorialSeen: false,
};

async function getUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getPreferences(): Promise<UserPreferences> {
  const uid = await getUserId();
  if (!uid) return DEFAULT_PREFERENCES;
  const { data, error } = await supabase
    .from("user_preferences")
    .select("weekly_goal, last_category, tutorial_seen")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) {
    console.error("getPreferences error:", error);
    return DEFAULT_PREFERENCES;
  }
  if (!data) return DEFAULT_PREFERENCES;
  return {
    weeklyGoal: data.weekly_goal ?? DEFAULT_PREFERENCES.weeklyGoal,
    lastCategory: data.last_category,
    tutorialSeen: data.tutorial_seen,
  };
}

async function upsertPreferences(patch: Partial<{ weekly_goal: number; last_category: string | null; tutorial_seen: boolean }>) {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: uid, ...patch }, { onConflict: "user_id" });
  if (error) console.error("upsertPreferences error:", error);
}

export async function setWeeklyGoalPref(goal: number): Promise<void> {
  await upsertPreferences({ weekly_goal: Math.max(1, Math.min(50, Math.round(goal))) });
}

export async function setLastCategoryPref(category: string): Promise<void> {
  await upsertPreferences({ last_category: category });
}

export async function setTutorialSeenPref(seen: boolean = true): Promise<void> {
  await upsertPreferences({ tutorial_seen: seen });
}
