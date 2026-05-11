// Player do Bunny Stream. Recebe URL já assinada via signEmbedUrl()
// para que o token de autenticação fique no servidor.
type Props = {
  src: string;
  title?: string;
};

export function BunnyPlayer({ src, title }: Props) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
      <iframe
        src={src}
        title={title ?? "Aula"}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
