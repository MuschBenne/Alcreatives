"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Media } from "@/data/types";
import { mediaUrl, MEDIA_SUPPORTS_RANGE } from "@/lib/media";
import { AssetPlaceholder } from "./AssetPlaceholder";

/** Tiny dark tile used as the blur-up placeholder for every still. */
const BLUR_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10"><rect width="8" height="10" fill="#141414"/></svg>',
)}`;

type MediaFrameProps = {
  media: Media;
  /** Responsive sizes hint for next/image. Always pass a real one. */
  sizes?: string;
  priority?: boolean;
  /** Video starts on hover/focus instead of on load. Used for work covers. */
  hoverPlay?: boolean;
  /** Slow zoom on hover of the closest .group ancestor. */
  zoomOnHover?: boolean;
  className?: string;
  /** Overrides media.ratio. Pass null to fill the parent instead. */
  ratio?: string | null;
};

export function MediaFrame({
  media,
  sizes = "100vw",
  priority = false,
  hoverPlay = false,
  zoomOnHover = false,
  className = "",
  ratio,
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  // Autoplaying videos only run while they are on screen. A case study can hold
  // four vertical films at once; without this they would all fetch and decode
  // together on load.
  const autoPlays = media.kind === "fileVideo" && !hoverPlay && !reduceMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!autoPlays || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay can be refused; the poster simply stays up */
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlays]);

  const aspectRatio = ratio === null ? undefined : (ratio ?? media.ratio ?? "3/2");

  const zoomClass = zoomOnHover
    ? "transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
    : "";

  const handleEnter = useCallback(() => {
    if (!hoverPlay || reduceMotion) return;
    videoRef.current?.play().catch(() => {
      /* autoplay can be refused; the poster simply stays up */
    });
  }, [hoverPlay, reduceMotion]);

  const handleLeave = useCallback(() => {
    if (!hoverPlay) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    // Rewind only once there is something to rewind — without preloaded
    // metadata a cover sits at HAVE_NOTHING until the first hover — and rewind
    // to where the clip actually begins rather than assuming zero. A trimmed
    // clip can start a frame late, and seeking outside the seekable range
    // errors, which used to swap the cover for the "awaiting asset" placeholder.
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    video.currentTime = video.seekable.length > 0 ? video.seekable.start(0) : 0;
  }, [hoverPlay]);

  const showPlaceholder = failed;

  return (
    <div
      className={`relative isolate overflow-hidden bg-surface ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {/* Always the base layer: it ships in the server HTML, so a missing asset
          never flashes an empty box and the site reads as finished without JS.
          Real media paints straight over it. */}
      {/* z-0 rather than a bare `absolute`: it makes this a stacking context so
          the placeholder's own z-10 labels stay inside it. Without it they paint
          over the real media, which is a later sibling at z-auto. */}
      <div aria-hidden={!showPlaceholder} className="absolute inset-0 z-0">
        <AssetPlaceholder
          path={media.src}
          alt={media.alt}
          kind={media.kind === "image" ? "image" : "video"}
        />
      </div>

      {showPlaceholder ? null : media.kind === "image" ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onError={() => setFailed(true)}
          className={`object-cover ${zoomClass}`}
        />
      ) : media.kind === "fileVideo" ? (
        <video
          ref={videoRef}
          // src is set directly (not via <source>) so a missing file reliably
          // fires onError and we can swap in the placeholder.
          // Stills go through next/image, which prefixes the origin in its
          // loader; a plain <video> has no such hook, so it does it here.
          src={mediaUrl(media.src)}
          poster={mediaUrl(media.poster)}
          muted
          loop
          playsInline
          // Media on R2 answers Range requests, so a browser can fetch just
          // the header: "metadata" fills in duration and seekable without
          // pulling the file, and the hero is worth having ready. Served from
          // the Worker's own assets a range comes back as the whole file, and a
          // case study with four films would pull tens of MB on load — hence
          // the fallback. The observer above starts playback near the viewport
          // and the poster covers the gap either way.
          // `autoPlays` and not `priority` alone: priority is an image idea,
          // meaning "this is above the fold". A work cover is given it for its
          // poster's sake but only plays on hover, and "auto" fetches the whole
          // file. That shipped 2.4 MB of MP4 on a category page for a video
          // nobody had asked to play.
          preload={MEDIA_SUPPORTS_RANGE ? (priority && autoPlays ? "auto" : "metadata") : "none"}
          // The hero is the one video worth loading eagerly.
          autoPlay={autoPlays && priority}
          aria-label={media.alt}
          // A file that is genuinely missing never gets past HAVE_NOTHING.
          // An error raised after that is a transient abort or decode hiccup on
          // media that did load, and showing the placeholder there hides a
          // video the reader was watching a moment ago.
          onError={(event) => {
            if (event.currentTarget.readyState === HTMLMediaElement.HAVE_NOTHING) {
              setFailed(true);
            }
          }}
          // absolute, not in-flow: the placeholder behind it is positioned, and
          // positioned elements always paint over non-positioned ones no matter
          // the DOM order. Left static, the placeholder covers every video.
          // next/image already does this for stills via `fill`.
          className={`absolute inset-0 h-full w-full object-cover ${zoomClass}`}
        />
      ) : null}
    </div>
  );
}
