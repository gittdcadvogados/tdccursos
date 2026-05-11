import Image from "next/image";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  postLessonComment,
  deleteLessonComment,
} from "@/app/(player)/aula/actions";

export type CommentItem = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  parent_id: string | null;
  profiles: {
    full_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
};

type Props = {
  lessonId: string;
  lessonSlug: string;
  comments: CommentItem[];
  currentUserId: string;
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getDisplayName(p: CommentItem["profiles"]): string {
  return (
    p?.display_name?.trim() || p?.full_name?.trim() || "Aluno"
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function LessonComments({
  lessonId,
  lessonSlug,
  comments,
  currentUserId,
}: Props) {
  const total = comments.length;

  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="tech-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
          <MessageSquare className="h-3.5 w-3.5" />
          ▸ COMENTARIOS
        </h2>
        <span className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
          {total.toString().padStart(2, "0")} {total === 1 ? "mensagem" : "mensagens"}
        </span>
      </div>

      {/* Novo comentário */}
      <form action={postLessonComment} className="space-y-2">
        <input type="hidden" name="lesson_id" value={lessonId} />
        <input type="hidden" name="lesson_slug" value={lessonSlug} />
        <textarea
          name="body"
          rows={3}
          required
          maxLength={4000}
          placeholder="Compartilhe uma dúvida ou contribuição com a turma..."
          className="block w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <div className="flex items-center justify-end">
          <Button type="submit" size="sm">
            Publicar
          </Button>
        </div>
      </form>

      {/* Lista */}
      {total === 0 ? (
        <p className="mt-6 text-sm text-foreground-muted">
          Nenhum comentário ainda. Seja o primeiro a comentar.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {comments.map((c) => {
            const name = getDisplayName(c.profiles);
            const initials = getInitials(name);
            const isAuthor = c.user_id === currentUserId;
            const isInstructor = c.profiles?.role === "admin";

            return (
              <li
                key={c.id}
                className="flex gap-3 rounded-lg border border-border bg-background p-3 md:p-4"
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {c.profiles?.avatar_url ? (
                    <Image
                      src={c.profiles.avatar_url}
                      alt={name}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                    />
                  ) : (
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-soft-fg ring-1 ring-border"
                      aria-hidden
                    >
                      {initials}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{name}</span>
                    {isInstructor && (
                      <span className="tech-mono rounded-md border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent-soft-fg">
                        Instrutor
                      </span>
                    )}
                    <span className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
                      {formatTime(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                    {c.body}
                  </p>
                </div>

                {isAuthor && (
                  <form action={deleteLessonComment} className="shrink-0">
                    <input type="hidden" name="comment_id" value={c.id} />
                    <input type="hidden" name="lesson_slug" value={lessonSlug} />
                    <button
                      type="submit"
                      title="Apagar"
                      className="grid h-7 w-7 place-items-center rounded-md text-foreground-muted transition hover:bg-surface-muted hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
