"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAvatar, removeAvatar } from "@/app/(app)/perfil/actions";

interface AvatarUploadProps {
  currentUrl?: string | null;
  fallbackInitials: string;
  isOAuth: boolean;
}

const MAX_BYTES = 5 * 1024 * 1024;

export function AvatarUpload({
  currentUrl,
  fallbackInitials,
  isOAuth,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setErrorMsg(null);
    if (!file) {
      setPreview(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrorMsg("Imagem maior que 5MB. Comprima e tente novamente.");
      e.target.value = "";
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inputRef.current?.files?.[0]) {
      setErrorMsg("Escolha uma imagem antes de enviar.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    startTransition(() => {
      void uploadAvatar(fd);
    });
  }

  const showImage = preview ?? currentUrl ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative">
          {showImage ? (
            <Image
              src={showImage}
              alt="Avatar"
              width={96}
              height={96}
              unoptimized
              className="h-24 w-24 rounded-2xl border-4 border-surface object-cover shadow-sm ring-1 ring-border"
            />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-surface bg-accent-soft text-2xl font-semibold tracking-tight text-accent-soft-fg ring-1 ring-border">
              {fallbackInitials}
            </div>
          )}
          {preview && (
            <span className="tech-mono absolute -bottom-1 -right-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
              PREVIEW
            </span>
          )}
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex-1 space-y-3"
          encType="multipart/form-data"
        >
          <div className="rounded-md border border-dashed border-border bg-surface-muted p-4">
            <p className="tech-mono text-[11px] uppercase tracking-wider text-foreground-muted">
              ▸ UPLOAD_DE_AVATAR
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              JPG, PNG, WEBP ou GIF · até 5MB · recomendado 256×256
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                name="avatar"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onPick}
                className="hidden"
                id="avatar-input"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlus />
                Escolher imagem
              </Button>
              {preview && (
                <Button type="submit" size="sm" disabled={pending}>
                  <Upload />
                  {pending ? "Enviando..." : "Enviar foto"}
                </Button>
              )}
              {currentUrl && !preview && (
                <RemoveAvatarButton />
              )}
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
          )}

          {isOAuth && currentUrl && !preview && (
            <p className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
              ▸ foto_atual_do_google · sera_substituida_no_upload
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function RemoveAvatarButton() {
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={() =>
        startTransition(() => {
          void removeAvatar();
        })
      }
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={pending}
        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
      >
        <Trash2 />
        {pending ? "Removendo..." : "Remover"}
      </Button>
    </form>
  );
}
