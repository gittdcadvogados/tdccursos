"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markLessonCompleted(formData: FormData) {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const lessonSlug = String(formData.get("lesson_slug") ?? "");

  if (!lessonId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (lessonSlug) revalidatePath(`/aula/${lessonSlug}`);
  revalidatePath("/dashboard");
}
