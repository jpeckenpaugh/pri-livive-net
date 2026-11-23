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
  windows: 'Window View',
  beds: 'Royal Bed',
  bedding: 'Bedding',
  lamps: 'Night Lamp',
  plushies: 'Plushie',
  tables: 'Dining Table',
  tablecloths: 'Tablecloth',
  hearths: 'Kitchen Hearth',
  centerpieces: 'Centerpiece',
  colors: 'Carriage Color',
  wheels: 'Trim & Wheels',
  horses: 'Horses & Unicorns'
};

export const CARRIAGE_DESTINATIONS = [
  { id: 'enchanted-forest', label: 'Enchanted Forest', icon: '🌲', sky: '#D1FAE5', ground: '#6EE7B7', accent: '#059669' },
  { id: 'crystal-beach', label: 'Crystal Beach', icon: '🏖️', sky: '#E0F2FE', ground: '#FDE68A', accent: '#0284C7' },
  { id: 'starlight-village', label: 'Starlight Village', icon: '🏘️', sky: '#EDE9FE', ground: '#C4B5FD', accent: '#7C3AED' },
  { id: 'cloud-kingdom', label: 'Cloud Kingdom', icon: '☁️', sky: '#FFF1F2', ground: '#F8FAFC', accent: '#EC4899' }
];

export const CARRIAGE_FRIENDS = [
  { id: 'maya', label: 'Princess Maya', icon: '👸' },
  { id: 'leo', label: 'Prince Leo', icon: '🤴' },
  { id: 'pip', label: 'Fairy Pip', icon: '🧚' }
];

export const ROYAL_DISHES = [
  { id: 'royal-cupcakes', label: 'Royal Cupcakes', icon: '🧁' },
  { id: 'starlight-soup', label: 'Starlight Soup', icon: '🍲' },
  { id: 'enchanted-tea', label: 'Enchanted Tea', icon: '🫖' },
  { id: 'golden-pancakes', label: 'Golden Pancakes', icon: '🥞' }
];

export function isCastleItemOwned(state, item) {
  if (!item) return false;
  if (!item.price || item.price <= 0) return true;
  const unlocked = state?.unlockedCastleItems || [];
  return unlocked.includes(item.id);
}

export function getShopItems(castleConfig) {
  if (!castleConfig || typeof castleConfig !== 'object') return [];
  const items = [];
  for (const view of ['exterior', 'throne', 'bedroom', 'kitchen', 'carriage']) {
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

function renderBedroomSvg(bedState, bedConfig, options = {}) {
  const wall = findOption(bedConfig.wallColors, bedState?.wallColor) || { hex: '#FFF0F5', trim: '#F9C6D9' };
  const bed = findOption(bedConfig.beds, bedState?.beds)?.id || 'canopy-pink';
  const bedding = findOption(bedConfig.bedding, bedState?.bedding) || { hex: '#F472B6', trim: '#FDE68A' };
  const rug = findOption(bedConfig.rugs, bedState?.rugs) || { hex: '#FB7185', trim: '#FFE4E6' };
  const lamp = findOption(bedConfig.lamps, bedState?.lamps)?.id || 'candle-sconce';
  const plushie = findOption(bedConfig.plushies, bedState?.plushies) || { icon: '🧸' };
  const sleeping = Boolean(bedState?.sleeping);
  const lampOn = bedState?.lampOn !== false;

  const bedFrameColor =
    bed === 'crystal-fourposter' ? '#BAE6FD' : bed === 'swan-carriage-bed' ? '#FEF3C7' : bed === 'cloud-cradle' ? '#F8FAFC' : '#FBCFE8';

  return `
    <svg viewBox="0 0 640 380" class="castle-scene-svg" role="img" aria-label="Royal Bedroom">
      <rect width="640" height="380" fill="${wall.hex}" />
      ${!lampOn ? '<rect width="640" height="380" fill="#0F172A" opacity="0.28" />' : ''}
      <rect x="0" y="292" width="640" height="88" fill="#E8D5C4" />
      <rect x="0" y="286" width="640" height="10" fill="${wall.trim}" />

      <!-- Cozy Rug -->
      <ellipse cx="320" cy="336" rx="190" ry="26" fill="${rug.hex}" stroke="${rug.trim}" stroke-width="4" />

      <!-- Night Window -->
      <rect x="64" y="54" width="96" height="122" rx="48" fill="#1E1B4B" stroke="${wall.trim}" stroke-width="6" />
      <circle cx="98" cy="96" r="14" fill="#FEF08A" />
      <circle cx="130" cy="84" r="3" fill="#FFFFFF" />
      <circle cx="122" cy="120" r="2.5" fill="#FFFFFF" />

      <!-- Royal Bed -->
      <g transform="translate(195, 130)">
        <rect x="14" y="10" width="12" height="150" rx="4" fill="${bedFrameColor}" stroke="#D97706" stroke-width="2" />
        <rect x="224" y="10" width="12" height="150" rx="4" fill="${bedFrameColor}" stroke="#D97706" stroke-width="2" />
        <path d="M14,16 Q125,-22 236,16" fill="none" stroke="${bedding.hex}" stroke-width="10" stroke-linecap="round" />
        <rect x="22" y="96" width="206" height="58" rx="14" fill="#FFFFFF" stroke="${bedFrameColor}" stroke-width="4" />
        <rect x="22" y="108" width="206" height="46" rx="12" fill="${bedding.hex}" stroke="${bedding.trim}" stroke-width="3" />
        <rect x="34" y="88" width="54" height="24" rx="10" fill="#FFFFFF" stroke="${bedding.trim}" stroke-width="2" />
      </g>

      <!-- Nightstand & Lamp -->
      <g transform="translate(470, 210)">
        <rect x="0" y="28" width="68" height="56" rx="8" fill="#D97706" />
        <rect x="6" y="34" width="56" height="20" rx="4" fill="#FDE68A" />
        <rect x="28" y="4" width="12" height="24" fill="#F59E0B" />
        <polygon points="14,6 54,6 44,-18 24,-18" fill="${lamp === 'fairy-jar' ? '#A7F3D0' : '#FEF08A'}" stroke="#D97706" stroke-width="2" />
        ${lampOn ? '<circle cx="34" cy="-6" r="28" fill="#FEF08A" opacity="0.32" />' : ''}
      </g>

      <!-- Plushie -->
      <text x="248" y="232" font-size="30" text-anchor="middle">${plushie.icon || '🧸'}</text>

      <!-- Princess -->
      ${
        options.princessSvg
          ? sleeping
            ? `<g transform="translate(365, 195) rotate(-82) scale(0.45)">${options.princessSvg}</g>
               <text x="320" y="168" font-size="26">💤</text>`
            : `<g transform="translate(108, 172) scale(0.5)">${options.princessSvg}</g>`
          : ''
      }
    </svg>
  `;
}

function renderKitchenSvg(kitState, kitConfig, options = {}) {
  const wall = findOption(kitConfig.wallColors, kitState?.wallColor) || { hex: '#FFFBEB', trim: '#FDE68A' };
  const table = findOption(kitConfig.tables, kitState?.tables)?.id || 'oak-banquet';
  const cloth = findOption(kitConfig.tablecloths, kitState?.tablecloths) || { hex: '#FFFFFF', trim: '#F1F5F9' };
  const hearth = findOption(kitConfig.hearths, kitState?.hearths)?.id || 'brick-oven';
  const centerpiece = findOption(kitConfig.centerpieces, kitState?.centerpieces) || { icon: '🫖' };
  const dish = ROYAL_DISHES.find((d) => d.id === kitState?.currentDish) || ROYAL_DISHES[0];
  const dining = Boolean(kitState?.dining);

  const tableWood = table === 'crystal-feast' ? '#BAE6FD' : table === 'golden-tea' ? '#FBBF24' : '#B45309';

  return `
    <svg viewBox="0 0 640 380" class="castle-scene-svg" role="img" aria-label="Royal Kitchen and Dining">
      <rect width="640" height="380" fill="${wall.hex}" />
      <rect x="0" y="286" width="640" height="94" fill="#E8D5C4" />
      <rect x="0" y="280" width="640" height="10" fill="${wall.trim}" />

      <!-- Kitchen Hearth -->
      <g transform="translate(56, 118)">
        <rect x="0" y="0" width="136" height="164" rx="14" fill="${hearth === 'pastel-hearth' ? '#FBCFE8' : hearth === 'golden-rotisserie' ? '#FDE68A' : '#DC2626'}" stroke="#78350F" stroke-width="4" />
        <path d="M26,164 L26,96 Q68,54 110,96 L110,164 Z" fill="#1F2937" />
        <ellipse cx="68" cy="148" rx="26" ry="14" fill="#F97316" />
        <ellipse cx="68" cy="144" rx="15" ry="10" fill="#FEF08A" />
      </g>

      <!-- Dining Table -->
      <g transform="translate(244, 198)">
        <rect x="20" y="42" width="18" height="72" fill="${tableWood}" />
        <rect x="262" y="42" width="18" height="72" fill="${tableWood}" />
        <rect x="0" y="22" width="300" height="24" rx="8" fill="${tableWood}" />
        <path d="M8,22 L292,22 L286,52 Q250,40 214,52 Q178,40 150,52 Q122,40 86,52 Q50,40 14,52 Z" fill="${cloth.hex}" stroke="${cloth.trim}" stroke-width="2" />
      </g>

      <!-- Centerpiece & Dish -->
      <text x="394" y="210" font-size="34" text-anchor="middle">${centerpiece.icon || '🫖'}</text>
      <text x="328" y="212" font-size="30" text-anchor="middle">${dish.icon}</text>

      <!-- Princess -->
      ${
        options.princessSvg
          ? dining
            ? `<g transform="translate(226, 148) scale(0.48)">${options.princessSvg}</g>
               <text x="275" y="142" font-size="24">💖</text>`
            : `<g transform="translate(500, 162) scale(0.5)">${options.princessSvg}</g>`
          : ''
      }
    </svg>
  `;
}

export function renderCarriageSvg(carriageState, carriageConfig = {}, options = {}) {
  const dest = CARRIAGE_DESTINATIONS.find((d) => d.id === carriageState?.destination) || CARRIAGE_DESTINATIONS[0];
  const color = findOption(carriageConfig.colors, carriageState?.colors)?.hex || '#FF70A6';
  const style = findOption(carriageConfig.styles, carriageState?.styles)?.id || 'pumpkin-coach';
  const wheel = findOption(carriageConfig.wheels, carriageState?.wheels)?.id || 'wooden-spokes';
  const horse = findOption(carriageConfig.horses, carriageState?.horses) || { icon: '🐴' };
  const banner = findOption(carriageConfig.banners, carriageState?.banners) || { icon: '👑' };
  const invited = Array.isArray(carriageState?.invitedFriends) ? carriageState.invitedFriends : [];
  const friends = CARRIAGE_FRIENDS.filter((f) => invited.includes(f.id));

  const wheelColor = wheel === 'crystal-rims' ? '#7DD3FC' : wheel === 'starlight-wheels' ? '#FDE047' : wheel === 'golden-filigree' ? '#F59E0B' : '#92400E';

  return `
    <svg viewBox="0 0 640 380" class="castle-scene-svg" role="img" aria-label="Royal Carriage at ${dest.label}">
      <rect width="640" height="380" fill="${dest.sky}" />
      <rect x="0" y="275" width="640" height="105" fill="${dest.ground}" />
      <rect x="0" y="295" width="640" height="44" fill="#E5E7EB" opacity="0.65" />

      <!-- Destination Banner -->
      <rect x="190" y="18" width="260" height="36" rx="18" fill="#FFFFFF" stroke="${dest.accent}" stroke-width="3" />
      <text x="320" y="42" font-size="16" font-weight="700" fill="${dest.accent}" text-anchor="middle">${dest.icon} ${dest.label}</text>

      <!-- Horses / Unicorns -->
      <text x="128" y="268" font-size="56" text-anchor="middle">${horse.icon || '🐴'}</text>
      <line x1="168" y1="252" x2="255" y2="256" stroke="#D97706" stroke-width="4" />

      <!-- Carriage Body -->
      <g transform="translate(245, 145)">
        ${
          style === 'crystal-coach'
            ? `<polygon points="35,10 175,10 205,65 180,120 30,120 5,65" fill="${color}" stroke="#E0F2FE" stroke-width="4" />`
            : `<rect x="15" y="15" width="180" height="105" rx="46" fill="${color}" stroke="#FBBF24" stroke-width="4" />`
        }
        <rect x="65" y="34" width="80" height="52" rx="14" fill="#FFFFFF" opacity="0.88" />
        <text x="105" y="24" font-size="22" text-anchor="middle">${banner.icon || '👑'}</text>
        ${options.princessSvg ? `<g transform="translate(68, 22) scale(0.32)">${options.princessSvg}</g>` : ''}
      </g>

      <!-- Wheels -->
      <g stroke="${wheelColor}" stroke-width="6" fill="none">
        <circle cx="295" cy="285" r="30" />
        <circle cx="420" cy="285" r="30" />
        <line x1="295" y1="255" x2="295" y2="315" />
        <line x1="265" y1="285" x2="325" y2="285" />
        <line x1="420" y1="255" x2="420" y2="315" />
        <line x1="390" y1="285" x2="450" y2="285" />
      </g>

      <!-- Invited Friends -->
      ${friends
        .map(
          (f, idx) =>
            `<g transform="translate(${495 + idx * 44}, 256)">
              <circle cx="0" cy="-16" r="18" fill="#FFFFFF" opacity="0.85" />
              <text x="0" y="-8" font-size="24" text-anchor="middle">${f.icon}</text>
            </g>`
        )
        .join('')}
    </svg>
  `;
}

export function renderCastleSceneSvg(castleState, castleConfig, options = {}) {
  const view = castleState?.activeView || 'exterior';
  const config = castleConfig || {};
  if (view === 'throne') {
    return renderThroneSvg(castleState?.throne || {}, config.throne || {}, options);
  }
  if (view === 'bedroom') {
    return renderBedroomSvg(castleState?.bedroom || {}, config.bedroom || {}, options);
  }
  if (view === 'kitchen') {
    return renderKitchenSvg(castleState?.kitchen || {}, config.kitchen || {}, options);
  }
  return renderExteriorSvg(castleState?.exterior || {}, config.exterior || {});
}
