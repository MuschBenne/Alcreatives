/**
 * Global site copy and contact details.
 *
 * Contact details, socials and domain are real. The copy is mine rather than
 * Alvin's, kept as written rather than rewritten — ASSETS-NEEDED.md lists the
 * strings if that ever changes.
 * Nothing else in the codebase hardcodes this information.
 */
export const site = {
  /** Two words. The Wordmark component sets it as the logo. */
  name: "Alvin Creatives",
  url: "https://alcreatives.com",

  /*
   * Written to match the work on the site, and kept on Benjamin's call rather
   * than rewritten. The bio and the About heading are Alvin's own words; these
   * are not. ASSETS-NEEDED.md lists them if that ever changes.
   */
  tagline: "Sports, cars, products and commercial work.",
  heroLine:
    "Sweden based photographer and filmmaker, working across sports, cars, products and commercial work.",
  description:
    "Alvin Creatives is a Sweden based photographer and filmmaker working across sports, cars, products and commercial work with the same eye for detail in every frame.",

  intro:
    "Capturing images that fit both the moment and the character of the car, whether in motion or standing still.",

  about: {
    heading: "To build character in each frame.",
    /**
     * A behind-the-scenes frame rather than a portrait of Alvin, decided rather
     * than forgotten, and the alt text describes what the picture actually
     * shows. Swapping in a real portrait later is one file at this path.
     */
    portrait: {
      kind: "image",
      src: "/media/about/portrait.jpg",
      alt: "Camera held out over an event floor from a balcony",
      ratio: "4/5",
    },
    /** Alvin's own words. */
    bio: [
      "Alvin Creatives is a Sweden based photographer and filmmaker working across sports, cars, products and commercial work.",
    ],
    approach:
      "Every project starts with the same question: what should this make someone feel in the first two seconds? Everything after that is craft: lens choice, blocking, grade, and knowing when to stop.",
  },

  contact: {
    email: "Alvincreatives@outlook.com",
    location: "Stockholm, Sweden",
    availability: "Available for commissions worldwide",
  },

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/alvincreatives/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/alvin-haddad-39a19222b/" },
  ],

  /** Studio credit in the footer. */
  credit: { label: "rosenbergab.com", href: "https://rosenbergab.com" },

  /**
   * Hero showreel, self-hosted and served from R2 with the rest of the media.
   * The provider switch that used to pick a hosted player instead is gone:
   * R2 answers Range requests, so the file streams properly on its own.
   */
  showreel: {
    file: "/media/hero/showreel.mp4",
    poster: "/media/hero/hero-poster.jpg",
    alt: "Alvin Creatives showreel with cars, competition floors, product and kitchens",
  },

  /**
   * The stills in the home page's Approach section.
   *
   * Here rather than inside the component, and that is the whole point: written
   * as literals in Intro.tsx they sat outside every check the data-integrity
   * test performs, because a Node test cannot import a .tsx. A mistyped path
   * would have rendered "Awaiting asset" on the home page with nothing failing.
   */
  introStills: {
    portrait: {
      kind: "image",
      src: "/media/intro/still-01.jpg",
      alt: "Black and white frame of a car parked against a manor house in backlight",
      ratio: "4/5",
    },
    /** Sits under the caption and stretches down to the portrait's bottom edge. */
    landscape: {
      kind: "image",
      src: "/media/projects/hedin-ineos-grenadier/03.jpg",
      alt: "Grenadier working its way along a track through open farmland",
      ratio: "3/2",
    },
    /** Three portraits side by side where a single wide frame used to run. */
    row: [
      {
        kind: "image",
        src: "/media/intro/still-02.jpg",
        alt: "Crowd crossing the street towards the HYROX venue",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/intro/still-03.jpg",
        alt: "A hand holding a BKM tin up against a wheat field",
        ratio: "2/3",
      },
      {
        kind: "image",
        src: "/media/intro/still-04.jpg",
        alt: "Red INEOS Grenadier low in the grass beside a farm track at sunset",
        ratio: "2/3",
      },
    ],
  },

  capabilities: [
    {
      number: "01",
      title: "Automotive photography",
      description:
        "Built around finding the right environment for the right car.",
      image: {
        src: "/media/capabilities/automotive.jpg",
        alt: "Front grille of a blue off-roader framed through an open car door",
        ratio: "4/5",
      },
    },
    {
      number: "02",
      title: "Film & motion",
      description:
        "Brand films, social cutdowns and showreels. Directed, shot, edited and graded in-house, framed vertical when that is where it runs.",
      image: {
        src: "/media/capabilities/motion.jpg",
        alt: "Cinema camera on a tripod set up in a gallery space",
        ratio: "4/5",
      },
    },
    {
      number: "03",
      title: "Product & still life",
      description:
        "Each shoot built around pairing a product with a space that suits it.",
      image: {
        src: "/media/capabilities/product.jpg",
        alt: "Product bar lit by hard sun against dark wood",
        ratio: "4/5",
      },
    },
  ],
} as const;
