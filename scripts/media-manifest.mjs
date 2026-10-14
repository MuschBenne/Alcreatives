/**
 * Which camera original becomes which file under /public/media.
 *
 * Sources live in `hemsida material/` (gitignored — the originals never get
 * committed). Run `npm run media` after changing anything here.
 *
 * `ratio` is the crop applied on the way out. The site's own layouts expect:
 *   4/5  covers, capability tiles, intro portrait, about portrait
 *   2/3  gallery stills (the native shape of every original)
 *   3/2  the handful of wide frames that give a case gallery its rhythm
 * Keep `ratio` here in sync with the `ratio` set in data/projects.ts.
 */

/** Root of the delivery folder, relative to the repo. */
export const SOURCE_ROOT = "hemsida material";

const HEDIN = "HEDIN AUTOMOTIVE/BILDER";
const MINI = "HEDIN AUTOMOTIVE/Mini Danderyd";
const HEDIN_VIDEO = "HEDIN AUTOMOTIVE/VIDEOS";
const HYROX = "HYROX CREATORS CUP X STAN BROWNEY/BILDER";
const SAUNA = "SACRED SAUNA X AFRIENDOFMINE/BILDER";
const PRODUCT = "PRODUCT PHOTOGRAPHY";
const BTS = "BTS";
const LUDWIG = "LUDWIG BLOMQVIST";
// The delivery folder Alvin re-sorted by priority. Only the Valentino film is
// new — the other four are byte-identical to LUDWIG above, so they keep their
// original paths rather than being re-encoded for a rename.
const LUDWIG2 = "LUDWIG BLOMQVIST 2";
// The September delivery. Its folder names are Alvin's instructions, hence the
// length. The "Kopia av …" stills in it are byte-identical to originals in the
// folders above, so those are referenced at their original paths instead.
const NYA = "NYA";
const INEOS_RED = `${NYA}/addera i ineos fliken för hedin`;
const SAUNA_FILMS = `${NYA}/Client _ The Sacred Sauna , Project _ marketing material_.`;
const LIFESUM = `${NYA}/lifesum material, project _ Lifesum Run Club`;
const COUNTRYMAN = `${NYA}/Mini Countryman ( Client _ Mini Nordics & Melt Studios , Project _ Collaboration))`;
const COFFEE = `${NYA}/The Coffee Party`;
// The September re-edit of the Hedin shoot: the same frames without the campaign
// lockups burned into them. Folder name is Alvin's spelling.
const HEDIN_NEW = `${NYA}/hedin autmotive bmw`;

export const images = [
  // — Homepage furniture ————————————————————————————————
  { from: `${BTS}/IMG_5546.jpg`, to: "intro/still-01.jpg", ratio: "4/5" },
  // Three portraits side by side where one wide frame used to run — Alvin's
  // pick, one each from HYROX, product and the red Grenadier.
  { from: `${HYROX}/DSC05861.jpg`, to: "intro/still-02.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC09619-2.jpg`, to: "intro/still-03.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01764.jpg`, to: "intro/still-04.jpg", ratio: "2/3" },

  { from: `${HEDIN}/Kopia av DSC03418-2.jpg`, to: "capabilities/automotive.jpg", ratio: "4/5" },
  { from: `${BTS}/IMG_2109-2.jpg`, to: "capabilities/motion.jpg", ratio: "4/5" },
  { from: `${PRODUCT}/DSC08085.jpg`, to: "capabilities/product.jpg", ratio: "4/5" },

  // Stand-in until Alvin sends a real portrait of himself — see ASSETS-NEEDED.md.
  { from: `${BTS}/IMG_8799-2.jpg`, to: "about/portrait.jpg", ratio: "4/5" },

  // — Behind the scenes ——————————————————————————————————
  // Phone frames from set, all 9:16 and all black and white. Cropped to the
  // same 2:3 as the case stills so the page reads as one contact sheet.
  // IMG_2109-2, IMG_5546 and IMG_8799-2 are deliberately absent — they are
  // already doing work as the motion tile, the intro still and the portrait.
  { from: `${BTS}/IMG_0975.jpg`, to: "bts/01.jpg", ratio: "2/3" },
  { from: `${BTS}/IMG_2200-2.jpg`, to: "bts/02.jpg", ratio: "2/3" },
  { from: `${BTS}/IMG_1491-2.jpg`, to: "bts/03.jpg", ratio: "2/3" },
  { from: `${BTS}/IMG_6465.jpg`, to: "bts/04.jpg", ratio: "2/3" },
  { from: `${BTS}/IMG_3261-2.jpg`, to: "bts/05.jpg", ratio: "2/3" },
  { from: `${BTS}/IMG_2118-2.jpg`, to: "bts/06.jpg", ratio: "2/3" },
  { from: `${BTS}/IMG_3935.jpg`, to: "bts/07.jpg", ratio: "2/3" },
  { from: `${BTS}/IMG_2167-3.jpg`, to: "bts/08.jpg", ratio: "2/3" },

  // — INEOS Grenadier for Hedin Automotive ——————————————
  { from: `${HEDIN}/Kopia av DSC03418-2.jpg`, to: "projects/hedin-ineos-grenadier/cover.jpg", ratio: "4/5" },
  { from: `${HEDIN}/Kopia av DSC03563-2.jpg`, to: "projects/hedin-ineos-grenadier/01.jpg", ratio: "2/3" },
  { from: `${HEDIN}/Kopia av DSC03227-2.jpg`, to: "projects/hedin-ineos-grenadier/02.jpg", ratio: "2/3" },
  { from: `${HEDIN}/Kopia av DSC03632-2.jpg`, to: "projects/hedin-ineos-grenadier/03.jpg", ratio: "3/2" },
  { from: `${HEDIN}/Kopia av DSC03735.jpg`, to: "projects/hedin-ineos-grenadier/04.jpg", ratio: "2/3" },
  { from: `${HEDIN}/Kopia av DSC03761.jpg`, to: "projects/hedin-ineos-grenadier/05.jpg", ratio: "2/3" },
  { from: `${HEDIN}/Kopia av DSC03389-2.jpg`, to: "projects/hedin-ineos-grenadier/06.jpg", ratio: "3/2" },
  { from: `${HEDIN}/Kopia av DSC03738.jpg`, to: "projects/hedin-ineos-grenadier/07.jpg", ratio: "2/3" },
  { from: `${HEDIN}/Kopia av DSC03358-2.jpg`, to: "projects/hedin-ineos-grenadier/08.jpg", ratio: "2/3" },
  // The red Grenadier at sunset, added on Alvin's instruction. Wide frames and
  // details alternate so no two cockpit shots land in the same pair.
  { from: `${INEOS_RED}/DSC01753.jpg`, to: "projects/hedin-ineos-grenadier/09.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01506.jpg`, to: "projects/hedin-ineos-grenadier/10.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01764.jpg`, to: "projects/hedin-ineos-grenadier/11.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01779.jpg`, to: "projects/hedin-ineos-grenadier/12.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01793-2.jpg`, to: "projects/hedin-ineos-grenadier/13.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01533.jpg`, to: "projects/hedin-ineos-grenadier/14.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01792.jpg`, to: "projects/hedin-ineos-grenadier/15.jpg", ratio: "2/3" },
  { from: `${INEOS_RED}/DSC01821.jpg`, to: "projects/hedin-ineos-grenadier/16.jpg", ratio: "2/3" },

  // — BMW 120 retail campaign for Hedin ——————————————————
  // Was the cover until the winter film took that slot; still the strongest
  // campaign frame, so it runs in the gallery rather than going unused.
  // Alvin's September re-edit, replacing all five stills that carried campaign
  // copy across the frame. Same shoot, same car — a black 120, RCJ 53N — with
  // the lockups gone. The X5 and the showroom interior went with them: they were
  // campaign furniture rather than pictures of this car.
  //
  // City, then the road, then the inside: the order the shoot reads in rather
  // than the order the files arrived.
  { from: `${HEDIN_NEW}/hedin 2.jpg`, to: "projects/hedin-bmw-120/01.jpg", ratio: "2/3" },
  { from: `${HEDIN_NEW}/hedin 1.jpg`, to: "projects/hedin-bmw-120/02.jpg", ratio: "2/3" },
  { from: `${HEDIN_NEW}/hedin 5.jpg`, to: "projects/hedin-bmw-120/03.jpg", ratio: "2/3" },
  { from: `${HEDIN_NEW}/hedin 8.jpg`, to: "projects/hedin-bmw-120/04.jpg", ratio: "2/3" },
  { from: `${HEDIN_NEW}/hedin 6.jpg`, to: "projects/hedin-bmw-120/05.jpg", ratio: "2/3" },
  // Delivered 3:4 where the rest are 2:3, and the car sits hard left in it.
  // Cropped from the left rather than the centre, which would have taken the
  // back of the car, and kept at 2/3 so the page still speaks the three shapes
  // the layouts expect.
  {
    from: `${HEDIN_NEW}/hedin 7.jpg`,
    to: "projects/hedin-bmw-120/06.jpg",
    ratio: "2/3",
    position: "left",
  },
  { from: `${HEDIN_NEW}/hedin 3.jpg`, to: "projects/hedin-bmw-120/07.jpg", ratio: "2/3" },
  { from: `${HEDIN_NEW}/hedin 4.jpg`, to: "projects/hedin-bmw-120/08.jpg", ratio: "2/3" },

  // — BMW Sverige ————————————————————————————————————————
  // Split out of the Hedin case on Alvin's instruction: one client per project.
  // Every frame is the red M2, LRJ 03W — country roads in evening sun, then the
  // car under the office overhang — and none of them ever carried campaign copy.
  // The cover is the frontal under the overhang at 4/5, left out of the gallery
  // so nothing appears twice.
  { from: "BMW SVERIGE/DSC02469-2.jpg", to: "projects/bmw-sverige/cover.jpg", ratio: "4/5" },
  { from: "BMW SVERIGE/DSC01867.jpg", to: "projects/bmw-sverige/01.jpg", ratio: "2/3" },
  { from: "BMW SVERIGE/DSC01845.jpg", to: "projects/bmw-sverige/02.jpg", ratio: "2/3" },
  { from: "BMW SVERIGE/DSC01918-2.jpg", to: "projects/bmw-sverige/03.jpg", ratio: "2/3" },
  { from: "BMW SVERIGE/DSC02443-2.jpg", to: "projects/bmw-sverige/04.jpg", ratio: "2/3" },
  { from: "BMW SVERIGE/DSC02473-3.jpg", to: "projects/bmw-sverige/05.jpg", ratio: "2/3" },
  { from: "BMW SVERIGE/DSC02481.jpg", to: "projects/bmw-sverige/06.jpg", ratio: "2/3" },

  // — HYROX Creators Cup ————————————————————————————————
  // Cover swapped to DSC07976 on Alvin's instruction; DSC06472-Redigera is out.
  { from: `${HYROX}/DSC07976.jpg`, to: "projects/hyrox-creators-cup/cover.jpg", ratio: "4/5" },
  { from: `${HYROX}/DSC05887.jpg`, to: "projects/hyrox-creators-cup/01.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC06581.jpg`, to: "projects/hyrox-creators-cup/02.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC07993.jpg`, to: "projects/hyrox-creators-cup/03.jpg", ratio: "3/2" },
  { from: `${HYROX}/DSC07223.jpg`, to: "projects/hyrox-creators-cup/04.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC06860.jpg`, to: "projects/hyrox-creators-cup/05.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC07370.jpg`, to: "projects/hyrox-creators-cup/06.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC06828.jpg`, to: "projects/hyrox-creators-cup/07.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC08053.jpg`, to: "projects/hyrox-creators-cup/08.jpg", ratio: "3/2" },
  { from: `${HYROX}/DSC05300-2.jpg`, to: "projects/hyrox-creators-cup/09.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC07642.jpg`, to: "projects/hyrox-creators-cup/10.jpg", ratio: "2/3" },

  // — Sacred Sauna x A Friend of Mine ————————————————————
  { from: `${SAUNA}/Kopia av DSC07299-8.jpg`, to: "projects/sacred-sauna/cover.jpg", ratio: "4/5" },
  { from: `${SAUNA}/Kopia av DSC07234.jpg`, to: "projects/sacred-sauna/01.jpg", ratio: "2/3" },
  { from: `${SAUNA}/Kopia av DSC07295-3.jpg`, to: "projects/sacred-sauna/02.jpg", ratio: "2/3" },
  { from: `${SAUNA}/Kopia av DSC07654.jpg`, to: "projects/sacred-sauna/03.jpg", ratio: "3/2" },
  { from: `${SAUNA}/Kopia av DSC07816.jpg`, to: "projects/sacred-sauna/04.jpg", ratio: "2/3" },
  { from: `${SAUNA}/Kopia av DSC07879.jpg`, to: "projects/sacred-sauna/05.jpg", ratio: "2/3" },
  { from: `${SAUNA}/Kopia av DSC07899-2.jpg`, to: "projects/sacred-sauna/06.jpg", ratio: "2/3" },
  { from: `${SAUNA}/Kopia av DSC07604-2.jpg`, to: "projects/sacred-sauna/07.jpg", ratio: "2/3" },
  { from: `${SAUNA}/Kopia av DSC07098-2.jpg`, to: "projects/sacred-sauna/08.jpg", ratio: "2/3" },
  { from: `${SAUNA}/Kopia av DSC07697-2.jpg`, to: "projects/sacred-sauna/09.jpg", ratio: "2/3" },

  // — Product photography ————————————————————————————————
  // BKM and Zenzi & Helio folded into one uncredited reel, on Alvin's call:
  // every still in the PRODUCT PHOTOGRAPHY folder, plus the drink can on the
  // HYROX floor he asked to see here too. Brands alternate down the page.
  { from: `${PRODUCT}/DSC09305-2.jpg`, to: "projects/product-photography/cover.jpg", ratio: "4/5" },
  { from: `${PRODUCT}/DSC08054-2.jpg`, to: "projects/product-photography/01.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC09514-3.jpg`, to: "projects/product-photography/02.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC07997-3.jpg`, to: "projects/product-photography/03.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC09619-2.jpg`, to: "projects/product-photography/04.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC08170.jpg`, to: "projects/product-photography/05.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC09159.jpg`, to: "projects/product-photography/06.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC08085.jpg`, to: "projects/product-photography/07.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC09116.jpg`, to: "projects/product-photography/08.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC08010-2.jpg`, to: "projects/product-photography/09.jpg", ratio: "2/3" },
  { from: `${HYROX}/DSC06581.jpg`, to: "projects/product-photography/10.jpg", ratio: "2/3" },
  { from: `${PRODUCT}/DSC08254-2.jpg`, to: "projects/product-photography/11.jpg", ratio: "2/3" },

  // — MINI Danderyd for Hedin Automotive —————————————————
  // Showroom work, every original 2:3. Sequenced establishing → detail → wide
  // → colour rather than by filename. DSC02201-4 and DSC02211-5 are near-
  // identical overheads, so they sit apart at 06 and 09 rather than together.
  // Drop one if the pair still reads as a repeat.
  { from: `${MINI}/Kopia av DSC02091-9.jpg`, to: "projects/hedin-mini-danderyd/cover.jpg", ratio: "4/5" },
  { from: `${MINI}/Kopia av DSC02158-2.jpg`, to: "projects/hedin-mini-danderyd/01.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02131.jpg`, to: "projects/hedin-mini-danderyd/02.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02097-2.jpg`, to: "projects/hedin-mini-danderyd/03.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02105.jpg`, to: "projects/hedin-mini-danderyd/04.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02120.jpg`, to: "projects/hedin-mini-danderyd/05.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02201-4.jpg`, to: "projects/hedin-mini-danderyd/06.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02122.jpg`, to: "projects/hedin-mini-danderyd/07.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02288.jpg`, to: "projects/hedin-mini-danderyd/08.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02211-5.jpg`, to: "projects/hedin-mini-danderyd/09.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02267-2.jpg`, to: "projects/hedin-mini-danderyd/10.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02240-2.jpg`, to: "projects/hedin-mini-danderyd/11.jpg", ratio: "2/3" },
  { from: `${MINI}/Kopia av DSC02229.jpg`, to: "projects/hedin-mini-danderyd/12.jpg", ratio: "2/3" },

  // — MINI Countryman for MINI Nordics & Melt Studios ————
  // Everything in the delivery folder is in the case now, on Benjamin's
  // instruction: nine stills had never been picked up, six delivered on
  // 16 September and three from the 7th that were missed at the time.
  //
  // Two sessions, one car — MAU 01T. The original set is dusk by a ploughed
  // field; the new one is autumn, bracken gone orange along a forest road. They
  // are interleaved below rather than run as two blocks, so the case reads as
  // one shoot: wide, then closer, then the details, then inside, then the
  // frames with a figure in them.
  //
  // The cover is DSC03489-2 on Alvin's instruction. It used to be 05 in the
  // gallery and it is a tight frame — the tailgate lettering and a blurred
  // figure — so as a 4/5 card it reads as a green panel rather than a car.
  // His call, recorded here so nobody quietly "fixes" it later.
  { from: `${COUNTRYMAN}/DSC03489-2.jpg`, to: "projects/mini-countryman/cover.jpg", ratio: "4/5" },
  { from: `${COUNTRYMAN}/mini 4.jpg`, to: "projects/mini-countryman/01.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/mini 1.jpg`, to: "projects/mini-countryman/02.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03530-2.jpg`, to: "projects/mini-countryman/03.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03335.jpg`, to: "projects/mini-countryman/04.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/mini 6.jpg`, to: "projects/mini-countryman/05.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03419-4.jpg`, to: "projects/mini-countryman/06.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03966.jpg`, to: "projects/mini-countryman/07.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/mini 5.jpg`, to: "projects/mini-countryman/08.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03352-2.jpg`, to: "projects/mini-countryman/09.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC04032.jpg`, to: "projects/mini-countryman/10.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/mini 2DSC04027.jpg`, to: "projects/mini-countryman/11.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03520.jpg`, to: "projects/mini-countryman/12.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/mini 3.jpg`, to: "projects/mini-countryman/13.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC04061.jpg`, to: "projects/mini-countryman/14.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03427.jpg`, to: "projects/mini-countryman/15.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03506-4.jpg`, to: "projects/mini-countryman/16.jpg", ratio: "2/3" },
  { from: `${COUNTRYMAN}/DSC03546-2.jpg`, to: "projects/mini-countryman/17.jpg", ratio: "2/3" },

  // — Lifesum Run Club ———————————————————————————————————
  // In shooting order: briefing, the run, the juice stop, the leaflets.
  { from: `${LIFESUM}/bilder/DSC02635.jpg`, to: "projects/lifesum-run-club/cover.jpg", ratio: "4/5" },
  { from: `${LIFESUM}/bilder/DSC02645.jpg`, to: "projects/lifesum-run-club/01.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02652-2.jpg`, to: "projects/lifesum-run-club/02.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02668-2.jpg`, to: "projects/lifesum-run-club/03.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02674.jpg`, to: "projects/lifesum-run-club/04.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02745-3.jpg`, to: "projects/lifesum-run-club/05.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02755-2.jpg`, to: "projects/lifesum-run-club/06.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02780.jpg`, to: "projects/lifesum-run-club/07.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02809-2.jpg`, to: "projects/lifesum-run-club/08.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02815.jpg`, to: "projects/lifesum-run-club/09.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02840.jpg`, to: "projects/lifesum-run-club/10.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02850.jpg`, to: "projects/lifesum-run-club/11.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02895.jpg`, to: "projects/lifesum-run-club/12.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC02922.jpg`, to: "projects/lifesum-run-club/13.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC03007-2.jpg`, to: "projects/lifesum-run-club/14.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC03065-2.jpg`, to: "projects/lifesum-run-club/15.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC03113.jpg`, to: "projects/lifesum-run-club/16.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC03149.jpg`, to: "projects/lifesum-run-club/17.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC03153.jpg`, to: "projects/lifesum-run-club/18.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC03195-2.jpg`, to: "projects/lifesum-run-club/19.jpg", ratio: "2/3" },
  { from: `${LIFESUM}/bilder/DSC03302-Edit-2.jpg`, to: "projects/lifesum-run-club/20.jpg", ratio: "2/3" },

  // — The Coffee Party ———————————————————————————————————
  // DSC04592 came in two grades; -3 is the warmer one and the one Alvin kept.
  { from: `${COFFEE}/DSC04592-3.jpg`, to: "projects/the-coffee-party/cover.jpg", ratio: "4/5" },
  { from: `${COFFEE}/DSC03888-2.jpg`, to: "projects/the-coffee-party/01.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC03890-2.jpg`, to: "projects/the-coffee-party/02.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC03906-3.jpg`, to: "projects/the-coffee-party/03.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC03959.jpg`, to: "projects/the-coffee-party/04.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC03961.jpg`, to: "projects/the-coffee-party/05.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC03971-2.jpg`, to: "projects/the-coffee-party/06.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04174-3.jpg`, to: "projects/the-coffee-party/07.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04198-3.jpg`, to: "projects/the-coffee-party/08.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04262.jpg`, to: "projects/the-coffee-party/09.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04275-2.jpg`, to: "projects/the-coffee-party/10.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04458.jpg`, to: "projects/the-coffee-party/11.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04464.jpg`, to: "projects/the-coffee-party/12.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04576-2.jpg`, to: "projects/the-coffee-party/13.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04750-2.jpg`, to: "projects/the-coffee-party/14.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04774-2.jpg`, to: "projects/the-coffee-party/15.jpg", ratio: "2/3" },
  { from: `${COFFEE}/DSC04786-2.jpg`, to: "projects/the-coffee-party/16.jpg", ratio: "2/3" },
];

/**
 * Every source film is 9:16 except the showreel and the MINI Countryman film.
 *
 * Quality: 1080 on the long-lived side at CRF 23 (the showreel at 22), capped
 * at 5 Mbps unless a spec sets `maxrate`. Measured on the BMW film: 720p at
 * CRF 30 came to 0.6 Mbps and smeared the snow into flat patches; CRF 23 at
 * 1080p is 2.9 Mbps and close to the source, while CRF 20 costs 50% more for
 * a difference that is hard to see. These sizes assume media served from R2,
 * which answers Range requests — the Worker's own assets do not, and cap a
 * file at 25 MiB.
 * `trim` cuts a hover-sized loop for grid covers; without it the full film is
 * encoded. `segments` replaces `trim` when the loop has to skip a shot in the
 * middle: a list of `{ start, end }` pieces in source seconds, end exclusive,
 * joined in order.
 *
 * Posters default to the frame the encoded clip opens on — `trim.start` or the
 * first segment's start, or the very first frame when there is neither — so the
 * still and the film always show
 * the same picture. `posterAt` overrides that with a timestamp in the *source*,
 * and is worth reaching for only when frame zero is unusable (a fade from black,
 * say). Every current source opens on a real frame, so nothing sets it.
 */
export const videos = [
  {
    from: "SHOWREEL/SHOWREEL HEMSIDA.mp4",
    to: "hero/showreel.mp4",
    poster: "hero/hero-poster.jpg",
    width: 1920,
    height: 1080,
    crf: 22,
    maxrate: "6000k",
  },

  {
    from: "ELECTROLUX/VIDEO/färdig reel Stenmarck.mp4",
    to: "projects/electrolux-stenmarck/cover.mp4",
    poster: "projects/electrolux-stenmarck/cover-poster.jpg",
    trim: { start: 2, duration: 6 },
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: "ELECTROLUX/VIDEO/färdig reel Stenmarck.mp4",
    to: "projects/electrolux-stenmarck/film-01.mp4",
    poster: "projects/electrolux-stenmarck/film-01-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },

  {
    from: `${LUDWIG}/DOLCE & GABANNA/Kopia av D&G .mp4`,
    to: "projects/ludwig-blomqvist/cover.mp4",
    poster: "projects/ludwig-blomqvist/cover-poster.jpg",
    trim: { start: 1, duration: 6 },
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${LUDWIG}/DOLCE & GABANNA/Kopia av D&G .mp4`,
    to: "projects/ludwig-blomqvist/film-01.mp4",
    poster: "projects/ludwig-blomqvist/film-01-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${LUDWIG}/VALENTINO 3st/Kopia av 3x valentino finished.mp4`,
    to: "projects/ludwig-blomqvist/film-02.mp4",
    poster: "projects/ludwig-blomqvist/film-02-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${LUDWIG}/BURBERRY/Sequence 02.mp4`,
    to: "projects/ludwig-blomqvist/film-03.mp4",
    poster: "projects/ludwig-blomqvist/film-03-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  // Moved out of the Ludwig case and into HYROX on Alvin's call, which the
  // material had been saying all along: it was delivered in a HYROX subfolder
  // and its own description reads "shot around the HYROX weekend". The source
  // path keeps the Ludwig prefix because that is where the file actually lives.
  {
    from: `${LUDWIG}/HYROX/Kopia av CELSIUS VID.mp4`,
    to: "projects/hyrox-creators-cup/film-01.mp4",
    poster: "projects/hyrox-creators-cup/film-01-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  // The one genuinely new film in the re-sorted delivery. Numbered 05 because
  // the files keep their original names — the running order lives in
  // data/projects.ts, so re-sequencing costs nothing to re-encode.
  {
    from: `${LUDWIG2}/VALENTINO PRIO 4/VALENTINO PROVA DENNA.mp4`,
    to: "projects/ludwig-blomqvist/film-05.mp4",
    poster: "projects/ludwig-blomqvist/film-05-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },

  // — BMW 120 retail films for Hedin ——————————————————————
  // Both vertical, both around half a minute, both carrying campaign graphics.
  // The other three files in that delivery are a phone-form screen recording,
  // a check-in kiosk and a two-minute brand film — left out on Alvin's call.
  // Grid cover. The film carries burned-in pricing at intervals — 0:17 reads
  // "0 kr kontant" — and a leasing price has no business on the home page. The
  // window from 0:18 is the six clean seconds: the car pulling away down the
  // forest road, then the aerials over the snow at dusk.
  {
    from: `${HEDIN_VIDEO}/PRIO_HEDIN4.mp4`,
    to: "projects/hedin-bmw-120/cover.mp4",
    poster: "projects/hedin-bmw-120/cover-poster.jpg",
    // The forest road, then straight to the aerials. Between them the source
    // cuts to a close-up of the black flank against a dark sky (19.2192), which
    // on the dark grid read as the card going blank a second into the hover.
    // First piece starts at 18 to stay clear of the "0 kr kontant" shot and
    // ends before the close-up; the aerials open at 20.5539 and the piece stops
    // short of the red flash into the end card at 25.63.
    segments: [
      { start: 18, end: 19.2 },
      { start: 20.55, end: 25.35 },
    ],
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${HEDIN_VIDEO}/PRIO_HEDIN1.mp4`,
    to: "projects/hedin-bmw-120/film-01.mp4",
    poster: "projects/hedin-bmw-120/film-01-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${HEDIN_VIDEO}/PRIO_HEDIN4.mp4`,
    to: "projects/hedin-bmw-120/film-02.mp4",
    poster: "projects/hedin-bmw-120/film-02-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },

  // — A Friend of Mine & Sacred Sauna ————————————————————
  {
    from: `${NYA}/LÄGG TILL I AFRIENDOFMINE x SACRED SAUNA/Kopia av AFOM Sacred sauna.mp4`,
    to: "projects/sacred-sauna/film-01.mp4",
    poster: "projects/sacred-sauna/film-01-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },

  // — Sacred Sauna social films ——————————————————————————
  // Grid cover from the event film: its opening six seconds are the sign, the
  // plunge pool and the deck with no captions, where every other film in the
  // set has words burned in from the first frame.
  {
    from: `${SAUNA_FILMS}/Kopia av TSS EVENT.mp4`,
    to: "projects/sacred-sauna-films/cover.mp4",
    poster: "projects/sacred-sauna-films/cover-poster.jpg",
    trim: { start: 0, duration: 6 },
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${SAUNA_FILMS}/Kopia av Andre vid.mp4`,
    to: "projects/sacred-sauna-films/film-01.mp4",
    poster: "projects/sacred-sauna-films/film-01-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${SAUNA_FILMS}/Kopia av DILIN_1.mp4`,
    to: "projects/sacred-sauna-films/film-02.mp4",
    poster: "projects/sacred-sauna-films/film-02-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${SAUNA_FILMS}/Kopia av SEB.mp4`,
    to: "projects/sacred-sauna-films/film-03.mp4",
    poster: "projects/sacred-sauna-films/film-03-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${SAUNA_FILMS}/Kopia av INTERVJU.mp4`,
    to: "projects/sacred-sauna-films/film-04.mp4",
    poster: "projects/sacred-sauna-films/film-04-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${SAUNA_FILMS}/Kopia av SALTE X SACRED.mp4`,
    to: "projects/sacred-sauna-films/film-05.mp4",
    poster: "projects/sacred-sauna-films/film-05-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },
  {
    from: `${SAUNA_FILMS}/Kopia av TSS EVENT.mp4`,
    to: "projects/sacred-sauna-films/film-06.mp4",
    poster: "projects/sacred-sauna-films/film-06-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },

  // — Lifesum Run Club ———————————————————————————————————
  {
    from: `${LIFESUM}/videos/Kopia av Sequence 01_47.mp4`,
    to: "projects/lifesum-run-club/film-01.mp4",
    poster: "projects/lifesum-run-club/film-01-poster.jpg",
    width: 1080,
    height: 1920,
    crf: 23,
  },

  // — MINI Countryman ————————————————————————————————————
  // Kept in its delivered 2770×2160 shape, on Alvin's call, rather than cropped
  // to 9:16. 1384×1080 is that ratio at 1080 lines with an even width, which
  // yuv420p needs; the crop that costs is under a pixel.
  {
    from: `${COUNTRYMAN}/Kopia av Kopia av Sequence 01_59.mp4`,
    to: "projects/mini-countryman/film-01.mp4",
    poster: "projects/mini-countryman/film-01-poster.jpg",
    width: 1384,
    height: 1080,
    crf: 23,
  },

  // — SongsonTV ——————————————————————————————————————————
  // Sixteen vertical performance films. Sequenced by the song number in
  // Alvin's filenames ("vid 6_3" is song 6, take 3); the two unnumbered
  // "Sequence" cuts and the two plain "vid" takes by the hedge follow. Films
  // with the same location are different takes, not duplicates — checked.
  {
    from: `${NYA}/SongsonTV/Kopia av vid 4_4.mp4`,
    to: "projects/songsontv/cover.mp4",
    poster: "projects/songsontv/cover-poster.jpg",
    trim: { start: 0, duration: 6 },
    width: 1080,
    height: 1920,
    crf: 23,
  },
  ...[
    "Kopia av VID 1_2.mp4",
    "Kopia av VID 2_3.mp4",
    "Kopia av vid 3_4.mp4",
    "Kopia av vid 4_4.mp4",
    "Kopia av vid 6_3.mp4",
    "Kopia av vid 6_4.mp4",
    "Kopia av vid 7_3.mp4",
    "Kopia av vid 8_4.mp4",
    "Kopia av VID 9_2.mp4",
    "Kopia av vid 10_1.mp4",
    "Kopia av vid 10_2.mp4",
    "Kopia av vid 13_1.mp4",
    "Kopia av Sequence 01_20.mp4",
    // Picture ends at 18.67 s; the last 21 s of the file are black.
    ["Kopia av Sequence 01_21.mp4", { start: 0, duration: 18.6 }],
    "Kopia av vid .mp4",
    "Kopia av vid.mp4",
  ].map((entry, index) => {
    const [file, trim] = Array.isArray(entry) ? entry : [entry];
    const n = String(index + 1).padStart(2, "0");
    return {
      from: `${NYA}/SongsonTV/${file}`,
      to: `projects/songsontv/film-${n}.mp4`,
      poster: `projects/songsontv/film-${n}-poster.jpg`,
      ...(trim ? { trim } : {}),
      width: 1080,
      height: 1920,
      crf: 23,
    };
  }),
];

/**
 * Logos are tinted by opacity only, so anything dark disappears on the dark
 * background. `white: true` throws away the colour and keeps the alpha shape,
 * which is exactly right for a wordmark. BMW is the exception — flattening the
 * roundel would turn it into a white disc, so it ships as delivered.
 */
export const logos = [
  { from: "LOGOS/BMW_logo_(gray).svg.png", to: "clients/bmw.png", white: false },
  { from: "LOGOS/HYROX_logo.svg.png", to: "clients/hyrox.png", white: true },
  { from: "LOGOS/The_Sacred_Sauna_wordmark_Red.avif", to: "clients/sacred-sauna.png", white: true },
  { from: "LOGOS/Purple and Orange Minimalist Rocket Lab Logo.png", to: "clients/a-friend-of-mine.png", white: true },
  { from: "LOGOS/ZENZI__ZENZI_MATCHA_LOGO_LIGHT_GREEN.png", to: "clients/zenzi.png", white: true },
  { from: "LOGOS/dolce-gabbana-logo-svg-vector.svg", to: "clients/dolce-gabbana.png", white: true },
  { from: "LOGOS/valentino-logo-png-transparent.png", to: "clients/valentino.png", white: true },
  { from: `${NYA}/Logo/Logo2024_White (3)-1.png`, to: "clients/lifesum.png", white: true },
  { from: `${NYA}/Logo/MINI_LOGO_WHITE.png`, to: "clients/mini.png", white: true },
];
