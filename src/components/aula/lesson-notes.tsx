import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveLessonNote } from "@/app/(player)/aula/actions";

type Props = {
  lessonId: string;
  lessonSlug: string;
  initialBody: string;
  updatedAt: string | null;
};

function formatUpdated(iso: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

export function LessonNotes({
  lessonId,
  lessonSlug,
  initialBody,
  updatedAt,
}: Props) {
  const updatedLabel = formatUpdated(updatedAt);

  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="tech-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
          <NotebookPen className="h-3.5 w-3.5" />
          ▸ ANOTACOES_IMPORTANTES
        </h2>
        {updatedLabel && (
          <span className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
            salvo · {updatedLabel}
          </span>
        )}
      </div>
      <p className="mb-3 text-xs text-foreground-muted">
        Suas anotações privadas desta aula. Só você vê.
      </p>

      <form action={saveLessonNote} className="space-y-3">
        <input type="hidden" name="lesson_id" value={lessonId} />
        <input type="hidden" name="lesson_slug" value={lessonSlug} />
        <textarea
          name="body"
          rows={6}
          defaultValue={initialBody}
          placeholder="Anote pontos-chave, dúvidas, referências legais, casos do escritório que se aplicam..."
          maxLength={20000}
          className="block w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <div className="flex items-center justify-end">
          <Button type="submit" size="sm">
            Salvar anotação
          </Button>
        </div>
      </form>
    </section>
  );
}
