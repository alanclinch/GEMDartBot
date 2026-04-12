// ═══════════════════════════════════════════════════════════
//  bots.js — CPU opponents, face SVGs, and bot AI
//  Shared across all DartBot games that support CPU players.
//
//  Exports (globals):
//    CPU_PLAYERS          — array of 10 named opponents
//    makeFaceSVG(face, size)
//    humanAvatarSVG(color, size)
//    generateCpuThrow(target, mpr)
//    getAdjacentNumbers(num)
// ═══════════════════════════════════════════════════════════

// ── CPU PLAYER ROSTER ────────────────────────────────────────
// Famous dart players, history and present.
// mpr = marks-per-round; 0.9 (beginner) → 6.0 (elite)
// Consistent across all DartBot games — if Luke Littler is
// hardest in Cricket, he is hardest in Demolition too.
const CPU_PLAYERS = [
  { id:'cpu0', name:'Wayne Jones',        mpr:0.9, face:{skin:'#e8c090',hair:'#1a1a1a',eyes:'#3a2010',mouth:'neutral',style:'short'}},
  { id:'cpu1', name:'Ted Hankey',         mpr:1.4, face:{skin:'#f5d0a8',hair:'#222222',eyes:'#224433',mouth:'grin',   style:'bald'}},
  { id:'cpu2', name:'Andy Fordham',       mpr:1.9, face:{skin:'#fcd5a8',hair:'#663300',eyes:'#442200',mouth:'smile',  style:'messy'}},
  { id:'cpu3', name:'Dennis Priestley',   mpr:2.4, face:{skin:'#e8b880',hair:'#111111',eyes:'#1a1a3a',mouth:'neutral',style:'short'}},
  { id:'cpu4', name:'Martin Adams',       mpr:2.9, face:{skin:'#f0c890',hair:'#aaaaaa',eyes:'#335500',mouth:'smile',  style:'short'}},
  { id:'cpu5', name:'John Lowe',          mpr:3.4, face:{skin:'#fce8c8',hair:'#999999',eyes:'#334455',mouth:'neutral',style:'bald'}},
  { id:'cpu6', name:'Eric Bristow',       mpr:3.9, face:{skin:'#e8b070',hair:'#553311',eyes:'#334433',mouth:'smirk', style:'slick'}},
  { id:'cpu7', name:'Gary Anderson',      mpr:4.5, face:{skin:'#f0c080',hair:'#777777',eyes:'#336699',mouth:'smile',  style:'short'}},
  { id:'cpu8', name:'Michael van Gerwen', mpr:5.2, face:{skin:'#ffe8d0',hair:'#111111',eyes:'#113300',mouth:'smirk', style:'bald'}},
  { id:'cpu9', name:'Luke Littler',       mpr:6.0, face:{skin:'#ffd8b0',hair:'#111111',eyes:'#113355',mouth:'smile',  style:'short'}},
];

// ── FACE SVG GENERATOR ───────────────────────────────────────
function makeFaceSVG(f, size = 50) {
  const s = size, cx = s / 2, cy = s / 2, r = s * 0.42;

  let hair = '';
  if (f.style === 'messy') {
    hair = `<ellipse cx="${cx}" cy="${cy-r*.7}" rx="${r*.85}" ry="${r*.55}" fill="${f.hair}" opacity=".9"/>
      <path d="M${cx-r*.7},${cy-r*.4} Q${cx-r*.9},${cy-r*.9} ${cx-r*.5},${cy-r*.85}" stroke="${f.hair}" stroke-width="${s*.06}" fill="none"/>
      <path d="M${cx+r*.5},${cy-r*.5} Q${cx+r*.85},${cy-r*.85} ${cx+r*.6},${cy-r*.3}" stroke="${f.hair}" stroke-width="${s*.06}" fill="none"/>`;
  } else if (f.style === 'bob') {
    hair = `<ellipse cx="${cx}" cy="${cy-r*.6}" rx="${r*.88}" ry="${r*.6}" fill="${f.hair}" opacity=".95"/>
      <rect x="${cx-r*.88}" y="${cy-r*.1}" width="${r*1.76}" height="${r*.35}" fill="${f.hair}" rx="${r*.1}"/>`;
  } else if (f.style === 'long') {
    hair = `<ellipse cx="${cx}" cy="${cy-r*.6}" rx="${r*.85}" ry="${r*.58}" fill="${f.hair}"/>
      <rect x="${cx-r*.8}" y="${cy-r*.2}" width="${r*.35}" height="${r*1.1}" fill="${f.hair}" rx="${r*.1}"/>
      <rect x="${cx+r*.45}" y="${cy-r*.2}" width="${r*.35}" height="${r*1.1}" fill="${f.hair}" rx="${r*.1}"/>`;
  } else if (f.style === 'slick') {
    hair = `<ellipse cx="${cx}" cy="${cy-r*.65}" rx="${r*.85}" ry="${r*.52}" fill="${f.hair}"/>
      <path d="M${cx-r*.8},${cy-r*.45} Q${cx-r*.2},${cy-r*.9} ${cx+r*.7},${cy-r*.55}" stroke="${f.hair}" stroke-width="${s*.04}" fill="none"/>`;
  } else if (f.style === 'bald') {
    hair = `<ellipse cx="${cx}" cy="${cy-r*.7}" rx="${r*.82}" ry="${r*.45}" fill="${f.hair}" opacity=".5"/>`;
  } else { // short
    hair = `<ellipse cx="${cx}" cy="${cy-r*.65}" rx="${r*.83}" ry="${r*.5}" fill="${f.hair}"/>`;
  }

  const my = cy + r * 0.32;
  let mouth = '';
  if (f.mouth === 'smile')   mouth = `<path d="M${cx-r*.3},${my} Q${cx},${my+r*.25} ${cx+r*.3},${my}" stroke="#4a1a00" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>`;
  else if (f.mouth === 'grin')  mouth = `<path d="M${cx-r*.35},${my} Q${cx},${my+r*.32} ${cx+r*.35},${my}" stroke="#4a1a00" stroke-width="${s*.03}" fill="#cc3333" stroke-linecap="round"/>`;
  else if (f.mouth === 'smirk') mouth = `<path d="M${cx-r*.1},${my+r*.05} Q${cx+r*.15},${my-r*.05} ${cx+r*.32},${my+r*.1}" stroke="#4a1a00" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>`;
  else if (f.mouth === 'sad')   mouth = `<path d="M${cx-r*.3},${my+r*.12} Q${cx},${my-r*.1} ${cx+r*.3},${my+r*.12}" stroke="#4a1a00" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>`;
  else if (f.mouth === 'flat')  mouth = `<line x1="${cx-r*.28}" y1="${my+r*.05}" x2="${cx+r*.28}" y2="${my+r*.05}" stroke="#334433" stroke-width="${s*.025}" stroke-linecap="round"/>`;
  else                          mouth = `<line x1="${cx-r*.25}" y1="${my}" x2="${cx+r*.25}" y2="${my}" stroke="#4a1a00" stroke-width="${s*.025}" stroke-linecap="round"/>`;

  const eby = cy - r * 0.15;
  const brows = `<path d="M${cx-r*.38},${eby-r*.07} Q${cx-r*.18},${eby-r*.14} ${cx-r*.02},${eby-r*.07}" stroke="${f.hair}" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>
    <path d="M${cx+r*.02},${eby-r*.07} Q${cx+r*.18},${eby-r*.14} ${cx+r*.38},${eby-r*.07}" stroke="${f.hair}" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>`;
  const nose = `<path d="M${cx},${cy} L${cx-r*.1},${cy+r*.18} Q${cx},${cy+r*.22} ${cx+r*.1},${cy+r*.18}" stroke="${f.skin}" stroke-width="${s*.02}" fill="none" opacity=".6"/>`;

  return `<svg viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${f.skin}"/>
    ${hair}
    <ellipse cx="${cx-r*.27}" cy="${cy-r*.08}" rx="${r*.13}" ry="${r*.1}" fill="white"/>
    <circle  cx="${cx-r*.27}" cy="${cy-r*.08}" r="${r*.07}" fill="${f.eyes}"/>
    <circle  cx="${cx-r*.24}" cy="${cy-r*.11}" r="${r*.025}" fill="white"/>
    <ellipse cx="${cx+r*.27}" cy="${cy-r*.08}" rx="${r*.13}" ry="${r*.1}" fill="white"/>
    <circle  cx="${cx+r*.27}" cy="${cy-r*.08}" r="${r*.07}" fill="${f.eyes}"/>
    <circle  cx="${cx+r*.30}" cy="${cy-r*.11}" r="${r*.025}" fill="white"/>
    ${brows}${nose}${mouth}
  </svg>`;
}

// Simple coloured silhouette for human players
function humanAvatarSVG(color, size = 34) {
  const s = size, cx = s / 2, cy = s / 2, r = s * 0.42;
  return `<svg viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity=".2"/>
    <circle cx="${cx}" cy="${cy-r*.2}" r="${r*.38}" fill="${color}" opacity=".8"/>
    <ellipse cx="${cx}" cy="${cy+r*.75}" rx="${r*.5}" ry="${r*.3}" fill="${color}" opacity=".5"/>
  </svg>`;
}

// ── CPU THROW GENERATOR ──────────────────────────────────────
// Produces a fake segment object simulating a throw at `target`
// with accuracy scaled by `mpr` (0.9 = beginner, 6.0 = elite).
//
// Core maths (same as before — guarantees E[marks/dart] = mpr/3):
//   accuracy    = (mpr - 0.9) / 5.1                 → 0..1
//   singleFrac  = 0.70 - accuracy × 0.60  (min 0.10)
//   doubleFrac  = 0.15 + accuracy × 0.05
//   tripleFrac  = 1 - singleFrac - doubleFrac
//   scoringChance = (mpr/3) / avgMarks               → P(dart scores a mark)
//
// Three modifiers applied on top (all preserve long-run MPR):
//
//   opts.roundForm   (default 1.0) — per-round hot/cold factor, caller
//                    draws once per turn from a range centred at 1.0.
//                    Wider range for low-skill bots (more streaky).
//
//   opts.missStreak  (default 0) — consecutive non-cricket darts so far.
//                    Each miss adds a tiny recovery bonus (self-correcting;
//                    resets to 0 on any cricket hit).
//
//   opts.prevSeg     (default null) — segment object from the previous dart
//                    in the same turn. If that dart landed in the same tight
//                    bed (treble or bull), apply a clustering penalty — a dart
//                    already there physically blocks the same spot.
//
function generateCpuThrow(target, mpr, opts) {
  opts = opts || {};
  const prevSeg    = opts.prevSeg    || null;
  const missStreak = opts.missStreak || 0;
  const roundForm  = opts.roundForm  || 1.0;

  const accuracy = (mpr - 0.9) / 5.1;

  // ── Distribution fractions (scoring darts only) ──
  let singleFrac = Math.max(0.70 - accuracy * 0.60, 0.10);
  let doubleFrac = 0.15 + accuracy * 0.05;
  let tripleFrac = 1 - singleFrac - doubleFrac;

  // ── Clustering: shift away from the crowded bed ──
  // If the previous dart in this turn hit the same target's treble (or bull),
  // a dart is already in that tiny area — shift probability toward singles.
  const clusterHit = prevSeg && prevSeg.number === target &&
    (prevSeg.bed === 'Triple' || (target === 25 && prevSeg.bed === 'Single'));
  if (clusterHit) {
    const shift = 0.12 - accuracy * 0.10; // 0.12 beginner → 0.02 elite
    if (target !== 25) {
      // Treble clustering: move triple → single
      tripleFrac = Math.max(0, tripleFrac - shift);
      singleFrac = Math.min(0.95, singleFrac + shift);
    } else {
      // Bull clustering: reduce both hit beds, spread to adj/miss
      doubleFrac = Math.max(0, doubleFrac - shift * 0.5);
      singleFrac = Math.max(0, singleFrac - shift * 0.5);
    }
    const tot = tripleFrac + doubleFrac + singleFrac;
    if (tot > 0) { tripleFrac /= tot; doubleFrac /= tot; singleFrac /= tot; }
  }

  const avgMarks = tripleFrac * 3 + doubleFrac * 2 + singleFrac * 1;

  // ── Base scoring chance from target MPR ──
  let scoringChance = (mpr / 3) / avgMarks;

  // ── Round form: hot/cold variance ──
  scoringChance *= roundForm;

  // ── Miss momentum: consecutive wasted darts raise next-dart chance ──
  // Self-correcting: as soon as a dart hits, missStreak resets to 0.
  const maxBonus = 0.20 - accuracy * 0.12; // 0.20 beginner, 0.08 elite
  scoringChance += Math.min(missStreak * 0.04, maxBonus);

  // ── Overall clustering reduction (dart physically in the way) ──
  if (clusterHit) scoringChance *= (1 - (0.06 - accuracy * 0.05));

  scoringChance = Math.max(0, Math.min(0.95, scoringChance));

  const tripleChance = scoringChance * tripleFrac;
  const doubleChance = scoringChance * doubleFrac;
  const singleChance = scoringChance * singleFrac;
  const adjChance    = 0.15 - accuracy * 0.09;  // 0.15 → 0.06
  const missChance   = 0.08 - accuracy * 0.07;  // 0.08 → 0.01
  // remainder = wasted dart on non-cricket number

  const r = Math.random();
  let num, mul;

  if (r < tripleChance) {
    // Treble — or inner bull (2 marks) for target 25
    num = target;
    mul = target === 25 ? 2 : 3;
  } else if (r < tripleChance + doubleChance) {
    // Double — or outer bull (1 mark) for target 25
    num = target;
    mul = target === 25 ? 1 : 2;
  } else if (r < tripleChance + doubleChance + singleChance) {
    num = target;
    mul = 1;
  } else if (r < tripleChance + doubleChance + singleChance + adjChance) {
    const adj = getAdjacentNumbers(target);
    num = adj[Math.floor(Math.random() * adj.length)];
    mul = 1;
  } else if (r < tripleChance + doubleChance + singleChance + adjChance + missChance) {
    return null;
  } else {
    const nonCricket = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    num = nonCricket[Math.floor(Math.random() * nonCricket.length)];
    mul = 1;
    return { name:`${num}`, number:num, multiplier:mul, bed:'SingleOuter' };
  }

  const bedMap  = { 1:'SingleOuter', 2:'Double', 3:'Triple' };
  const nameMap = { 1:'S', 2:'D', 3:'T' };
  return {
    name:       num === 25 ? (mul === 2 ? 'D25' : 'B25') : `${nameMap[mul]}${num}`,
    number:     num,
    multiplier: mul,
    bed:        num === 25 ? 'Single' : bedMap[mul],
  };
}

// Returns the two numbers adjacent to `num` on the physical dartboard
function getAdjacentNumbers(num) {
  const ring = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
  const i = ring.indexOf(num);
  if (i < 0) return [20, 19];
  return [ring[(i - 1 + 20) % 20], ring[(i + 1) % 20]];
}
