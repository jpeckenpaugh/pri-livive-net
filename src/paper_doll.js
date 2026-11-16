function findById(list, id) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.find((item) => item.id === id) || list[0];
}

function renderWingsLayer(wingsId) {
  if (wingsId === 'fairy-wings') {
    return `<g id="layer-wings" class="doll-wings">
      <path d="M 134 196 C 72 136, 36 164, 54 216 C 68 250, 108 242, 134 222 Z" fill="rgba(202, 240, 248, 0.72)" stroke="#90E0EF" stroke-width="2"/>
      <path d="M 186 196 C 248 136, 284 164, 266 216 C 252 250, 212 242, 186 222 Z" fill="rgba(202, 240, 248, 0.72)" stroke="#90E0EF" stroke-width="2"/>
      <path d="M 134 224 C 86 238, 72 276, 98 292 C 118 300, 132 274, 138 242 Z" fill="rgba(243, 232, 255, 0.7)" stroke="#C77DFF" stroke-width="1.8"/>
      <path d="M 186 224 C 234 238, 248 276, 222 292 C 202 300, 188 274, 182 242 Z" fill="rgba(243, 232, 255, 0.7)" stroke="#C77DFF" stroke-width="1.8"/>
    </g>`;
  }
  if (wingsId === 'butterfly-wings') {
    return `<g id="layer-wings" class="doll-wings">
      <path d="M 134 196 C 62 124, 30 184, 68 232 C 92 256, 122 238, 134 218 Z" fill="rgba(255, 179, 198, 0.72)" stroke="#FF70A6" stroke-width="2"/>
      <path d="M 186 196 C 258 124, 290 184, 252 232 C 228 256, 198 238, 186 218 Z" fill="rgba(255, 179, 198, 0.72)" stroke="#FF70A6" stroke-width="2"/>
      <circle cx="84" cy="186" r="10" fill="rgba(255, 243, 176, 0.8)"/>
      <circle cx="236" cy="186" r="10" fill="rgba(255, 243, 176, 0.8)"/>
    </g>`;
  }
  return `<g id="layer-wings"></g>`;
}

function renderNecklaceLayer(necklaceId) {
  if (necklaceId === 'pearl-strand') {
    const pearls = [144, 152, 160, 168, 176]
      .map((cx, i) => `<circle cx="${cx}" cy="${178 + (i === 2 ? 4 : i === 1 || i === 3 ? 2 : 0)}" r="3.4" fill="#FFFDF9" stroke="#CBD5E1" stroke-width="0.8"/>`)
      .join('');
    return `<g id="layer-necklace">${pearls}</g>`;
  }
  if (necklaceId === 'heart-pendant') {
    return `<g id="layer-necklace">
      <path d="M 142 176 Q 160 190 178 176" fill="none" stroke="var(--tiara-metal)" stroke-width="2"/>
      <path d="M 160 194 L 154 186 A 4 4 0 0 1 160 182 A 4 4 0 0 1 166 186 Z" fill="var(--tiara-gem)" stroke="var(--tiara-metal)" stroke-width="1"/>
    </g>`;
  }
  return `<g id="layer-necklace"></g>`;
}

function renderTiaraLayer(tiaraId) {
  if (tiaraId === 'royal-crown') {
    return `<g id="layer-tiara" class="tiara-twinkle">
      <path d="M 130 74 L 136 46 L 148 60 L 160 38 L 172 60 L 184 46 L 190 74 Q 160 80 130 74 Z" fill="var(--tiara-metal)" stroke="#B7791F" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="160" cy="58" r="4.5" fill="var(--tiara-gem)"/>
      <circle cx="142" cy="64" r="3" fill="var(--tiara-gem)"/>
      <circle cx="178" cy="64" r="3" fill="var(--tiara-gem)"/>
    </g>`;
  }
  if (tiaraId === 'star-diadem') {
    return `<g id="layer-tiara" class="tiara-twinkle">
      <path d="M 126 76 Q 160 60 194 76" fill="none" stroke="var(--tiara-metal)" stroke-width="4" stroke-linecap="round"/>
      <path d="M 160 40 L 164 52 L 176 54 L 167 62 L 169 74 L 160 68 L 151 74 L 153 62 L 144 54 L 156 52 Z" fill="var(--tiara-gem)" stroke="var(--tiara-metal)" stroke-width="1.5"/>
    </g>`;
  }
  if (tiaraId === 'floral-circlet') {
    return `<g id="layer-tiara" class="tiara-twinkle">
      <path d="M 124 78 Q 160 62 196 78" fill="none" stroke="#52B788" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="140" cy="70" r="5.5" fill="var(--tiara-gem)"/>
      <circle cx="160" cy="65" r="6.5" fill="var(--tiara-metal)"/>
      <circle cx="180" cy="70" r="5.5" fill="var(--tiara-gem)"/>
    </g>`;
  }
  return `<g id="layer-tiara"></g>`;
}

function renderHandheldLayer(handheldId) {
  if (handheldId === 'star-wand') {
    return `<g id="layer-handheld" class="wand-glint">
      <line x1="230" y1="246" x2="254" y2="178" stroke="#FFD166" stroke-width="4" stroke-linecap="round"/>
      <path d="M 256 154 L 261 168 L 276 170 L 265 179 L 268 194 L 256 186 L 244 194 L 247 179 L 236 170 L 251 168 Z" fill="#FFF3B0" stroke="#FFB703" stroke-width="1.5"/>
    </g>`;
  }
  if (handheldId === 'royal-scepter') {
    return `<g id="layer-handheld" class="wand-glint">
      <line x1="230" y1="252" x2="252" y2="176" stroke="var(--tiara-metal)" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="253" cy="170" r="10" fill="var(--tiara-gem)" stroke="var(--tiara-metal)" stroke-width="2.5"/>
    </g>`;
  }
  if (handheldId === 'flower-bouquet') {
    return `<g id="layer-handheld">
      <path d="M 224 236 L 244 214 L 252 226 Z" fill="#52B788"/>
      <circle cx="242" cy="206" r="8" fill="#FF70A6"/>
      <circle cx="254" cy="212" r="7.5" fill="#FFB3C6"/>
      <circle cx="236" cy="216" r="7" fill="#FFD166"/>
    </g>`;
  }
  return `<g id="layer-handheld"></g>`;
}

function renderFaceGemsLayer(shape) {
  if (shape === 'stars') {
    return `<g id="layer-face-gems">
      <path d="M 129 124 L 131 128 L 135 129 L 132 132 L 133 136 L 129 134 L 125 136 L 126 132 L 123 129 L 127 128 Z" fill="#FFD166"/>
      <path d="M 191 124 L 193 128 L 197 129 L 194 132 L 195 136 L 191 134 L 187 136 L 188 132 L 185 129 L 189 128 Z" fill="#FFD166"/>
    </g>`;
  }
  if (shape === 'hearts') {
    return `<g id="layer-face-gems">
      <path d="M 130 133 L 126 128 A 2.5 2.5 0 0 1 130 125 A 2.5 2.5 0 0 1 134 128 Z" fill="#FF4D6D"/>
      <path d="M 190 133 L 186 128 A 2.5 2.5 0 0 1 190 125 A 2.5 2.5 0 0 1 194 128 Z" fill="#FF4D6D"/>
    </g>`;
  }
  if (shape === 'diamonds') {
    return `<g id="layer-face-gems">
      <path d="M 130 123 L 134 129 L 130 135 L 126 129 Z" fill="#72EFDD"/>
      <path d="M 190 123 L 194 129 L 190 135 L 186 129 Z" fill="#72EFDD"/>
    </g>`;
  }
  return `<g id="layer-face-gems"></g>`;
}

function renderPetAccessorySvg(accessoryId) {
  if (!accessoryId || accessoryId === 'none') return { back: '', front: '' };
  if (accessoryId === 'cape') {
    return {
      back: `<path d="M -10 4 L -22 24 Q 0 30 22 24 L 10 4 Z" fill="#E63946" stroke="#9B2226" stroke-width="1.2"/>`,
      front: `<path d="M -8 4 Q 0 8 8 4" fill="none" stroke="#FFD166" stroke-width="2" stroke-linecap="round"/>`
    };
  }
  if (accessoryId === 'bow') {
    return {
      back: '',
      front: `
        <g transform="translate(0, 6)">
          <path d="M 0 0 L -8 -4 L -8 4 Z M 0 0 L 8 -4 L 8 4 Z" fill="#FF70A6" stroke="#C9184A" stroke-width="0.9"/>
          <circle cx="0" cy="0" r="2.2" fill="#FFE5EC" stroke="#C9184A" stroke-width="0.8"/>
        </g>`
    };
  }
  if (accessoryId === 'crown') {
    return {
      back: '',
      front: `
        <g transform="translate(0, -15)">
          <path d="M -7 2 L -8 -6 L -3 -2 L 0 -8 L 3 -2 L 8 -6 L 7 2 Z" fill="#FFD166" stroke="#B5830E" stroke-width="1"/>
          <circle cx="0" cy="-2" r="1.4" fill="#FF4D6D"/>
        </g>`
    };
  }
  if (accessoryId === 'scarf') {
    return {
      back: '',
      front: `
        <g transform="translate(0, 5)">
          <rect x="-11" y="-2.5" width="22" height="5" rx="2.5" fill="#56CFE1" stroke="#0077B6" stroke-width="0.9"/>
          <path d="M 4 1 L 8 11 L 12 10 L 8 0 Z" fill="#56CFE1" stroke="#0077B6" stroke-width="0.9"/>
        </g>`
    };
  }
  if (accessoryId === 'glasses') {
    return {
      back: '',
      front: `
        <g transform="translate(0, -3.5)">
          <circle cx="-4.5" cy="0" r="3.8" fill="rgba(202,240,248,0.45)" stroke="#2B2D42" stroke-width="1.2"/>
          <circle cx="4.5" cy="0" r="3.8" fill="rgba(202,240,248,0.45)" stroke="#2B2D42" stroke-width="1.2"/>
          <line x1="-0.7" y1="0" x2="0.7" y2="0" stroke="#2B2D42" stroke-width="1.2"/>
        </g>`
    };
  }
  return { back: '', front: '' };
}

export function renderPetSvg(petId, petName = '', x = 72, y = 348, petOptions = {}) {
  if (!petId || petId === 'none') return '';
  const safeName = String(petName || '').trim().slice(0, 20);
  const { petColor = '', petAccessoryId = 'none' } = petOptions || {};
  const customFill = typeof petColor === 'string' && petColor.trim() ? petColor.trim() : '';
  let body = '';
  if (petId === 'puppy') {
    const bodyFill = customFill || '#E6B88A';
    const headFill = customFill || '#F2CC8F';
    body = `
      <ellipse cx="0" cy="14" rx="16" ry="12" fill="${bodyFill}" stroke="#8D5B4C" stroke-width="1.4"/>
      <circle cx="0" cy="-2" r="13" fill="${headFill}" stroke="#8D5B4C" stroke-width="1.4"/>
      <ellipse cx="-11" cy="-2" rx="4.5" ry="9" fill="#B57B50" transform="rotate(14 -11 -2)"/>
      <ellipse cx="11" cy="-2" rx="4.5" ry="9" fill="#B57B50" transform="rotate(-14 11 -2)"/>
      <circle cx="-4.5" cy="-4" r="2.2" fill="#2B2D42"/>
      <circle cx="4.5" cy="-4" r="2.2" fill="#2B2D42"/>
      <ellipse cx="0" cy="1" rx="3" ry="2.2" fill="#2B2D42"/>
      <path d="M -5 -15 L 0 -22 L 5 -15 Z" fill="#FFD166" stroke="#8D5B4C" stroke-width="1"/>
    `;
  } else if (petId === 'kitten') {
    const bodyFill = customFill || '#F5D0C5';
    const headFill = customFill || '#FFE5D9';
    body = `
      <ellipse cx="0" cy="14" rx="14" ry="11" fill="${bodyFill}" stroke="#8D5B4C" stroke-width="1.4"/>
      <path d="M 12 16 Q 24 6 20 -4" fill="none" stroke="${bodyFill}" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="0" cy="-2" r="12" fill="${headFill}" stroke="#8D5B4C" stroke-width="1.4"/>
      <path d="M -10 -10 L -13 -21 L -3 -13 Z" fill="${bodyFill}" stroke="#8D5B4C" stroke-width="1.2"/>
      <path d="M 10 -10 L 13 -21 L 3 -13 Z" fill="${bodyFill}" stroke="#8D5B4C" stroke-width="1.2"/>
      <circle cx="-4" cy="-3" r="2" fill="#2B2D42"/>
      <circle cx="4" cy="-3" r="2" fill="#2B2D42"/>
      <circle cx="0" cy="1" r="1.8" fill="#FF70A6"/>
    `;
  } else if (petId === 'dragon') {
    const bodyFill = customFill || '#7AE582';
    const headFill = customFill || '#9EF01A';
    body = `
      <path d="M -10 2 L -22 -12 L -8 -6 Z" fill="#C77DFF" opacity="0.85"/>
      <path d="M 10 2 L 22 -12 L 8 -6 Z" fill="#C77DFF" opacity="0.85"/>
      <ellipse cx="0" cy="14" rx="15" ry="12" fill="${bodyFill}" stroke="#2D6A4F" stroke-width="1.4"/>
      <circle cx="0" cy="-2" r="12.5" fill="${headFill}" stroke="#2D6A4F" stroke-width="1.4"/>
      <path d="M -6 -13 L -9 -22 L -2 -14 Z" fill="#FFD166"/>
      <path d="M 6 -13 L 9 -22 L 2 -14 Z" fill="#FFD166"/>
      <circle cx="-4" cy="-3" r="2.2" fill="#2B2D42"/>
      <circle cx="4" cy="-3" r="2.2" fill="#2B2D42"/>
    `;
  } else if (petId === 'seahorse') {
    const bodyFill = customFill || '#48CAE4';
    const headFill = customFill || '#90E0EF';
    body = `
      <path d="M 0 -16 C 12 -16, 14 -2, 6 6 C 0 12, 12 20, 4 26 C -4 30, -10 22, -4 18" fill="none" stroke="${bodyFill}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="1" cy="-10" r="8.5" fill="${headFill}" stroke="#0077B6" stroke-width="1.3"/>
      <path d="M 8 -10 L 16 -8 L 8 -6 Z" fill="${headFill}" stroke="#0077B6" stroke-width="1"/>
      <circle cx="3" cy="-12" r="1.8" fill="#2B2D42"/>
      <path d="M -8 -2 L -16 -6 L -12 4 Z" fill="#CAF0F8" opacity="0.85"/>
    `;
  } else {
    // unicorn
    const bodyFill = customFill || '#FFF0F3';
    const headFill = customFill || '#FFFFFF';
    body = `
      <ellipse cx="0" cy="14" rx="16" ry="11" fill="${bodyFill}" stroke="#A06CD5" stroke-width="1.4"/>
      <circle cx="0" cy="-2" r="12" fill="${headFill}" stroke="#A06CD5" stroke-width="1.4"/>
      <path d="M -2 -13 L 0 -26 L 3 -13 Z" fill="#FFD166" stroke="#C77DFF" stroke-width="1"/>
      <path d="M -10 -8 Q -15 0 -11 6" fill="none" stroke="#FF70A6" stroke-width="4" stroke-linecap="round"/>
      <circle cx="-4" cy="-3" r="2" fill="#2B2D42"/>
      <circle cx="4" cy="-3" r="2" fill="#2B2D42"/>
      <circle cx="0" cy="1" r="1.8" fill="#FF8FA3"/>
    `;
  }

  const acc = renderPetAccessorySvg(petAccessoryId);
  const label = safeName
    ? `<g transform="translate(0, 62)">
        <rect x="-42" y="-11" width="84" height="20" rx="10" fill="rgba(255,255,255,0.92)" stroke="rgba(160,108,213,0.45)" stroke-width="1"/>
        <text x="0" y="3" text-anchor="middle" font-size="10.5" font-weight="700" fill="#4A2545">${safeName.replace(/[<>&"]/g, '')}</text>
      </g>`
    : '';

  return `<g id="layer-pet" transform="translate(${x}, ${y})"><g class="pet-companion"><g transform="scale(2.2)">${acc.back}${body}${acc.front}</g>${label}</g></g>`;
}

function renderCharacterTypeBackLayer(characterTypeId) {
  if (characterTypeId === 'angel') {
    return `<g id="layer-character-back" class="character-angel-wings">
      <path d="M 142 194 C 90 150, 56 172, 66 226 C 74 260, 112 256, 144 228 Z" fill="rgba(255,255,255,0.92)" stroke="#FFD166" stroke-width="1.8"/>
      <path d="M 178 194 C 230 150, 264 172, 254 226 C 246 260, 208 256, 176 228 Z" fill="rgba(255,255,255,0.92)" stroke="#FFD166" stroke-width="1.8"/>
    </g>`;
  }
  if (characterTypeId === 'demon') {
    return `<g id="layer-character-back" class="character-demon-wings">
      <path d="M 144 196 L 74 162 L 88 212 L 106 198 L 116 224 L 146 220 Z" fill="#5A189A" stroke="#240046" stroke-width="1.6"/>
      <path d="M 176 196 L 246 162 L 232 212 L 214 198 L 204 224 L 174 220 Z" fill="#5A189A" stroke="#240046" stroke-width="1.6"/>
    </g>`;
  }
  if (characterTypeId === 'fairy') {
    return `<g id="layer-character-back" class="character-fairy-wings">
      <path d="M 144 198 C 86 146, 54 178, 72 224 C 84 252, 122 246, 146 222 Z" fill="rgba(199,125,255,0.34)" stroke="#C77DFF" stroke-width="1.6"/>
      <path d="M 176 198 C 234 146, 266 178, 248 224 C 236 252, 198 246, 174 222 Z" fill="rgba(199,125,255,0.34)" stroke="#C77DFF" stroke-width="1.6"/>
      <circle cx="84" cy="186" r="3" fill="#FFD166"/>
      <circle cx="236" cy="186" r="3" fill="#FFD166"/>
    </g>`;
  }
  return '';
}

function renderCharacterTypeFrontLayer(characterTypeId) {
  if (characterTypeId === 'angel') {
    return `<g id="layer-character-front" class="character-angel-halo">
      <ellipse cx="160" cy="56" rx="28" ry="7.5" fill="none" stroke="#FFD166" stroke-width="4"/>
      <ellipse cx="160" cy="56" rx="28" ry="7.5" fill="none" stroke="#FFF3B0" stroke-width="1.5"/>
    </g>`;
  }
  if (characterTypeId === 'demon') {
    return `<g id="layer-character-front" class="character-demon-horns">
      <path d="M 134 90 Q 118 64 130 52 Q 138 68 144 86 Z" fill="#9D4EDD" stroke="#3C096C" stroke-width="1.4"/>
      <path d="M 186 90 Q 202 64 190 52 Q 182 68 176 86 Z" fill="#9D4EDD" stroke="#3C096C" stroke-width="1.4"/>
    </g>`;
  }
  return '';
}

function renderPowerBurstSvg(powerId, config) {
  const power = findById(config?.powers, powerId) || { color: '#F7D060', accent: '#C77DFF' };
  const c1 = power.color || '#F7D060';
  const c2 = power.accent || '#C77DFF';
  return `<g id="layer-power-burst" class="power-burst-active">
    <circle cx="80" cy="110" r="7" fill="${c1}" opacity="0.9"/>
    <circle cx="242" cy="108" r="8" fill="${c2}" opacity="0.9"/>
    <circle cx="64" cy="210" r="6" fill="${c2}" opacity="0.85"/>
    <circle cx="256" cy="220" r="7" fill="${c1}" opacity="0.85"/>
    <circle cx="110" cy="64" r="5" fill="${c1}" opacity="0.9"/>
    <circle cx="212" cy="68" r="5" fill="${c2}" opacity="0.9"/>
    <polygon points="160,34 164,44 174,44 166,50 169,60 160,54 151,60 154,50 146,44 156,44" fill="${c1}"/>
  </g>`;
}

function renderCustomPatternDef(patternId, trimColor) {
  const color = trimColor || '#FFE5EC';
  if (patternId === 'stars') {
    return `<defs>
      <pattern id="custom-gown-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 12 3 L 14 9 L 20 9.5 L 15.5 13.5 L 17 19.5 L 12 16.5 L 7 19.5 L 8.5 13.5 L 4 9.5 L 10 9 Z" fill="${color}" opacity="0.45"/>
      </pattern>
    </defs>`;
  }
  if (patternId === 'hearts') {
    return `<defs>
      <pattern id="custom-gown-pattern" width="22" height="22" patternUnits="userSpaceOnUse">
        <path d="M 11 17 L 5 11 A 3.5 3.5 0 0 1 11 7.5 A 3.5 3.5 0 0 1 17 11 Z" fill="${color}" opacity="0.45"/>
      </pattern>
    </defs>`;
  }
  if (patternId === 'dots') {
    return `<defs>
      <pattern id="custom-gown-pattern" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="9" cy="9" r="3" fill="${color}" opacity="0.5"/>
      </pattern>
    </defs>`;
  }
  if (patternId === 'stripes') {
    return `<defs>
      <pattern id="custom-gown-pattern" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
        <rect x="0" y="0" width="5" height="14" fill="${color}" opacity="0.35"/>
      </pattern>
    </defs>`;
  }
  if (patternId === 'glitter') {
    return `<defs>
      <pattern id="custom-gown-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="6" r="1.4" fill="#FFFFFF" opacity="0.75"/>
        <circle cx="15" cy="4" r="1" fill="${color}" opacity="0.8"/>
        <circle cx="11" cy="14" r="1.6" fill="#FFFFFF" opacity="0.65"/>
        <circle cx="17" cy="17" r="1.1" fill="${color}" opacity="0.75"/>
      </pattern>
    </defs>`;
  }
  return '';
}

function renderWaistTrimLayer(waistTrimId, trimColor) {
  const color = trimColor || 'var(--gown-accent)';
  if (waistTrimId === 'bow') {
    return `<g id="layer-waist-trim">
      <path d="M 160 238 L 142 229 Q 138 238 142 247 Z" fill="${color}" stroke="rgba(43,45,66,0.2)" stroke-width="1"/>
      <path d="M 160 238 L 178 229 Q 182 238 178 247 Z" fill="${color}" stroke="rgba(43,45,66,0.2)" stroke-width="1"/>
      <circle cx="160" cy="238" r="4.5" fill="${color}" stroke="rgba(43,45,66,0.25)" stroke-width="1"/>
    </g>`;
  }
  if (waistTrimId === 'sash') {
    return `<g id="layer-waist-trim">
      <path d="M 137 235 Q 160 242 183 235 L 182 244 Q 160 250 138 244 Z" fill="${color}" stroke="rgba(43,45,66,0.2)" stroke-width="1"/>
      <path d="M 168 242 L 182 276 L 173 278 L 162 244 Z" fill="${color}" opacity="0.9"/>
    </g>`;
  }
  if (waistTrimId === 'flowers') {
    return `<g id="layer-waist-trim">
      <circle cx="144" cy="238" r="4.5" fill="${color}" stroke="rgba(43,45,66,0.18)" stroke-width="0.9"/>
      <circle cx="160" cy="240" r="5" fill="${color}" stroke="rgba(43,45,66,0.18)" stroke-width="0.9"/>
      <circle cx="176" cy="238" r="4.5" fill="${color}" stroke="rgba(43,45,66,0.18)" stroke-width="0.9"/>
      <circle cx="160" cy="240" r="2" fill="#FFD166"/>
    </g>`;
  }
  return '';
}

export function renderShoesLayer(shoesId, shoeColor = '#E0FBFC') {
  if (!shoesId || shoesId === 'barefoot') return '';
  const fill = shoeColor || '#E0FBFC';
  if (shoesId === 'ballet-flats') {
    return `
      <g id="layer-shoes">
        <ellipse cx="144" cy="396" rx="10" ry="5.5" fill="${fill}" stroke="rgba(43,45,66,0.28)" stroke-width="1.2"/>
        <ellipse cx="176" cy="396" rx="10" ry="5.5" fill="${fill}" stroke="rgba(43,45,66,0.28)" stroke-width="1.2"/>
        <path d="M 140 390 L 148 384 M 148 390 L 140 384" stroke="${fill}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M 172 390 L 180 384 M 180 390 L 172 384" stroke="${fill}" stroke-width="1.5" stroke-linecap="round"/>
      </g>`;
  }
  if (shoesId === 'royal-heels') {
    return `
      <g id="layer-shoes">
        <path d="M 134 396 Q 144 390 154 396 L 152 401 L 136 401 Z" fill="${fill}" stroke="rgba(43,45,66,0.28)" stroke-width="1.2"/>
        <path d="M 166 396 Q 176 390 186 396 L 184 401 L 168 401 Z" fill="${fill}" stroke="rgba(43,45,66,0.28)" stroke-width="1.2"/>
        <rect x="148" y="398" width="4" height="5" rx="1" fill="${fill}" stroke="rgba(43,45,66,0.25)" stroke-width="0.9"/>
        <rect x="168" y="398" width="4" height="5" rx="1" fill="${fill}" stroke="rgba(43,45,66,0.25)" stroke-width="0.9"/>
      </g>`;
  }
  if (shoesId === 'sparkle-boots') {
    return `
      <g id="layer-shoes">
        <path d="M 137 372 L 151 372 L 153 398 Q 144 402 135 398 Z" fill="${fill}" stroke="rgba(43,45,66,0.28)" stroke-width="1.2"/>
        <path d="M 169 372 L 183 372 L 185 398 Q 176 402 167 398 Z" fill="${fill}" stroke="rgba(43,45,66,0.28)" stroke-width="1.2"/>
        <circle cx="144" cy="382" r="2.2" fill="#FFD166"/>
        <circle cx="176" cy="382" r="2.2" fill="#FFD166"/>
      </g>`;
  }
  // glass-slippers (default)
  return `
    <g id="layer-shoes">
      <ellipse cx="144" cy="396" rx="10.5" ry="5.5" fill="${fill}" opacity="0.92" stroke="rgba(43,45,66,0.25)" stroke-width="1.2"/>
      <ellipse cx="176" cy="396" rx="10.5" ry="5.5" fill="${fill}" opacity="0.92" stroke="rgba(43,45,66,0.25)" stroke-width="1.2"/>
      <circle cx="141" cy="394" r="2" fill="#FFFFFF" opacity="0.85"/>
      <circle cx="173" cy="394" r="2" fill="#FFFFFF" opacity="0.85"/>
    </g>`;
}

export function renderPaperDollSvg(princess, config, options = {}) {
  const palettes = config?.palettes || {};
  const items = config?.items || {};

  const skin = findById(palettes.skinTones, princess?.skinTone) || { hex: '#FCD5CE' };
  const hairColor = findById(palettes.hairColors, princess?.hairColor) || { hex: '#F7D47C' };
  const gownColor = findById(palettes.gownColors, princess?.gownColor) || {
    primary: '#FF70A6',
    accent: '#FFE5EC'
  };
  const tiaraMetal = findById(palettes.tiaraMetals, princess?.tiaraMetal) || { hex: '#FFD166' };
  const tiaraGem = findById(palettes.tiaraGems, princess?.tiaraGem) || { hex: '#FF4D6D' };

  const lipstick = findById(palettes.makeup?.lipstick, princess?.makeup?.lipstick) || {
    hex: 'transparent'
  };
  const blush = findById(palettes.makeup?.blush, princess?.makeup?.blush) || {
    hex: 'transparent'
  };
  const eyeshadow = findById(palettes.makeup?.eyeshadow, princess?.makeup?.eyeshadow) || {
    hex: 'transparent'
  };
  const faceGems = findById(palettes.makeup?.faceGems, princess?.makeup?.faceGems) || {
    shape: 'none'
  };

  const hairstyle = findById(items.hairstyles, princess?.hairstyle) || {
    backPath: '',
    frontPath: ''
  };
  const gown = findById(items.gowns, princess?.gown) || {
    bodicePath: '',
    skirtPath: '',
    trimPath: '',
    sleevePath: ''
  };

  const isCustomGown = princess?.gownMode === 'custom';
  const customOpts = config?.customGownOptions || {};
  const cg = princess?.customGown || {};
  const customBodice = isCustomGown ? findById(customOpts.bodices, cg.bodiceId) : null;
  const customSkirt = isCustomGown ? findById(customOpts.skirts, cg.skirtId) : null;
  const customSleeves = isCustomGown ? findById(customOpts.sleeves, cg.sleevesId) : null;

  const activeSkirtPath = (isCustomGown && customSkirt?.skirtPath) || gown.skirtPath;
  const activeBodicePath = (isCustomGown && customBodice?.bodicePath) || gown.bodicePath;
  const activeSleevePath = isCustomGown ? (customSleeves?.sleevePath ?? '') : gown.sleevePath;
  const activeSkirtColor = isCustomGown ? (cg.skirtColor || gownColor.primary) : 'var(--gown-primary)';
  const activeBodiceColor = isCustomGown ? (cg.bodiceColor || gownColor.primary) : 'var(--gown-primary)';
  const activeTrimColor = isCustomGown ? (cg.trimColor || gownColor.accent) : 'var(--gown-accent)';
  const patternDef = isCustomGown ? renderCustomPatternDef(cg.patternId, activeTrimColor) : '';
  const hasPattern = Boolean(patternDef);
  const waistTrimHtml = isCustomGown ? renderWaistTrimLayer(cg.waistTrimId, activeTrimColor) : '';

  const styleVars = [
    `--skin-color: ${skin.hex}`,
    `--hair-color: ${hairColor.hex}`,
    `--gown-primary: ${isCustomGown ? activeSkirtColor : gownColor.primary}`,
    `--gown-accent: ${isCustomGown ? activeTrimColor : gownColor.accent}`,
    `--tiara-metal: ${tiaraMetal.hex}`,
    `--tiara-gem: ${tiaraGem.hex}`,
    `--lip-color: ${lipstick.hex}`,
    `--blush-color: ${blush.hex}`,
    `--eyeshadow-color: ${eyeshadow.hex}`
  ].join('; ');

  return `<svg class="paper-doll-svg" viewBox="0 0 320 420" style="${styleVars}" role="img" aria-label="${princess?.name || 'Princess'}">
    ${patternDef}
    <!-- 1. Aura / Shadow -->
    <g id="layer-aura">
      <ellipse cx="160" cy="402" rx="86" ry="12" fill="rgba(160, 108, 213, 0.16)"/>
    </g>
    <!-- 2. Wings -->
    ${renderWingsLayer(princess?.wings)}
    ${renderCharacterTypeBackLayer(princess?.characterTypeId)}
    <!-- 3. Back Hair -->
    <g id="layer-hair-back">
      <path d="${hairstyle.backPath}" fill="var(--hair-color)" stroke="rgba(43,45,66,0.22)" stroke-width="1.5"/>
    </g>
    <!-- 4. Base Body (Neck, Arms, Torso) -->
    <g id="layer-body">
      <rect x="150" y="158" width="20" height="32" rx="8" fill="var(--skin-color)"/>
      <path d="M 134 190 C 110 205, 96 226, 92 246" fill="none" stroke="var(--skin-color)" stroke-width="12" stroke-linecap="round"/>
      <path d="M 186 190 C 210 205, 224 226, 228 246" fill="none" stroke="var(--skin-color)" stroke-width="12" stroke-linecap="round"/>
      <circle cx="91" cy="248" r="7" fill="var(--skin-color)"/>
      <circle cx="229" cy="248" r="7" fill="var(--skin-color)"/>
    </g>
    <!-- 4b. Legs & Shoes (hidden for mermaid) -->
    ${princess?.characterTypeId !== 'mermaid'
      ? `<g id="layer-legs">
           <rect x="139" y="346" width="10" height="48" rx="5" fill="var(--skin-color)"/>
           <rect x="171" y="346" width="10" height="48" rx="5" fill="var(--skin-color)"/>
           <ellipse cx="144" cy="396" rx="9" ry="4.5" fill="var(--skin-color)"/>
           <ellipse cx="176" cy="396" rx="9" ry="4.5" fill="var(--skin-color)"/>
         </g>
         ${renderShoesLayer(
           princess?.shoesId || 'glass-slippers',
           (config?.palettes?.shoeColors || []).find((c) => c.id === princess?.shoeColorId)?.hex || '#E0FBFC'
         )}`
      : ''}
    <!-- 5. Gown Skirt & Bodice -->
    <g id="layer-gown">
      ${princess?.characterTypeId === 'mermaid'
        ? `<path id="layer-mermaid-tail" d="M 134 238 C 126 286, 134 342, 154 378 L 130 402 Q 160 392 160 384 Q 160 392 190 402 L 166 378 C 186 342, 194 286, 186 238 Z" fill="${activeSkirtColor}" stroke="rgba(43,45,66,0.22)" stroke-width="1.6"/>
           ${hasPattern ? `<path d="M 134 238 C 126 286, 134 342, 154 378 L 130 402 Q 160 392 160 384 Q 160 392 190 402 L 166 378 C 186 342, 194 286, 186 238 Z" fill="url(#custom-gown-pattern)" pointer-events="none"/>` : ''}
           <path d="M 142 276 Q 160 286 178 276 M 144 308 Q 160 318 176 308 M 148 340 Q 160 350 172 340" fill="none" stroke="${activeTrimColor}" stroke-width="2" opacity="0.75"/>`
        : `<path d="${activeSkirtPath}" fill="${activeSkirtColor}" stroke="rgba(43,45,66,0.18)" stroke-width="1.6"/>
           ${hasPattern ? `<path d="${activeSkirtPath}" fill="url(#custom-gown-pattern)" pointer-events="none"/>` : ''}`}
      <path d="${activeBodicePath}" fill="${activeBodiceColor}" stroke="rgba(43,45,66,0.18)" stroke-width="1.6"/>
      ${activeSleevePath ? `<path d="${activeSleevePath}" fill="${activeTrimColor}" stroke="rgba(43,45,66,0.14)" stroke-width="1.2"/>` : ''}
    </g>
    <!-- 6. Gown Shading & Trim -->
    <g id="layer-gown-trim">
      <path d="${activeSkirtPath}" fill="rgba(255,255,255,0.12)" pointer-events="none"/>
      ${!isCustomGown ? `<path d="${gown.trimPath}" fill="none" stroke="var(--gown-accent)" stroke-width="3.5" stroke-linecap="round"/>` : ''}
      ${waistTrimHtml}
    </g>
    <!-- 7. Necklace -->
    ${renderNecklaceLayer(princess?.necklace)}
    <!-- 8. Head & Ears -->
    <g id="layer-head">
      <circle cx="118" cy="126" r="7" fill="var(--skin-color)"/>
      <circle cx="202" cy="126" r="7" fill="var(--skin-color)"/>
      <path d="M 120 112 C 120 78, 200 78, 200 112 C 200 148, 180 166, 160 166 C 140 166, 120 148, 120 112 Z" fill="var(--skin-color)" stroke="rgba(43,45,66,0.14)" stroke-width="1.2"/>
    </g>
    <!-- 9. Blush -->
    <g id="layer-blush">
      <ellipse cx="134" cy="134" rx="9" ry="5.5" fill="var(--blush-color)" opacity="0.55"/>
      <ellipse cx="186" cy="134" rx="9" ry="5.5" fill="var(--blush-color)" opacity="0.55"/>
    </g>
    <!-- 10. Eyeshadow -->
    <g id="layer-eyeshadow">
      <ellipse cx="142" cy="117" rx="9.5" ry="5" fill="var(--eyeshadow-color)" opacity="0.65"/>
      <ellipse cx="178" cy="117" rx="9.5" ry="5" fill="var(--eyeshadow-color)" opacity="0.65"/>
    </g>
    <!-- 11. Eyes & Lashes -->
    <g id="layer-eyes">
      <ellipse cx="142" cy="121" rx="6.5" ry="7.5" fill="#FFFFFF"/>
      <ellipse cx="178" cy="121" rx="6.5" ry="7.5" fill="#FFFFFF"/>
      <circle cx="142" cy="122" r="4.5" fill="#2B2D42"/>
      <circle cx="178" cy="122" r="4.5" fill="#2B2D42"/>
      <circle cx="143.5" cy="120" r="1.6" fill="#FFFFFF"/>
      <circle cx="179.5" cy="120" r="1.6" fill="#FFFFFF"/>
      <path d="M 134 115 Q 142 110 150 115" fill="none" stroke="#2B2D42" stroke-width="2" stroke-linecap="round"/>
      <path d="M 170 115 Q 178 110 186 115" fill="none" stroke="#2B2D42" stroke-width="2" stroke-linecap="round"/>
    </g>
    <!-- 12. Nose & Smile -->
    <g id="layer-mouth">
      <path d="M 158 131 Q 160 134 162 131" fill="none" stroke="rgba(43,45,66,0.35)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 150 144 Q 160 152 170 144" fill="none" stroke="#8D4B4B" stroke-width="2" stroke-linecap="round"/>
    </g>
    <!-- 13. Lipstick -->
    <g id="layer-lipstick">
      <path d="M 150 144 Q 160 153 170 144 Q 160 147 150 144 Z" fill="var(--lip-color)" opacity="0.88"/>
    </g>
    <!-- 14. Face Gems -->
    ${renderFaceGemsLayer(faceGems.shape)}
    <!-- 15. Front Hair / Bangs -->
    <g id="layer-hair-front">
      <path d="${hairstyle.frontPath}" fill="var(--hair-color)" stroke="rgba(43,45,66,0.2)" stroke-width="1.2"/>
    </g>
    <!-- 16. Tiara -->
    ${renderTiaraLayer(princess?.tiara)}
    ${renderCharacterTypeFrontLayer(princess?.characterTypeId)}
    <!-- 17. Handheld Accessory -->
    ${renderHandheldLayer(princess?.handheld)}
    <!-- 18. Companion Pet -->
    ${options?.includePet !== false
      ? renderPetSvg(princess?.petId, princess?.petName, 72, 348, {
          petColor: (config?.petColors || []).find((c) => c.id === princess?.petColorId)?.hex || '',
          petAccessoryId: princess?.petAccessoryId || 'none'
        })
      : ''}
    <!-- 19. Power Burst -->
    ${options?.powerBurst ? renderPowerBurstSvg(princess?.powerId, config) : ''}
  </svg>`;
}
