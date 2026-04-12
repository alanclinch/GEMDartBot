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
// mpr = marks-per-round; 0.9 (beginner) → 6.0 (machine)
const CPU_PLAYERS = [
  { id:'cpu0', name:'Danny McRae',   mpr:0.9, face:{skin:'#f5c5a0',hair:'#3a1f00',eyes:'#5a3010',mouth:'sad',    style:'messy'}},
  { id:'cpu1', name:'Wee Shuggy',    mpr:1.4, face:{skin:'#fcd5a8',hair:'#cc6600',eyes:'#224400',mouth:'grin',   style:'short'}},
  { id:'cpu2', name:'Carol Minto',   mpr:1.9, face:{skin:'#ffe0b8',hair:'#882200',eyes:'#442200',mouth:'smile',  style:'bob'}},
  { id:'cpu3', name:'Big Tam',       mpr:2.4, face:{skin:'#e8b090',hair:'#222222',eyes:'#1a3366',mouth:'neutral',style:'bald'}},
  { id:'cpu4', name:'Stevie Burns',  mpr:2.9, face:{skin:'#f0c090',hair:'#554400',eyes:'#335500',mouth:'smile',  style:'short'}},
  { id:'cpu5', name:'Nikki Sharp',   mpr:3.4, face:{skin:'#fce8c8',hair:'#111111',eyes:'#221144',mouth:'smirk', style:'long'}},
  { id:'cpu6', name:'Rev. Wallace',  mpr:3.9, face:{skin:'#d4a870',hair:'#888888',eyes:'#334433',mouth:'neutral',style:'bald'}},
  { id:'cpu7', name:'Franco Deluca', mpr:4.5, face:{skin:'#c89060',hair:'#111111',eyes:'#2a1100',mouth:'smirk', style:'slick'}},
  { id:'cpu8', name:'Sandra Cole',   mpr:5.2, face:{skin:'#ffe8d0',hair:'#660033',eyes:'#003366',mouth:'smile',  style:'bob'}},
  { id:'cpu9', name:'The Machine',   mpr:6.0, face:{skin:'#c0d8c0',hair:'#111111',eyes:'#003300',mouth:'flat',   style:'short'}},
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
// with accuracy scaled by `mpr` (0.9 = beginner, 6.0 = machine).
//
// The maths — every probability is derived from the target MPR so
// the bot actually plays at the named skill level:
//
//   accuracy        = (mpr - 0.9) / 5.1           → 0..1
//   trebleFraction  = 0.10 + accuracy × 0.65       → how much of all scoring darts are trebles
//   scoreFactor     = 2 × trebleFraction + 1        → avg marks per scoring dart (1.2 → 2.5)
//   scoringChance   = (mpr / 3) / scoreFactor       → P(dart scores any mark)
//   tripleChance    = scoringChance × trebleFraction
//   singleChance    = scoringChance × (1 - trebleFraction)
//
// This guarantees: E[marks per dart] = tripleChance×3 + singleChance×1 = mpr/3  ✓
//
// Verified for the three easiest bots (old → new marks/dart):
//   Danny McRae  0.9 MPR:  0.56 → 0.30
//   Wee Shuggy   1.4 MPR:  0.75 → 0.47
//   Carol Minto  1.9 MPR:  0.94 → 0.63
function generateCpuThrow(target, mpr) {
  const accuracy       = (mpr - 0.9) / 5.1;
  const trebleFraction = 0.10 + accuracy * 0.65;   // 0.10 (beginner) → 0.75 (machine)
  const scoreFactor    = 2 * trebleFraction + 1;    // avg marks per scoring dart
  const scoringChance  = (mpr / 3) / scoreFactor;   // P(hits target for marks)
  const tripleChance   = scoringChance * trebleFraction;
  const singleChance   = scoringChance * (1 - trebleFraction);
  const adjChance      = 0.15 - accuracy * 0.09;   // 0.15 (beginner) → 0.06 (machine)
  const missChance     = 0.08 - accuracy * 0.07;   // 0.08 (beginner) → 0.01 (machine)
  // remainder = wasted dart on non-cricket number

  const r = Math.random();
  let num, mul;

  if (r < tripleChance) {
    // Hit treble (or double bull for target 25)
    num = target;
    mul = target === 25 ? 2 : 3;
  } else if (r < tripleChance + singleChance) {
    // Hit single of target
    num = target;
    mul = 1;
  } else if (r < tripleChance + singleChance + adjChance) {
    // Hit adjacent number — almost always non-cricket (0 marks), but realistic scatter
    const adj = getAdjacentNumbers(target);
    num = adj[Math.floor(Math.random() * adj.length)];
    mul = 1;
  } else if (r < tripleChance + singleChance + adjChance + missChance) {
    // Off-board miss
    return null;
  } else {
    // Wasted dart — non-cricket number (1–14)
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
