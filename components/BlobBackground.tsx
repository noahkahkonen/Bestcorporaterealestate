"use client";

/**
 * Organic mesh gradient / fluid blob animation.
 * Pure CSS implementation - multiple blurred gradient orbs that slowly morph.
 * Inspired by Green Street and similar fluid shader backgrounds.
 */
export default function BlobBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13, 148, 136, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(20, 184, 166, 0.15), transparent), radial-gradient(ellipse 50% 60% at 0% 80%, rgba(6, 95, 70, 0.2), transparent)",
        }}
      />
      {/* Animated blob orbs */}
      <div className="absolute inset-0">
        <div
          className="blob-orb blob-orb-1"
          style={{
            background:
              "radial-gradient(circle at center, rgba(13, 148, 136, 0.4) 0%, rgba(6, 95, 70, 0.2) 40%, transparent 70%)",
          }}
        />
        <div
          className="blob-orb blob-orb-2"
          style={{
            background:
              "radial-gradient(circle at center, rgba(20, 184, 166, 0.35) 0%, rgba(13, 148, 136, 0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="blob-orb blob-orb-3"
          style={{
            background:
              "radial-gradient(circle at center, rgba(6, 95, 70, 0.3) 0%, rgba(2, 44, 34, 0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="blob-orb blob-orb-4"
          style={{
            background:
              "radial-gradient(circle at center, rgba(45, 212, 191, 0.25) 0%, transparent 60%)",
          }}
        />
        <div
          className="blob-orb blob-orb-5"
          style={{
            background:
              "radial-gradient(circle at center, rgba(13, 148, 136, 0.2) 0%, transparent 55%)",
          }}
        />
      </div>
    </div>
  );
}
