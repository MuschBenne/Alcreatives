import type { Media } from "./types";

/**
 * Behind the scenes: phone frames from set, all black and white.
 *
 * Files come from scripts/ingest-media.mjs — add originals to the BTS block in
 * scripts/media-manifest.mjs and they appear here once you add the entry below.
 */
export const behindTheScenes: Media[] = [
  {
    kind: "image",
    src: "/media/bts/01.jpg",
    alt: "Estate car parked at the edge of a field, camera waiting on a tripod in the foreground",
    ratio: "2/3",
  },
  {
    kind: "image",
    src: "/media/bts/02.jpg",
    alt: "Classic Porsche 911 on a country road, shot lined up from the verge",
    ratio: "2/3",
  },
  {
    kind: "image",
    src: "/media/bts/03.jpg",
    alt: "Porsche GT3 RS on a forest road with the camera rig set down in the grass",
    ratio: "2/3",
  },
  {
    kind: "image",
    src: "/media/bts/04.jpg",
    alt: "Sports car on a gravel drive beside a house, tripod framed on it",
    ratio: "2/3",
  },
  {
    kind: "image",
    src: "/media/bts/05.jpg",
    alt: "Camera body, lenses and lighting cases laid out on a deck under spruce branches",
    ratio: "2/3",
  },
  {
    kind: "image",
    src: "/media/bts/06.jpg",
    alt: "Interview setup seen through a doorway, subject seated at a kitchen table",
    ratio: "2/3",
  },
  {
    kind: "image",
    src: "/media/bts/07.jpg",
    alt: "Night shoot on a deck, monitor glowing on the tripod",
    ratio: "2/3",
  },
  {
    kind: "image",
    src: "/media/bts/08.jpg",
    alt: "Camera mounted low against a tree trunk, hand steadying the head",
    ratio: "2/3",
  },
];
