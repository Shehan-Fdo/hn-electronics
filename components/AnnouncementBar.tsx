export function AnnouncementBar({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white">
      {text}
    </div>
  );
}
