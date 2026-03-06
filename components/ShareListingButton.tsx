"use client";

export default function ShareListingButton({ slug }: { slug: string }) {
  const handleShare = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/listings/${slug}` : "";
    if (navigator.share && url) {
      navigator.share({
        title: "Property Listing",
        url,
      }).catch(() => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
      });
    } else if (url) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-bold transition-colors hover:bg-[var(--surface-muted)]"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share
    </button>
  );
}
