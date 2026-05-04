export function AnnouncementBar() {
  const text = process.env.NEXT_PUBLIC_ANNOUNCEMENT_TEXT;

  if (!text) return null;

  return (
    <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white">
      {text}
    </div>
  );
}
