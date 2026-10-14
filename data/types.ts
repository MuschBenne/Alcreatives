export type MediaKind = "image" | "fileVideo";

export type Media = {
  kind: MediaKind;
  /** A path under /public/media. */
  src: string;
  poster?: string;
  alt: string;
  /** CSS aspect-ratio string, e.g. "16/9". Prevents layout shift before load. */
  ratio?: string;
  /**
   * For a cover loop cut from one of the case's own gallery films: that film's
   * src. The case page then leaves the cover out, so the same film does not
   * play twice. The grid still uses the loop.
   */
  clipOf?: string;
};

export type Category = "Automotive" | "Product" | "Commercial";

export type Project = {
  slug: string;
  title: string;
  /** Left out when the work isn't credited to anyone, like the product reel. */
  client?: string;
  category: Category;
  cover: Media;
  gallery: Media[];
  /**
   * What the job was, in a few words — "Retail campaign stills", not a mood
   * piece. Alvin's call: the pictures carry the feeling, the text states the
   * facts. Shown next to the client on the case study page.
   */
  summary: string;
  featured?: boolean;
};

export type Client = {
  name: string;
  /**
   * PNG under /public/media/clients, with its pixel size so the marquee can
   * size every logo by its proportions before the file loads. Falls back to a
   * wordmark if missing.
   */
  logo?: { src: string; width: number; height: number };
};
