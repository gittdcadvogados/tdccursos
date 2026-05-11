"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_AVATAR_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

function clean(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

function extFromMime(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = clean(formData.get("full_name"));
  const display_name = clean(formData.get("display_name")) || null;
  const phone = clean(formData.get("phone")) || null;
  const occupation = clean(formData.get("occupation")) || null;
  const bio = clean(formData.get("bio")) || null;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, display_name, phone, occupation, bio })
    .eq("id", user.id);

  if (error) {
    redirect(`/perfil?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  redirect("/perfil?message=Perfil+atualizado+com+sucesso");
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const current = clean(formData.get("current_password"));
  const next = clean(formData.get("new_password"));
  const confirm = clean(formData.get("confirm_password"));

  if (next.length < 8) {
    redirect("/perfil?tab=senha&error=A+senha+deve+ter+pelo+menos+8+caracteres");
  }
  if (next !== confirm) {
    redirect("/perfil?tab=senha&error=As+senhas+n%C3%A3o+conferem");
  }

  // Re-autentica com a senha atual antes de trocar
  if (user.email) {
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInErr) {
      redirect(`/perfil?tab=senha&error=${encodeURIComponent("Senha atual incorreta")}`);
    }
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    redirect(`/perfil?tab=senha&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/perfil?tab=senha&message=Senha+alterada+com+sucesso");
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/perfil?error=Nenhum+arquivo+enviado");
  }

  if (!ALLOWED_AVATAR_MIME.has(file.type)) {
    redirect(
      "/perfil?error=" +
        encodeURIComponent("Formato inválido — use JPG, PNG, WEBP ou GIF"),
    );
  }
  if (file.size > MAX_AVATAR_BYTES) {
    redirect("/perfil?error=" + encodeURIComponent("Imagem maior que 5MB"));
  }

  const ext = extFromMime(file.type);
  const path = `${user.id}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
      cacheControl: "3600",
    });

  if (uploadError) {
    redirect(`/perfil?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    redirect(`/perfil?error=${encodeURIComponent(updateError.message)}`);
  }

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  redirect("/perfil?message=Foto+atualizada");
}

export async function removeAvatar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Lista e apaga tudo na pasta {user_id}/ do bucket avatars
  const { data: files } = await supabase.storage
    .from("avatars")
    .list(user.id, { limit: 100 });

  if (files && files.length > 0) {
    const paths = files.map((f) => `${user.id}/${f.name}`);
    await supabase.storage.from("avatars").remove(paths);
  }

  await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id);

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  redirect("/perfil?message=Foto+removida");
}
