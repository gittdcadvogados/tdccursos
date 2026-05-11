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

// =========================
// Anotações pessoais
// =========================
export async function saveLessonNote(formData: FormData) {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const lessonSlug = String(formData.get("lesson_slug") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 20000);

  if (!lessonId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("lesson_notes").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      body,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (lessonSlug) revalidatePath(`/aula/${lessonSlug}`);
}

// =========================
// Comentários (fórum)
// =========================
export async function postLessonComment(formData: FormData) {
  const lessonId = String(formData.get("lesson_id") ?? "");
  const lessonSlug = String(formData.get("lesson_slug") ?? "");
  const parentIdRaw = String(formData.get("parent_id") ?? "");
  const parentId = parentIdRaw.trim() || null;
  const body = String(formData.get("body") ?? "").trim().slice(0, 4000);

  if (!lessonId || !body) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("lesson_comments").insert({
    lesson_id: lessonId,
    user_id: user.id,
    parent_id: parentId,
    body,
  });

  if (lessonSlug) revalidatePath(`/aula/${lessonSlug}`);
}

export async function deleteLessonComment(formData: FormData) {
  const commentId = String(formData.get("comment_id") ?? "");
  const lessonSlug = String(formData.get("lesson_slug") ?? "");

  if (!commentId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // RLS já garante que só o autor consegue deletar
  await supabase.from("lesson_comments").delete().eq("id", commentId);

  if (lessonSlug) revalidatePath(`/aula/${lessonSlug}`);
}
