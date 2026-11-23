const CATEGORY_LABELS = {
  styles: 'Castle Style',
  wallColors: 'Wall Color',
  roofColors: 'Roof Color',
  flags: 'Flags & Banners',
  gates: 'Royal Gate',
  gardens: 'Garden & Pond',
  rugs: 'Royal Rug',
  thrones: 'Throne',
  chandeliers: 'Chandelier',
  banners: 'Wall Drapes',
  windows: 'Window View'
};

export function isCastleItemOwned(state, item) {
  if (!item) return false;
  if (!item.price || item.price <= 0) return true;
  const unlocked = state?.unlockedCastleItems || [];
  return unlocked.includes(item.id);
}

export function getShopItems(castleConfig) {
  if (!castleConfig || typeof castleConfig !== 'object') return [];
  const items = [];
  for (const view of ['exterior', 'throne']) {
    const group = castleConfig[view];
    if (!group || typeof group !== 'object') continue;
    for (const [category, list] of Object.entries(group)) {
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (item && item.price > 0) {
          items.push({
            ...item,
            view,
            category,
            categoryLabel: CATEGORY_LABELS[category] || category
          });
        }
      }
    }
  }
  return items;
}

export function purchaseCastleItem(state, item) {
  if (!state || !item || !item.id) {
    return { ok: false, reason: 'invalid', nextState: state };
  }
  if (isCastleItemOwned(state, item)) {
    return { ok: false, reason: 'already-owned', nextState: state };
  }
  const stars = state.academy?.stars ?? 0;
  const price = Number(item.price) || 0;
  if (stars < price) {
    return { ok: false, reason: 'insufficient-stars', nextState: state };
  }
  const unlocked = Array.isArray(state.unlockedCastleItems) ? state.unlockedCastleItems : [];
  const nextState = {
    ...state,
    academy: {
      ...state.academy,
      stars: stars - price
    },
    unlockedCastleItems: [...unlocked, item.id]
  };
  return { ok: true, reason: 'purchased', nextState };
}

function findOption(list, id) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list.find((item) => item.id === id) || list[0];
}

function renderExteriorSvg(extState, extConfig) {
  const style = findOption(extConfig.styles, extState?.style)?.id || 'classic-keep';
  const wall = findOption(extConfig.wallColors, extState?.wallColor) || { hex: '#FFF4EA', shade: '#EBD7C5' };
  const roof = findOption(extConfig.roofColors, extState?.roofColor) || { hex: '#FF70A6', shade: '#E04882' };
  const flags = findOption(extConfig.flags, extState?.flags)?.id || 'starlight-pennants';
  const gate = findOption(extConfig.gates, extState?.gates)?.id || 'oak-arch';
  const garden = findOption(extConfig.gardens, extState?.gardens)?.id || 'rose-bushes';

  const isCrystal = style === 'crystal-palace';
  const isCloud = style === 'cloud-citadel';
  const isFairy = style === 'fairy-turrets';

  const flagColor =
    flags === 'heart-banners'
      ? '#FF70A6'
      : flags === 'rainbow-ribbons'
        ? '#34D399'
        : flags === 'unicorn-crests'
          ? '#FBBF24'
          : '#60A5FA';

  const gateFill =
    gate === 'crystal-archway'
      ? '#BAE6FD'
      : gate === 'golden-sunburst'
        ? '#FBBF24'
        : gate === 'iron-scroll'
          ? '#475569'
          : '#92400E';

  return `
    <svg class="castle-scene-svg" viewBox="0 0 640 420" role="img" aria-label="Castle Exterior">
      <defs>
        <linearGradient id="castleSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#BAE6FD" />
          <stop offset="65%" stop-color="#E0F2FE" />
          <stop offset="100%" stop-color="#FCE7F3" />
        </linearGradient>
        <linearGradient id="castleGrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#86EFAC" />
          <stop offset="100%" stop-color="#4ADE80" />
        </linearGradient>
      </defs>
      <rect width="640" height="420" fill="url(#castleSky)" />
      <!-- Clouds -->
      <g fill="#FFFFFF" opacity="0.88">
        <ellipse cx="110" cy="78" rx="46" ry="20" />
        <ellipse cx="140" cy="72" rx="34" ry="18" />
        <ellipse cx="515" cy="90" rx="52" ry="22" />
        <ellipse cx="485" cy="84" rx="32" ry="16" />
      </g>
      ${isCloud ? `<g fill="#FFFFFF" opacity="0.95"><ellipse cx="320" cy="340" rx="220" ry="34" /><ellipse cx="200" cy="346" rx="110" ry="24" /><ellipse cx="440" cy="346" rx="110" ry="24" /></g>` : ''}
      <!-- Ground -->
      <path d="M0 320 Q320 295 640 320 L640 420 L0 420 Z" fill="url(#castleGrass)" />
      <path d="M275 318 L365 318 L410 420 L230 420 Z" fill="#FDE68A" opacity="0.7" />

      <!-- Side Towers -->
      <rect x="145" y="160" width="70" height="165" rx="6" fill="${wall.hex}" stroke="${wall.shade}" stroke-width="3" />
      <rect x="425" y="160" width="70" height="165" rx="6" fill="${wall.hex}" stroke="${wall.shade}" stroke-width="3" />
      <!-- Center Keep -->
      <rect x="215" y="135" width="210" height="190" rx="8" fill="${wall.hex}" stroke="${wall.shade}" stroke-width="3" />
      <!-- Tall Center Spire -->
      <rect x="285" y="80" width="70" height="70" rx="4" fill="${wall.hex}" stroke="${wall.shade}" stroke-width="3" />

      <!-- Roofs -->
      <polygon points="135,162 180,95 225,162" fill="${roof.hex}" stroke="${roof.shade}" stroke-width="3" />
      <polygon points="415,162 460,95 505,162" fill="${roof.hex}" stroke="${roof.shade}" stroke-width="3" />
      <polygon points="275,82 320,22 365,82" fill="${roof.hex}" stroke="${roof.shade}" stroke-width="3" />
      ${isFairy ? `<circle cx="180" cy="90" r="7" fill="#FDE047" /><circle cx="460" cy="90" r="7" fill="#FDE047" /><circle cx="320" cy="18" r="9" fill="#FDE047" />` : ''}
      ${isCrystal ? `<polygon points="320,22 305,82 335,82" fill="#FFFFFF" opacity="0.35" /><polygon points="180,95 168,162 192,162" fill="#FFFFFF" opacity="0.35" />` : ''}

      <!-- Flags -->
      <line x1="180" y1="95" x2="180" y2="68" stroke="#94A3B8" stroke-width="3" />
      <polygon points="180,68 206,76 180,84" fill="${flagColor}" />
      <line x1="460" y1="95" x2="460" y2="68" stroke="#94A3B8" stroke-width="3" />
      <polygon points="460,68 486,76 460,84" fill="${flagColor}" />
      <line x1="320" y1="22" x2="320" y2="2" stroke="#94A3B8" stroke-width="3" />
      <polygon points="320,2 348,10 320,18" fill="${flagColor}" />

      <!-- Windows -->
      <g fill="#7DD3FC" stroke="${wall.shade}" stroke-width="2.5">
        <rect x="168" y="195" width="24" height="36" rx="12" />
        <rect x="448" y="195" width="24" height="36" rx="12" />
        <rect x="245" y="170" width="28" height="42" rx="14" />
        <rect x="367" y="170" width="28" height="42" rx="14" />
        <rect x="307" y="100" width="26" height="34" rx="13" />
      </g>

      <!-- Gate -->
      <path d="M282 325 L282 258 Q320 225 358 258 L358 325 Z" fill="${gateFill}" stroke="#475569" stroke-width="3" />
      <line x1="320" y1="242" x2="320" y2="325" stroke="#1E293B" stroke-width="2" opacity="0.4" />

      <!-- Garden / Fountain -->
      ${
        garden === 'starlight-fountain'
          ? `<g transform="translate(80, 325)"><ellipse cx="45" cy="30" rx="44" ry="14" fill="#93C5FD" stroke="#60A5FA" stroke-width="2.5" /><rect x="37" y="6" width="16" height="22" fill="#E2E8F0" /><ellipse cx="45" cy="6" rx="22" ry="7" fill="#BAE6FD" /></g>`
          : garden === 'crystal-pond'
            ? `<ellipse cx="520" cy="360" rx="64" ry="22" fill="#7DD3FC" stroke="#38BDF8" stroke-width="3" /><circle cx="505" cy="356" r="6" fill="#FFFFFF" /><circle cx="535" cy="364" r="5" fill="#F9A8D4" />`
            : `<g><circle cx="115" cy="330" r="18" fill="#22C55E" /><circle cx="108" cy="324" r="5" fill="#FB7185" /><circle cx="122" cy="332" r="5" fill="#FB7185" /><circle cx="525" cy="330" r="18" fill="#22C55E" /><circle cx="518" cy="324" r="5" fill="#FB7185" /><circle cx="532" cy="332" r="5" fill="#FB7185" /></g>`
      }
    </svg>
  `;
}

function renderThroneSvg(throneState, throneConfig, options = {}) {
  const wall = findOption(throneConfig.wallColors, throneState?.wallColor) || { hex: '#FFF9F2', trim: '#F3E1D0' };
  const rug = findOption(throneConfig.rugs, throneState?.rugs) || { hex: '#E11D48', trim: '#FBBF24' };
  const throne = findOption(throneConfig.thrones, throneState?.thrones)?.id || 'velvet-chair';
  const chandelier = findOption(throneConfig.chandeliers, throneState?.chandeliers)?.id || 'candle-ring';
  const banner = findOption(throneConfig.banners, throneState?.banners)?.id || 'crown-tapestries';
  const windowView = findOption(throneConfig.windows, throneState?.windows)?.id || 'sunny-meadow';

  const windowSky =
    windowView === 'aurora-night'
      ? '#1E1B4B'
      : windowView === 'twilight-sky'
        ? '#7C3AED'
        : windowView === 'rainbow-waterfall'
          ? '#38BDF8'
          : '#BAE6FD';

  const throneColor =
    throne === 'crystal-butterfly'
      ? '#38BDF8'
      : throne === 'moonbeam-seashell'
        ? '#F472B6'
        : throne === 'golden-crest'
          ? '#F59E0B'
          : '#E11D48';

  const bannerColor =
    banner === 'galaxy-curtains'
      ? '#4338CA'
      : banner === 'floral-swags'
        ? '#F472B6'
        : '#FB7185';

  return `
    <svg class="castle-scene-svg" viewBox="0 0 640 420" role="img" aria-label="Castle Throne Room">
      <!-- Walls -->
      <rect width="640" height="310" fill="${wall.hex}" />
      <rect y="285" width="640" height="25" fill="${wall.trim}" />
      <!-- Floor -->
      <rect y="310" width="640" height="110" fill="#FDE68A" />
      <!-- Rug -->
      <polygon points="210,310 430,310 490,420 150,420" fill="${rug.hex}" stroke="${rug.trim}" stroke-width="5" />

      <!-- Windows -->
      <g>
        <rect x="85" y="95" width="84" height="135" rx="42" fill="${windowSky}" stroke="${wall.trim}" stroke-width="6" />
        <rect x="471" y="95" width="84" height="135" rx="42" fill="${windowSky}" stroke="${wall.trim}" stroke-width="6" />
        ${windowView === 'aurora-night' ? `<path d="M95 150 Q125 120 160 145" stroke="#34D399" stroke-width="5" fill="none" opacity="0.8" /><path d="M480 150 Q515 120 545 145" stroke="#34D399" stroke-width="5" fill="none" opacity="0.8" />` : ''}
      </g>

      <!-- Wall Banners -->
      <polygon points="205,70 245,70 245,190 225,172 205,190" fill="${bannerColor}" />
      <polygon points="395,70 435,70 435,190 415,172 395,190" fill="${bannerColor}" />

      <!-- Chandelier -->
      <g transform="translate(320, 0)">
        <line x1="0" y1="0" x2="0" y2="48" stroke="#D97706" stroke-width="4" />
        <ellipse cx="0" cy="56" rx="52" ry="12" fill="none" stroke="#FBBF24" stroke-width="4" />
        ${
          chandelier === 'fairy-lanterns'
            ? `<circle cx="-38" cy="68" r="9" fill="#FDE047" /><circle cx="0" cy="74" r="10" fill="#FDE047" /><circle cx="38" cy="68" r="9" fill="#FDE047" />`
            : `<circle cx="-36" cy="52" r="5" fill="#FEF08A" /><circle cx="0" cy="48" r="6" fill="#FEF08A" /><circle cx="36" cy="52" r="5" fill="#FEF08A" />`
        }
      </g>

      <!-- Throne -->
      <g transform="translate(272, 165)">
        <rect x="10" y="18" width="76" height="108" rx="22" fill="${throneColor}" stroke="#FBBF24" stroke-width="4" />
        <rect x="4" y="110" width="88" height="28" rx="8" fill="${throneColor}" stroke="#FBBF24" stroke-width="4" />
        <circle cx="48" cy="12" r="10" fill="#FBBF24" />
      </g>

      ${options.princessSvg ? `<g transform="translate(245, 165) scale(0.52)">${options.princessSvg}</g>` : ''}
    </svg>
  `;
}

export function renderCastleSceneSvg(castleState, castleConfig, options = {}) {
  const view = castleState?.activeView === 'throne' ? 'throne' : 'exterior';
  const config = castleConfig || {};
  if (view === 'throne') {
    return renderThroneSvg(castleState?.throne || {}, config.throne || {}, options);
  }
  return renderExteriorSvg(castleState?.exterior || {}, config.exterior || {});
}
