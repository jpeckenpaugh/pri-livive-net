import { renderPaperDollSvg } from './paper_doll.js';

function findById(list, id) {
  return (list || []).find((item) => item.id === id) || (list && list[0]) || null;
}

function renderSkyWindows(theme) {
  const skyTop = theme?.skyTop || '#1E1B4B';
  const skyBottom = theme?.skyBottom || '#4338CA';
  const windowGlow = theme?.windowGlow || '#FEF08A';
  const trim = theme?.wallTrim || '#D8B4FE';

  let skyDetails = '';
  if (theme?.id === 'starlight-night') {
    skyDetails = `
      <circle cx="135" cy="115" r="14" fill="${windowGlow}" opacity="0.9"/>
      <circle cx="141" cy="111" r="11" fill="${skyTop}"/>
      <circle cx="105" cy="145" r="2.5" fill="#FFF"/>
      <circle cx="150" cy="160" r="2" fill="#FFF"/>
      <circle cx="500" cy="120" r="2.5" fill="#FFF"/>
      <circle cx="535" cy="145" r="3" fill="#FEF08A"/>
      <circle cx="485" cy="165" r="2" fill="#FFF"/>
    `;
  } else if (theme?.id === 'crystal-ice') {
    skyDetails = `
      <path d="M90 150 Q125 110 160 140" stroke="#E0F2FE" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round"/>
      <path d="M475 140 Q515 105 550 145" stroke="#E0F2FE" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round"/>
      <circle cx="120" cy="120" r="3" fill="#FFF"/>
      <circle cx="515" cy="125" r="3" fill="#FFF"/>
    `;
  } else {
    skyDetails = `
      <circle cx="125" cy="175" r="22" fill="${windowGlow}" opacity="0.75"/>
      <circle cx="515" cy="175" r="22" fill="${windowGlow}" opacity="0.75"/>
    `;
  }

  return `
    <g class="ballroom-windows">
      <defs>
        <linearGradient id="ballroom-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyTop}"/>
          <stop offset="100%" stop-color="${skyBottom}"/>
        </linearGradient>
      </defs>
      <!-- Left Arch Window -->
      <path d="M80 265 L80 135 A45 45 0 0 1 170 135 L170 265 Z" fill="url(#ballroom-sky-grad)" stroke="${trim}" stroke-width="6"/>
      <!-- Right Arch Window -->
      <path d="M470 265 L470 135 A45 45 0 0 1 560 135 L560 265 Z" fill="url(#ballroom-sky-grad)" stroke="${trim}" stroke-width="6"/>
      ${skyDetails}
      <!-- Window Mullions -->
      <line x1="125" y1="90" x2="125" y2="265" stroke="${trim}" stroke-width="3" opacity="0.8"/>
      <line x1="80" y1="185" x2="170" y2="185" stroke="${trim}" stroke-width="3" opacity="0.8"/>
      <line x1="515" y1="90" x2="515" y2="265" stroke="${trim}" stroke-width="3" opacity="0.8"/>
      <line x1="470" y1="185" x2="560" y2="185" stroke="${trim}" stroke-width="3" opacity="0.8"/>
    </g>
  `;
}

function renderFloor(floorId) {
  if (floorId === 'starry-dance-floor') {
    return `
      <g class="ballroom-floor" data-floor="starry-dance-floor">
        <polygon points="0,335 640,335 640,520 0,520" fill="#1E1B4B"/>
        <polygon points="150,335 490,335 580,520 60,520" fill="#312E81" opacity="0.85"/>
        <circle cx="190" cy="400" r="3" fill="#FDE047"/>
        <circle cx="450" cy="405" r="3.5" fill="#FDE047"/>
        <circle cx="130" cy="465" r="4" fill="#FEF08A"/>
        <circle cx="510" cy="470" r="3" fill="#FEF08A"/>
        <circle cx="320" cy="495" r="3.5" fill="#FDE047"/>
        <path d="M230 375 L234 383 L242 385 L234 387 L230 395 L226 387 L218 385 L226 383 Z" fill="#FDE047" opacity="0.8"/>
        <path d="M415 440 L419 448 L427 450 L419 452 L415 460 L411 452 L403 450 L411 448 Z" fill="#FDE047" opacity="0.8"/>
      </g>
    `;
  }

  if (floorId === 'rose-petal-aisle') {
    return `
      <g class="ballroom-floor" data-floor="rose-petal-aisle">
        <polygon points="0,335 640,335 640,520 0,520" fill="#FDF2F8"/>
        <polygon points="220,335 420,335 490,520 150,520" fill="#FCE7F3" stroke="#F9A8D4" stroke-width="2"/>
        <ellipse cx="185" cy="420" rx="8" ry="4" fill="#F472B6" transform="rotate(-20 185 420)"/>
        <ellipse cx="455" cy="435" rx="9" ry="4.5" fill="#FB7185" transform="rotate(25 455 435)"/>
        <ellipse cx="215" cy="480" rx="7" ry="3.5" fill="#F472B6" transform="rotate(15 215 480)"/>
        <ellipse cx="425" cy="475" rx="8" ry="4" fill="#F43F5E" transform="rotate(-15 425 475)"/>
        <ellipse cx="140" cy="465" rx="7" ry="4" fill="#F9A8D4" transform="rotate(35 140 465)"/>
        <ellipse cx="500" cy="460" rx="8" ry="4" fill="#F472B6" transform="rotate(-30 500 460)"/>
      </g>
    `;
  }

  // Default: marble-red-carpet
  return `
    <g class="ballroom-floor" data-floor="marble-red-carpet">
      <polygon points="0,335 640,335 640,520 0,520" fill="#FAF5FF"/>
      <line x1="0" y1="395" x2="640" y2="395" stroke="#E9D5FF" stroke-width="2"/>
      <line x1="0" y1="455" x2="640" y2="455" stroke="#E9D5FF" stroke-width="2"/>
      <polygon points="235,335 405,335 465,520 175,520" fill="#E11D48"/>
      <polygon points="245,335 395,335 450,520 190,520" fill="none" stroke="#FBBF24" stroke-width="3"/>
    </g>
  `;
}

function renderDecor(decorId) {
  const pillars = `
    <rect x="28" y="85" width="34" height="260" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
    <rect x="22" y="75" width="46" height="14" rx="4" fill="#E2E8F0"/>
    <rect x="22" y="335" width="46" height="14" rx="4" fill="#E2E8F0"/>
    <rect x="578" y="85" width="34" height="260" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
    <rect x="572" y="75" width="46" height="14" rx="4" fill="#E2E8F0"/>
    <rect x="572" y="335" width="46" height="14" rx="4" fill="#E2E8F0"/>
  `;

  if (decorId === 'lily-vases') {
    return `
      <g class="ballroom-decor" data-decor="lily-vases">
        ${pillars}
        <!-- Left Urn -->
        <path d="M85 350 L115 350 L108 325 L92 325 Z" fill="#FBBF24" stroke="#D97706" stroke-width="2"/>
        <circle cx="92" cy="316" r="9" fill="#FFF" stroke="#F9A8D4" stroke-width="2"/>
        <circle cx="108" cy="316" r="9" fill="#FFF" stroke="#F9A8D4" stroke-width="2"/>
        <circle cx="100" cy="306" r="10" fill="#FDF4FF" stroke="#E879F9" stroke-width="2"/>
        <!-- Right Urn -->
        <path d="M525 350 L555 350 L548 325 L532 325 Z" fill="#FBBF24" stroke="#D97706" stroke-width="2"/>
        <circle cx="532" cy="316" r="9" fill="#FFF" stroke="#F9A8D4" stroke-width="2"/>
        <circle cx="548" cy="316" r="9" fill="#FFF" stroke="#F9A8D4" stroke-width="2"/>
        <circle cx="540" cy="306" r="10" fill="#FDF4FF" stroke="#E879F9" stroke-width="2"/>
      </g>
    `;
  }

  if (decorId === 'glowing-columns') {
    return `
      <g class="ballroom-decor" data-decor="glowing-columns">
        ${pillars}
        <circle cx="45" cy="145" r="24" fill="#FEF08A" opacity="0.35"/>
        <circle cx="45" cy="235" r="24" fill="#FEF08A" opacity="0.35"/>
        <circle cx="595" cy="145" r="24" fill="#FEF08A" opacity="0.35"/>
        <circle cx="595" cy="235" r="24" fill="#FEF08A" opacity="0.35"/>
        <circle cx="45" cy="145" r="6" fill="#FDE047"/>
        <circle cx="45" cy="235" r="6" fill="#FDE047"/>
        <circle cx="595" cy="145" r="6" fill="#FDE047"/>
        <circle cx="595" cy="235" r="6" fill="#FDE047"/>
      </g>
    `;
  }

  // Default: rose-garlands
  return `
    <g class="ballroom-decor" data-decor="rose-garlands">
      ${pillars}
      <path d="M30 120 Q58 155 32 190 Q58 225 32 260 Q58 295 34 330" fill="none" stroke="#34D399" stroke-width="4"/>
      <circle cx="45" cy="145" r="7" fill="#F472B6"/>
      <circle cx="38" cy="205" r="7" fill="#FB7185"/>
      <circle cx="48" cy="270" r="7" fill="#F472B6"/>
      <path d="M610 120 Q582 155 608 190 Q582 225 608 260 Q582 295 606 330" fill="none" stroke="#34D399" stroke-width="4"/>
      <circle cx="595" cy="145" r="7" fill="#F472B6"/>
      <circle cx="602" cy="205" r="7" fill="#FB7185"/>
      <circle cx="592" cy="270" r="7" fill="#F472B6"/>
    </g>
  `;
}

function renderBanners(styleId, colorObj) {
  const hex = colorObj?.hex || '#F472B6';
  const shade = colorObj?.shade || '#DB2777';

  if (styleId === 'velvet-curtains') {
    return `
      <g class="ballroom-banners" data-banner-style="velvet-curtains">
        <path d="M0 0 L95 0 Q75 160 40 335 L0 335 Z" fill="${hex}" stroke="${shade}" stroke-width="3"/>
        <path d="M640 0 L545 0 Q565 160 600 335 L640 335 Z" fill="${hex}" stroke="${shade}" stroke-width="3"/>
        <path d="M95 0 Q320 65 545 0 L545 26 Q320 90 95 26 Z" fill="${shade}"/>
      </g>
    `;
  }

  if (styleId === 'heart-pennants') {
    const xs = [90, 165, 240, 400, 475, 550];
    const pennants = xs
      .map(
        (x) => `
      <polygon points="${x - 24},38 ${x + 24},38 ${x},82" fill="${hex}" stroke="${shade}" stroke-width="2"/>
      <circle cx="${x}" cy="54" r="6" fill="#FFF" opacity="0.85"/>
    `
      )
      .join('');
    return `
      <g class="ballroom-banners" data-banner-style="heart-pennants">
        <path d="M40 38 Q320 60 600 38" fill="none" stroke="${shade}" stroke-width="4"/>
        ${pennants}
      </g>
    `;
  }

  // Default: royal-swags
  return `
    <g class="ballroom-banners" data-banner-style="royal-swags">
      <path d="M20 20 Q120 95 220 20 Q320 95 420 20 Q520 95 620 20 L620 0 L20 0 Z" fill="${hex}" stroke="${shade}" stroke-width="3"/>
      <circle cx="220" cy="22" r="7" fill="#FBBF24"/>
      <circle cx="420" cy="22" r="7" fill="#FBBF24"/>
    </g>
  `;
}

function renderChandelier(chandelierId) {
  if (chandelierId === 'golden-candelabra') {
    return `
      <g class="ballroom-chandelier" data-chandelier="golden-candelabra">
        <line x1="320" y1="0" x2="320" y2="55" stroke="#D97706" stroke-width="4"/>
        <path d="M255 75 Q320 110 385 75" fill="none" stroke="#FBBF24" stroke-width="6" stroke-linecap="round"/>
        <rect x="252" y="55" width="8" height="22" rx="2" fill="#FFFBEB"/>
        <rect x="316" y="50" width="8" height="28" rx="2" fill="#FFFBEB"/>
        <rect x="380" y="55" width="8" height="22" rx="2" fill="#FFFBEB"/>
        <circle cx="256" cy="49" r="5" fill="#FDE047"/>
        <circle cx="320" cy="44" r="6" fill="#FDE047"/>
        <circle cx="384" cy="49" r="5" fill="#FDE047"/>
      </g>
    `;
  }

  if (chandelierId === 'fairy-lanterns') {
    return `
      <g class="ballroom-chandelier" data-chandelier="fairy-lanterns">
        <line x1="250" y1="0" x2="250" y2="62" stroke="#C084FC" stroke-width="2"/>
        <line x1="320" y1="0" x2="320" y2="48" stroke="#F472B6" stroke-width="2"/>
        <line x1="390" y1="0" x2="390" y2="62" stroke="#60A5FA" stroke-width="2"/>
        <circle cx="250" cy="74" r="14" fill="#F3E8FF" stroke="#C084FC" stroke-width="3"/>
        <circle cx="320" cy="62" r="16" fill="#FCE7F3" stroke="#F472B6" stroke-width="3"/>
        <circle cx="390" cy="74" r="14" fill="#E0F2FE" stroke="#60A5FA" stroke-width="3"/>
        <circle cx="250" cy="74" r="6" fill="#FEF08A"/>
        <circle cx="320" cy="62" r="7" fill="#FEF08A"/>
        <circle cx="390" cy="74" r="6" fill="#FEF08A"/>
      </g>
    `;
  }

  // Default: crystal-chandelier
  return `
    <g class="ballroom-chandelier" data-chandelier="crystal-chandelier">
      <line x1="320" y1="0" x2="320" y2="42" stroke="#94A3B8" stroke-width="4"/>
      <ellipse cx="320" cy="58" rx="68" ry="14" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="3"/>
      <ellipse cx="320" cy="78" rx="44" ry="10" fill="#F0F9FF" stroke="#BAE6FD" stroke-width="2.5"/>
      <polygon points="270,68 275,92 265,92" fill="#E0F2FE"/>
      <polygon points="320,86 326,112 314,112" fill="#BAE6FD"/>
      <polygon points="370,68 375,92 365,92" fill="#E0F2FE"/>
      <circle cx="285" cy="54" r="5" fill="#FEF08A"/>
      <circle cx="320" cy="52" r="6" fill="#FEF08A"/>
      <circle cx="355" cy="54" r="5" fill="#FEF08A"/>
    </g>
  `;
}

export const PRINCE_OUTFIT_COLORS = [
  { id: 'royal-blue', label: 'Royal Blue', primary: '#2563EB', dark: '#1E40AF', sash: '#FACC15' },
  { id: 'crimson', label: 'Crimson', primary: '#DC2626', dark: '#991B1B', sash: '#FDE047' },
  { id: 'emerald', label: 'Emerald', primary: '#059669', dark: '#065F46', sash: '#FDE047' },
  { id: 'lavender', label: 'Lavender', primary: '#7C3AED', dark: '#5B21B6', sash: '#F9A8D4' },
  { id: 'gold', label: 'Royal Gold', primary: '#D97706', dark: '#92400E', sash: '#FEF08A' }
];

function renderPrinceSvg(outfitColorId, skinHex = '#FCD5B5', hairHex = '#4B2E1E') {
  const palette = findById(PRINCE_OUTFIT_COLORS, outfitColorId);
  return `
    <svg class="prince-svg" viewBox="0 0 220 340" xmlns="http://www.w3.org/2000/svg" aria-label="Royal Prince">
      <!-- Cape -->
      <path d="M72 128 Q50 220 56 290 L164 290 Q170 220 148 128 Z" fill="${palette.dark}" opacity="0.9"/>
      <!-- Legs & Boots -->
      <rect x="84" y="220" width="20" height="72" rx="8" fill="#1F2937"/>
      <rect x="116" y="220" width="20" height="72" rx="8" fill="#1F2937"/>
      <path d="M80 282 L106 282 L106 300 Q92 304 76 298 Z" fill="#111827"/>
      <path d="M114 282 L140 282 L144 298 Q128 304 114 300 Z" fill="#111827"/>
      <!-- Royal Tunic -->
      <path d="M74 128 L146 128 L154 226 Q110 236 66 226 Z" fill="${palette.primary}" stroke="#FACC15" stroke-width="2.5"/>
      <!-- Sash -->
      <path d="M82 128 L146 210 L132 220 L74 140 Z" fill="${palette.sash}" opacity="0.92"/>
      <!-- Belt & Gold Buckle -->
      <rect x="70" y="196" width="80" height="10" rx="4" fill="#111827"/>
      <rect x="102" y="194" width="16" height="14" rx="3" fill="#FACC15"/>
      <!-- Arms -->
      <path d="M74 134 Q52 165 62 195" fill="none" stroke="${palette.primary}" stroke-width="15" stroke-linecap="round"/>
      <circle cx="62" cy="197" r="7" fill="${skinHex}"/>
      <path d="M146 134 Q168 165 158 195" fill="none" stroke="${palette.primary}" stroke-width="15" stroke-linecap="round"/>
      <circle cx="158" cy="197" r="7" fill="${skinHex}"/>
      <!-- Neck & Head -->
      <rect x="101" y="106" width="18" height="24" rx="6" fill="${skinHex}"/>
      <ellipse cx="110" cy="84" rx="28" ry="31" fill="${skinHex}"/>
      <!-- Hair -->
      <path d="M82 80 Q82 48 110 48 Q138 48 138 80 Q130 64 110 64 Q90 64 82 80 Z" fill="${hairHex}"/>
      <!-- Eyes & Smile -->
      <circle cx="99" cy="84" r="3.2" fill="#1F2937"/>
      <circle cx="121" cy="84" r="3.2" fill="#1F2937"/>
      <path d="M101 97 Q110 104 119 97" fill="none" stroke="#B45309" stroke-width="2.4" stroke-linecap="round"/>
      <!-- Royal Crown -->
      <path d="M86 55 L92 34 L103 46 L110 30 L117 46 L128 34 L134 55 Z" fill="#FACC15" stroke="#B45309" stroke-width="2"/>
      <circle cx="110" cy="44" r="3.5" fill="#EF4444"/>
    </svg>
  `;
}

function renderDancingNotes() {
  return `
    <g class="ballroom-music-notes" aria-hidden="true">
      <text x="195" y="175" font-size="24" fill="#FACC15" class="music-note note-1">♪</text>
      <text x="425" y="160" font-size="26" fill="#F472B6" class="music-note note-2">♫</text>
      <text x="315" y="135" font-size="22" fill="#A78BFA" class="music-note note-3">♪</text>
      <text x="255" y="150" font-size="18" fill="#FDE047" class="music-note note-4">✦</text>
      <text x="380" y="145" font-size="18" fill="#F9A8D4" class="music-note note-5">✦</text>
    </g>
  `;
}

export function renderBallroomSvg(ballroomState, ballroomConfig, princessState, princessConfig) {
  const skyTheme = findById(ballroomConfig?.skyThemes, ballroomState?.skyTheme);
  const chandelier = findById(ballroomConfig?.chandeliers, ballroomState?.chandelier);
  const bannerStyle = findById(ballroomConfig?.bannerStyles, ballroomState?.bannerStyle);
  const bannerColor = findById(ballroomConfig?.bannerColors, ballroomState?.bannerColor);
  const floor = findById(ballroomConfig?.floors, ballroomState?.floor);
  const decor = findById(ballroomConfig?.decors, ballroomState?.decor);
  const isDancing = Boolean(ballroomState?.dancing);
  const princeSkin = findById(princessConfig?.palettes?.skinTones, ballroomState?.princeSkinToneId);
  const princeHair = findById(princessConfig?.palettes?.hairColors, ballroomState?.princeHairColorId);
  const princeSkinHex = princeSkin?.hex || '#FCD5B5';
  const princeHairHex = princeHair?.hex || '#4B2E1E';

  const wallColor = skyTheme?.wall || '#F5EEFF';
  const princessSvg = renderPaperDollSvg(princessState, princessConfig);
  const princessSlotX = isDancing ? 120 : 180;
  const princessShadowCx = isDancing ? 260 : 320;

  return `
    <svg class="ballroom-svg${isDancing ? ' is-dancing' : ''}" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Royal Ballroom Scene">
      <!-- Ballroom Back Wall -->
      <rect x="0" y="0" width="640" height="335" fill="${wallColor}"/>
      ${renderSkyWindows(skyTheme)}
      ${renderFloor(floor?.id)}
      ${renderDecor(decor?.id)}
      ${renderBanners(bannerStyle?.id, bannerColor)}
      ${renderChandelier(chandelier?.id)}
      <!-- Composited Princess Paper-Doll -->
      <g class="ballroom-princess-slot${isDancing ? ' is-dancing' : ''}">
        <ellipse cx="${princessShadowCx}" cy="468" rx="68" ry="14" fill="#000000" opacity="0.14"/>
        <svg x="${princessSlotX}" y="135" width="280" height="350" viewBox="0 0 320 400">
          ${princessSvg}
        </svg>
      </g>
      ${
        isDancing
          ? `
      <!-- Royal Prince Dance Partner -->
      <g class="ballroom-prince-slot is-dancing" data-prince-outfit="${ballroomState?.princeOutfitColor || 'royal-blue'}" data-prince-skin="${ballroomState?.princeSkinToneId || 'peach'}" data-prince-hair="${ballroomState?.princeHairColorId || 'chestnut-brown'}">
        <ellipse cx="395" cy="468" rx="56" ry="13" fill="#000000" opacity="0.14"/>
        <svg x="285" y="148" width="220" height="340" viewBox="0 0 220 340">
          ${renderPrinceSvg(ballroomState?.princeOutfitColor, princeSkinHex, princeHairHex)}
        </svg>
      </g>
      ${renderDancingNotes()}
      `
          : ''
      }
    </svg>
  `;
}
