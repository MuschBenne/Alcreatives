import type { Category, Project } from "./types";

/**
 * The real work, wired to the files that scripts/ingest-media.mjs produces.
 *
 * Every `ratio` here matches the crop in scripts/media-manifest.mjs — change
 * one and change the other, or the frame will letterbox.
 *
 * Titles and summaries below were drafted from the images themselves and kept
 * as they stand. Worth a read for anything that misnames a client or a shoot:
 * ASSETS-NEEDED.md lists the strings under "Copy" if you ever want to rewrite.
 *
 * No year, and the field is gone rather than empty: a year dates the work more
 * than it places it. It was left optional for a while in case it came back; it
 * did not, and an unused field with four dead render branches behind it is
 * worse than a decision. Bringing it back is a field and four branches.
 */
export const projects: Project[] = [
  {
    slug: "hyrox-creators-cup",
    // Retitled on Alvin's call, and the split is the point: what the work shows
    // is HYROX and Stan Browney, while who commissioned it was Ludwig Blomqvist
    // and Celsius. The slug stays as it was — that address is live and possibly
    // indexed, and it still describes the case.
    title: "HYROX & Stan Browney",
    client: "Ludwig Blomqvist & Celsius",
    category: "Commercial",
    featured: true,
    cover: {
      kind: "image",
      src: "/media/projects/hyrox-creators-cup/cover.jpg",
      alt: "HYROX rig under a netted frame outside the venue, sponsor boards behind",
      ratio: "4/5",
    },
    // Film first, as on the other cases that have one: it moves in the grid and
    // it is the reason to stop. This one came over from the Ludwig case, where
    // it had been filed as a brand film — it was shot across this weekend and
    // delivered in a HYROX subfolder, so it belongs here.
    gallery: [
      {
        kind: "fileVideo",
        src: "/media/projects/hyrox-creators-cup/film-01.mp4",
        poster: "/media/projects/hyrox-creators-cup/film-01-poster.jpg",
        alt: "Celsius film shot across the HYROX weekend",
        ratio: "9/16",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/01.jpg",
        alt: "Athlete in a teal jacket outside the venue, shot from below against the facade",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/02.jpg",
        alt: "A drink can standing in the marked competition lanes before the heats start",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/03.jpg",
        alt: "Black and white frame of a competitor with arms raised under the glass roof",
        ratio: "3/2",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/04.jpg",
        alt: "Competitors talking between heats beneath the vaulted ceiling",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/05.jpg",
        alt: "Two athletes standing together after finishing",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/06.jpg",
        alt: "Athletes walking off the floor through the crowd",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/07.jpg",
        alt: "Two competitors in front of the finish-time board reading 1:06:49",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/08.jpg",
        alt: "The empty arena and its iron and glass roof before the doors open",
        ratio: "3/2",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/09.jpg",
        alt: "Interview setup with two seated subjects and a camera on a tripod",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hyrox-creators-cup/10.jpg",
        alt: "The competition floor seen from the balcony, athletes gathered at the start",
        ratio: "2/3",
      },
    ],
    summary: "Event coverage, stills and film",
  },

  {
    slug: "hedin-ineos-grenadier",
    title: "INEOS Grenadier Off-Road Days",
    client: "Hedin Automotive",
    category: "Automotive",
    featured: true,
    cover: {
      kind: "image",
      src: "/media/projects/hedin-ineos-grenadier/cover.jpg",
      alt: "Front grille and round headlights of a blue INEOS Grenadier",
      ratio: "4/5",
    },
    // The red Grenadier at sunset leads, on Alvin's call; the off-road day
    // follows. Files 09–16 are the newer shoot — order lives here, not on disk.
    gallery: [
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/09.jpg",
        alt: "Red Grenadier on a farm track through long grass at sunset",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/10.jpg",
        alt: "Tan leather steering wheel of the red Grenadier in low light",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/11.jpg",
        alt: "Front of the red Grenadier low in the grass, headlights catching the sun",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/12.jpg",
        alt: "Wing mirror and flank of the Grenadier with the field behind",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/13.jpg",
        alt: "Red Grenadier parked on a twin-track beside the fields in evening light",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/14.jpg",
        alt: "The steering wheel and its stitching seen from the driver's seat",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/15.jpg",
        alt: "The Grenadier driving away down a grass-centred track",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/16.jpg",
        alt: "INEOS badge beside the spare wheel in warm light",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/01.jpg",
        alt: "Blue INEOS Grenadier parked on a rutted dirt track",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/02.jpg",
        alt: "Open tailgate with INEOS crates and a camp chair beside the vehicle",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/03.jpg",
        alt: "Grenadier working its way along a track through open farmland",
        ratio: "3/2",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/04.jpg",
        alt: "Sand-coloured Grenadier with its door open, decal reading Part of the Team",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/05.jpg",
        alt: "The vehicle in the field seen past a dark A-pillar from inside a second car",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/06.jpg",
        alt: "Visitors at the INEOS Grenadier stand at the test-drive event",
        ratio: "3/2",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/07.jpg",
        alt: "Two Grenadiers on the grass, framed through a windscreen",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-ineos-grenadier/08.jpg",
        alt: "Grenadier on the horizon seen past the body of a parked vehicle",
        ratio: "2/3",
      },
    ],
    summary: "Off-road event and vehicle stills",
  },

  {
    // One shoot, two clients, and until now one case carrying both. Alvin asked
    // for them apart: Hedin keeps the black 120 it ran the retail campaign on,
    // BMW Sverige keeps the red M2 below.
    //
    // The slug stays as it was. It is still true — Hedin Automotive, BMW 120 —
    // and the address is live and may be indexed, so keeping it beats redirecting
    // it somewhere else and hoping.
    slug: "hedin-bmw-120",
    title: "BMW 120",
    client: "Hedin Automotive",
    category: "Automotive",
    featured: true,
    cover: {
      kind: "fileVideo",
      src: "/media/projects/hedin-bmw-120/cover.mp4",
      poster: "/media/projects/hedin-bmw-120/cover-poster.jpg",
      alt: "The 120 pulling away down a winter forest road",
      ratio: "4/5",
    },
    // Film first: it is the newest work on this case and the reason to stop.
    //
    // The stills are Alvin's September re-edit. Every one of the five that had
    // campaign copy burned across it is gone, along with the X5 and the showroom
    // interior, which were campaign furniture rather than pictures of this car.
    gallery: [
      {
        kind: "fileVideo",
        src: "/media/projects/hedin-bmw-120/film-01.mp4",
        poster: "/media/projects/hedin-bmw-120/film-01-poster.jpg",
        alt: "Showroom film, the car framed through the window with the offer on screen",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/hedin-bmw-120/film-02.mp4",
        poster: "/media/projects/hedin-bmw-120/film-02-poster.jpg",
        alt: "Winter service film, the car on a forest road with the offer on screen",
        ratio: "9/16",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/01.jpg",
        alt: "Black BMW 120 on a rooftop deck against a copper-clad facade",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/02.jpg",
        alt: "The 120 on a cobbled street between an orange facade and a church tower",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/03.jpg",
        alt: "The 120 along a striped brick facade with a copper dome behind",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/04.jpg",
        alt: "The 120 seen through a gate, down a cobbled alley",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/05.jpg",
        alt: "The 120 head-on at speed on a snowy forest road",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/06.jpg",
        alt: "The 120 from above on the ramp of a concrete car park",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/07.jpg",
        alt: "Door card and wing mirror, the orange facade caught in the glass",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-bmw-120/08.jpg",
        alt: "The driver's seat in shadow, fabric upholstery",
        ratio: "2/3",
      },
    ],
    summary: "Retail campaign stills and film",
  },

  {
    slug: "ludwig-blomqvist",
    title: "Ludwig Blomqvist",
    // The brands each film was made for, on Alvin's call. Ludwig's own name is
    // the title now, so it is not repeated here.
    client: "Dolce & Gabbana, Valentino, Burberry",
    category: "Commercial",
    featured: true,
    cover: {
      kind: "fileVideo",
      src: "/media/projects/ludwig-blomqvist/cover.mp4",
      poster: "/media/projects/ludwig-blomqvist/cover-poster.jpg",
      alt: "Opening frames of the Dolce & Gabbana film",
      ratio: "4/5",
      clipOf: "/media/projects/ludwig-blomqvist/film-01.mp4",
    },
    // Running order is Alvin's, from the priority he put on the delivery
    // folders: Dolce & Gabbana, the three-part Valentino, the second Valentino,
    // Burberry. The filenames are the order they were ingested in and
    // deliberately do not track this — sequence belongs here, not on disk.
    //
    // The Celsius film that used to open this case is in HYROX Creators Cup
    // now. It was shot around that weekend and delivered in a HYROX subfolder,
    // so it was never really a brand film in the sense the others are.
    gallery: [
      {
        kind: "fileVideo",
        src: "/media/projects/ludwig-blomqvist/film-01.mp4",
        poster: "/media/projects/ludwig-blomqvist/film-01-poster.jpg",
        alt: "Dolce & Gabbana film, shot vertical for social",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/ludwig-blomqvist/film-02.mp4",
        poster: "/media/projects/ludwig-blomqvist/film-02-poster.jpg",
        alt: "Valentino film, three cutdowns edited as one sequence",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/ludwig-blomqvist/film-05.mp4",
        poster: "/media/projects/ludwig-blomqvist/film-05-poster.jpg",
        alt: "Second Valentino film, shot vertical for social",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/ludwig-blomqvist/film-03.mp4",
        poster: "/media/projects/ludwig-blomqvist/film-03-poster.jpg",
        alt: "Burberry film, shot vertical for social",
        ratio: "9/16",
      },
    ],
    summary: "Vertical brand films for Dolce & Gabbana, Valentino and Burberry",
  },

  {
    slug: "sacred-sauna",
    title: "Sacred Sauna & A Friend of Mine",
    client: "Sacred Sauna",
    category: "Commercial",
    cover: {
      kind: "image",
      src: "/media/projects/sacred-sauna/cover.jpg",
      alt: "Two runners on the cobbles by the water, flags overhead",
      ratio: "4/5",
    },
    gallery: [
      {
        kind: "fileVideo",
        src: "/media/projects/sacred-sauna/film-01.mp4",
        poster: "/media/projects/sacred-sauna/film-01-poster.jpg",
        alt: "Film of the run through the city, ending on the sauna deck",
        ratio: "9/16",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/01.jpg",
        alt: "Black and white portrait of a runner on an escalator",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/02.jpg",
        alt: "Two runners passing the quay in the middle of the run",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/03.jpg",
        alt: "Black and white frame of the group heading up an escalator",
        ratio: "3/2",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/04.jpg",
        alt: "Orange drinks packed in a bucket of ice on a wooden deck",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/05.jpg",
        alt: "The group sitting on the sauna deck in low afternoon sun",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/06.jpg",
        alt: "Helio goodie bags lined up on a table outside the sauna",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/07.jpg",
        alt: "Runner standing in the street after the session",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/08.jpg",
        alt: "Zenzi cans and snacks inside a kraft paper bag",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/sacred-sauna/09.jpg",
        alt: "Matcha drink on a stone ledge against a green wall",
        ratio: "2/3",
      },
    ],
    summary: "Event film, food and product stills",
  },

  {
    slug: "sacred-sauna-films",
    title: "Sacred Sauna Social Films",
    client: "Sacred Sauna",
    category: "Commercial",
    cover: {
      kind: "fileVideo",
      src: "/media/projects/sacred-sauna-films/cover.mp4",
      poster: "/media/projects/sacred-sauna-films/cover-poster.jpg",
      alt: "The sauna sign, the plunge pool and the deck from above",
      ratio: "4/5",
    },
    gallery: [
      {
        kind: "fileVideo",
        src: "/media/projects/sacred-sauna-films/film-01.mp4",
        poster: "/media/projects/sacred-sauna-films/film-01-poster.jpg",
        alt: "Presenter introducing the sauna to camera, captions on screen",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/sacred-sauna-films/film-02.mp4",
        poster: "/media/projects/sacred-sauna-films/film-02-poster.jpg",
        alt: "A guest on the science behind sauna and cold plunge",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/sacred-sauna-films/film-03.mp4",
        poster: "/media/projects/sacred-sauna-films/film-03-poster.jpg",
        alt: "A guest on leaving the phone behind for sixty minutes",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/sacred-sauna-films/film-04.mp4",
        poster: "/media/projects/sacred-sauna-films/film-04-poster.jpg",
        alt: "Quick interviews with guests on the deck",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/sacred-sauna-films/film-05.mp4",
        poster: "/media/projects/sacred-sauna-films/film-05-poster.jpg",
        alt: "Two men in conversation on a bench outside, for Salte and Sacred Sauna",
        ratio: "9/16",
      },
      {
        kind: "fileVideo",
        src: "/media/projects/sacred-sauna-films/film-06.mp4",
        poster: "/media/projects/sacred-sauna-films/film-06-poster.jpg",
        alt: "Event film from the deck with the plunge pools, the gong and electrolyte sachets",
        ratio: "9/16",
      },
    ],
    summary: "Vertical marketing films",
  },

  {
    // The other half of the case above. One car throughout — a red M2, LRJ 03W —
    // which is why the country-road frames and the ones under the office
    // overhang belong together despite looking like two different days.
    slug: "bmw-sverige",
    title: "BMW M2",
    client: "BMW Sverige",
    category: "Automotive",
    cover: {
      kind: "image",
      src: "/media/projects/bmw-sverige/cover.jpg",
      alt: "Red BMW M2 under a concrete overhang, sunlight across the bench in front",
      ratio: "4/5",
    },
    gallery: [
      {
        kind: "image",
        src: "/media/projects/bmw-sverige/01.jpg",
        alt: "Red BMW M2 on a tree-lined country road in evening sun",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/bmw-sverige/02.jpg",
        alt: "The M2 passing a red barn on a narrow lane",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/bmw-sverige/03.jpg",
        alt: "The M2 head-on down a straight road through dry grass",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/bmw-sverige/04.jpg",
        alt: "The M2 framed past a blurred hand in the foreground",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/bmw-sverige/05.jpg",
        alt: "The M2 parked under the overhang with the office facade behind",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/bmw-sverige/06.jpg",
        alt: "The M2 from behind in the shade of the overhang",
        ratio: "2/3",
      },
    ],
    summary: "Stills of the M2, road and city",
  },

  {
    slug: "electrolux-stenmarck",
    title: "Electrolux & Stenmarck",
    client: "Electrolux",
    category: "Commercial",
    featured: true,
    cover: {
      kind: "fileVideo",
      src: "/media/projects/electrolux-stenmarck/cover.mp4",
      poster: "/media/projects/electrolux-stenmarck/cover-poster.jpg",
      alt: "Opening frames of the Electrolux film",
      ratio: "4/5",
      clipOf: "/media/projects/electrolux-stenmarck/film-01.mp4",
    },
    gallery: [
      {
        kind: "fileVideo",
        src: "/media/projects/electrolux-stenmarck/film-01.mp4",
        poster: "/media/projects/electrolux-stenmarck/film-01-poster.jpg",
        alt: "Electrolux brand film, shot vertical",
        ratio: "9/16",
      },
    ],
    summary: "Vertical brand film",
  },

  // BKM and Zenzi & Helio folded into one reel with no client credit, on
  // Alvin's call. The old slugs redirect here — see next.config.ts.
  {
    slug: "product-photography",
    title: "Product Photography",
    category: "Product",
    featured: true,
    cover: {
      kind: "image",
      src: "/media/projects/product-photography/cover.jpg",
      alt: "BKM pouch standing on a sunlit rock",
      ratio: "4/5",
    },
    gallery: [
      {
        kind: "image",
        src: "/media/projects/product-photography/01.jpg",
        alt: "Helio paper bag and a Zenzi bar on a wooden table in hard sun",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/02.jpg",
        alt: "BKM bottle and tin lying on moss beside a fallen branch",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/03.jpg",
        alt: "Cans and bars spilling out beside a kraft bag on wooden decking",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/04.jpg",
        alt: "A hand holding the BKM tin in a wheat field",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/05.jpg",
        alt: "A Zenzi bar resting among green leaves",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/06.jpg",
        alt: "BKM bottle and tin on dark ground next to running shoes",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/07.jpg",
        alt: "A cinnamon bar on weathered boards in a strip of hard sun",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/08.jpg",
        alt: "The tin resting on paving beside a shoe and a water bottle",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/09.jpg",
        alt: "Helio bag standing on a table outdoors against the sky",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/10.jpg",
        alt: "A drink can standing in the marked lanes of the HYROX floor",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/product-photography/11.jpg",
        alt: "Sachets spread on a wooden table beside the corner of a paper bag",
        ratio: "2/3",
      },
    ],
    summary: "Product and packaging stills",
  },

  {
    slug: "hedin-mini-danderyd",
    title: "MINI Danderyd",
    client: "Hedin Automotive",
    category: "Automotive",
    cover: {
      kind: "image",
      src: "/media/projects/hedin-mini-danderyd/cover.jpg",
      alt: "MINI on the showroom floor under an arched backdrop, hard shadows across the tiles",
      ratio: "4/5",
    },
    gallery: [
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/01.jpg",
        alt: "Convertible in the showroom against brick and full-height windows",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/02.jpg",
        alt: "Showroom floor with cars parked around the lounge area",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/03.jpg",
        alt: "MINI badge on the bonnet with striped light falling across it",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/04.jpg",
        alt: "White leather seats with the MINI logo stitched into the headrest",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/05.jpg",
        alt: "Close detail of the quilted white headrest",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/06.jpg",
        alt: "Showroom seen from above with a convertible on the floor below",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/07.jpg",
        alt: "Open convertible from above, steering wheel and white seats in daylight",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/08.jpg",
        alt: "Showroom interior with several cars under the ceiling grid",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/09.jpg",
        alt: "The floor seen from the mezzanine, cars arranged around the space",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/10.jpg",
        alt: "Orange and white MINIs lined up in the workshop doorway",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/11.jpg",
        alt: "MINI badge close on an orange bonnet",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/hedin-mini-danderyd/12.jpg",
        alt: "Black John Cooper Works parked in the workshop bay",
        ratio: "2/3",
      },
    ],
    summary: "Showroom stills",
  },

  {
    slug: "mini-countryman",
    title: "MINI Countryman",
    client: "MINI Nordics & Melt Studios",
    category: "Automotive",
    // Alvin's pick, and a tight one: the tailgate lettering with a blurred
    // figure in the field behind. It was 05 in the gallery until now. As a 4/5
    // card beside the other covers it reads as a green panel rather than a car,
    // which is worth knowing before anyone "corrects" it.
    cover: {
      kind: "image",
      src: "/media/projects/mini-countryman/cover.jpg",
      alt: "Countryman lettering on the tailgate, a blurred figure in the field beyond",
      ratio: "4/5",
    },
    // Everything in the delivery folder, on Benjamin's instruction. Two
    // sessions of the same car, MAU 01T — dusk by a ploughed field, and autumn
    // along a forest road with the bracken gone orange — interleaved rather
    // than run as two blocks: wide, closer, details, inside, then the frames
    // with someone in them.
    gallery: [
      // Delivered in this shape and kept that way, so it runs full width.
      {
        kind: "fileVideo",
        src: "/media/projects/mini-countryman/film-01.mp4",
        poster: "/media/projects/mini-countryman/film-01-poster.jpg",
        alt: "Film of the green Countryman on forest roads and by the lake at dusk",
        ratio: "1384/1080",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/01.jpg",
        alt: "The green Countryman on a forest road, spruce and orange bracken behind",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/02.jpg",
        alt: "Front three-quarter close on the grille and headlight, bracken beyond",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/03.jpg",
        alt: "Green Countryman with its headlights on beside the trees at sunset",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/04.jpg",
        alt: "Rear of the green Countryman parked at the edge of a ploughed field",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/05.jpg",
        alt: "The car small on the forest road, seen under overhanging leaves",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/06.jpg",
        alt: "Tail lights glowing on a gravel road between fields",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/07.jpg",
        alt: "The car on the road below tall spruce, bracken along the verge",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/08.jpg",
        alt: "Countryman S lettering and tail light, close on the tailgate",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/09.jpg",
        alt: "Rear side window and green bodywork in close detail",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/10.jpg",
        alt: "Headlight in close-up, MINI moulded into the reflector",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/11.jpg",
        alt: "Bonnet badge and grille above the number plate",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/12.jpg",
        alt: "MINI wings projected onto the gravel by the puddle lamp",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/13.jpg",
        alt: "Passenger door in knitted blue trim, tan leather seat, bracken through the glass",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/14.jpg",
        alt: "Steering wheel and blue dashboard, forest through the windscreen",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/15.jpg",
        alt: "Dashboard and round centre display in the dark",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/16.jpg",
        alt: "The car on a gravel road with a figure standing ahead of it",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/mini-countryman/17.jpg",
        alt: "Blurred figure walking past the car parked beside the trees",
        ratio: "2/3",
      },
    ],
    summary: "Collaboration, stills and film",
  },

  {
    slug: "lifesum-run-club",
    title: "Lifesum Run Club",
    client: "Lifesum",
    category: "Commercial",
    cover: {
      kind: "image",
      src: "/media/projects/lifesum-run-club/cover.jpg",
      alt: "A runner's back in a Lifesum Run Club Stockholm T-shirt",
      ratio: "4/5",
    },
    gallery: [
      {
        kind: "fileVideo",
        src: "/media/projects/lifesum-run-club/film-01.mp4",
        poster: "/media/projects/lifesum-run-club/film-01-poster.jpg",
        alt: "Run club film, the group setting off through Stockholm and the juice stop after",
        ratio: "9/16",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/01.jpg",
        alt: "Two runners in club T-shirts talking outside a restaurant",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/02.jpg",
        alt: "The host briefing the group in the middle of the street",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/03.jpg",
        alt: "Four runners crossing the street in step",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/04.jpg",
        alt: "Group photo of the club against a pale facade",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/05.jpg",
        alt: "The same group turned around to show the backs of their T-shirts",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/06.jpg",
        alt: "Black and white frame of the group from behind",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/07.jpg",
        alt: "Green juices, flowers and sachets set out against an orange wall",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/08.jpg",
        alt: "Runners heading off along the bike lane",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/09.jpg",
        alt: "A runner drinking a green juice after the run",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/10.jpg",
        alt: "The club gathering outside an ochre building under a Lifesum flag",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/11.jpg",
        alt: "Runners cooling down on the pavement in small groups",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/12.jpg",
        alt: "Overhead of a hand holding a green juice and a protein bar",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/13.jpg",
        alt: "Three club T-shirts seen from behind",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/14.jpg",
        alt: "Two runners posing against the ochre wall",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/15.jpg",
        alt: "Hands fanning out a stack of green Lifesum leaflets",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/16.jpg",
        alt: "Juices held out over leaflets scattered on the paving",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/17.jpg",
        alt: "Leaflets reading Back to routines with Lifesum spread on the ground",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/18.jpg",
        alt: "Two runners holding up juices beside the Lifesum flag",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/19.jpg",
        alt: "The same pair laughing, bottles raised",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/lifesum-run-club/20.jpg",
        alt: "A runner blurred in motion past the Lifesum flag",
        ratio: "2/3",
      },
    ],
    summary: "Run club event, stills and film",
  },

  {
    slug: "the-coffee-party",
    title: "The Coffee Party",
    category: "Commercial",
    cover: {
      kind: "image",
      src: "/media/projects/the-coffee-party/cover.jpg",
      alt: "Iced coffees handed across a steel counter",
      ratio: "4/5",
    },
    gallery: [
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/01.jpg",
        alt: "A drink can balanced on a railing above the crowd",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/02.jpg",
        alt: "The same can up close against the blurred room",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/03.jpg",
        alt: "A can lit up on top of an espresso machine",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/04.jpg",
        alt: "A rail of vintage jackets against a concrete wall",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/05.jpg",
        alt: "A single print taped to a concrete wall",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/06.jpg",
        alt: "Prints and a table display under fairy lights",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/07.jpg",
        alt: "Illustrated posters on a brick wall",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/08.jpg",
        alt: "A steel bowl of cans on ice",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/09.jpg",
        alt: "A guest posing in front of two paintings",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/10.jpg",
        alt: "DJ playing behind a table of coffee and sachets",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/11.jpg",
        alt: "A guest beside a clothing rail, mid-gesture",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/12.jpg",
        alt: "Bags and accessories laid out on a table",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/13.jpg",
        alt: "A crew T-shirt seen from behind at the bar",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/14.jpg",
        alt: "Two guests dancing in the crowd",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/15.jpg",
        alt: "A dancer in a patterned shirt and headband",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/projects/the-coffee-party/16.jpg",
        alt: "DJ in headphones behind the decks",
        ratio: "2/3",
      },
    ],
    summary: "Event stills",
  },

  {
    slug: "songsontv",
    title: "SongsonTV",
    client: "SongsonTV",
    category: "Commercial",
    cover: {
      kind: "fileVideo",
      src: "/media/projects/songsontv/cover.mp4",
      poster: "/media/projects/songsontv/cover-poster.jpg",
      alt: "A singer performing against a yellow tiled wall",
      ratio: "4/5",
    },
    // Song order, from the numbers in Alvin's filenames.
    gallery: [
      "A singer performing in an underpass lit yellow",
      "A singer leaning on a pastel wall, blue lights behind",
      "A singer in a white long-sleeve performing against a blue mural",
      "A singer performing against a yellow tiled wall, ending close to camera",
      "A singer alone on a dark open square at night",
      "A singer sitting on the steps outside a pair of wooden doors",
      "A singer beside the railings of a lit square at night",
      "A long-haired singer in a leather jacket, in profile at night",
      "A singer by a hedge at dusk",
      "A phone and earphones on stone, then the singer seated at a night window",
      "The singer seated at a window over the city lights",
      "A singer on a street corner at night under a streetlight",
      "A singer in a concrete underpass under a row of ceiling lights",
      "A singer on a bench beneath a lit pavilion roof",
      "Another take by the hedge at dusk, closer in",
      "The hedge at dusk from further back",
    ].map((alt, index) => {
      const n = String(index + 1).padStart(2, "0");
      return {
        kind: "fileVideo" as const,
        src: `/media/projects/songsontv/film-${n}.mp4`,
        poster: `/media/projects/songsontv/film-${n}-poster.jpg`,
        alt,
        ratio: "9/16",
      };
    }),
    summary: "Vertical performance films",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

/**
 * The categories as pages rather than as a filter.
 *
 * /work used to filter in the browser and nothing else: the buttons changed
 * React state, so a category could not be linked to, shared, or found by a
 * search engine — there was no URL to point at. Each one is a real page now,
 * prerendered like everything else.
 *
 * One source for the slug and the copy, because the grid, the route and the
 * sitemap all need them and three spellings of "automotive" would drift apart.
 */
export const categories = [
  {
    slug: "automotive",
    name: "Automotive" as const,
    title: "Automotive",
    lead: "Cars photographed where they are sold and where they are driven: showrooms, forest roads and test-drive days.",
  },
  {
    slug: "product",
    name: "Product" as const,
    title: "Product",
    lead: "Packaging, food and objects, shot in daylight on location or under controlled light.",
  },
  {
    slug: "commercial",
    name: "Commercial" as const,
    title: "Commercial",
    lead: "Campaigns, events and brand films for the people who commission them.",
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProjectsByCategory(name: Category) {
  return projects.filter((project) => project.category === name);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** Previous/next wrap around so the case study navigation never dead-ends. */
export function getProjectNeighbours(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
