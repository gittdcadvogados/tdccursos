type Props = {
  libraryId: string;
  videoGuid: string;
  title?: string;
};

export function BunnyPlayer({ libraryId, videoGuid, title }: Props) {
  const src = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoGuid}?autoplay=false&preload=true`;
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
