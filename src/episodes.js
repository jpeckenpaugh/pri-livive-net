import { renderPaperDollSvg } from './paper_doll.js';
import { createInitialState } from './state.js';

export function getEpisodeById(episodesConfig, episodeId) {
  if (!episodesConfig || !Array.isArray(episodesConfig.episodes)) return null;
  return episodesConfig.episodes.find((ep) => ep.id === episodeId) || null;
}

export function resolveEpisodeEnding(episode, kindnessCount = 0) {
  if (!episode || !episode.ending) return null;
  const threshold = typeof episode.kindnessThreshold === 'number' ? episode.kindnessThreshold : 3;
  const isWelcoming = Number(kindnessCount) >= threshold;
  const key = isWelcoming ? 'welcoming' : 'exclusionary';
  const ending = episode.ending[key] || episode.ending.welcoming || episode.ending.exclusionary;
  return {
    type: key,
    ...ending
  };
}

function renderBackdrop(backdropType) {
  if (backdropType === 'banquet') {
    return `
      <rect width="600" height="320" fill="#fff3e6" />
      <rect x="0" y="0" width="600" height="190" fill="#fde2c8" />
      <rect x="0" y="190" width="600" height="130" fill="#e8c39e" />
      <rect x="130" y="185" width="340" height="34" rx="10" fill="#a86434" />
      <rect x="130" y="178" width="340" height="14" rx="6" fill="#fffaf0" />
      <circle cx="230" cy="172" r="8" fill="#ff7aa8" />
      <circle cx="300" cy="172" r="8" fill="#ffd166" />
      <circle cx="370" cy="172" r="8" fill="#a78bfa" />
      <path d="M80 20 Q120 70 160 20" fill="none" stroke="#ffd166" stroke-width="5" />
      <path d="M260 20 Q300 70 340 20" fill="none" stroke="#ff7aa8" stroke-width="5" />
      <path d="M440 20 Q480 70 520 20" fill="none" stroke="#a78bfa" stroke-width="5" />
    `;
  }
  if (backdropType === 'potion-lab') {
    return `
      <rect width="600" height="320" fill="#eef2ff" />
      <rect x="0" y="0" width="600" height="200" fill="#e0e7ff" />
      <rect x="0" y="200" width="600" height="120" fill="#c7d2fe" />
      <rect x="210" y="175" width="180" height="28" rx="8" fill="#8b5cf6" />
      <ellipse cx="300" cy="160" rx="28" ry="22" fill="#312e81" />
      <ellipse cx="300" cy="142" rx="22" ry="6" fill="#34d399" />
      <circle cx="292" cy="126" r="5" fill="#a7f3d0" opacity="0.85" />
      <circle cx="308" cy="116" r="7" fill="#fbcfe8" opacity="0.85" />
      <circle cx="298" cy="102" r="4" fill="#fde68a" opacity="0.85" />
    `;
  }
  if (backdropType === 'hallway') {
    return `
      <rect width="600" height="320" fill="#fdf2f8" />
      <rect x="0" y="0" width="600" height="195" fill="#fce7f3" />
      <rect x="0" y="195" width="600" height="125" fill="#e9d5ff" />
      <rect x="240" y="45" width="120" height="150" rx="60" fill="#ddd6fe" stroke="#c4b5fd" stroke-width="6" />
      <rect x="90" y="65" width="70" height="90" rx="8" fill="#fef08a" stroke="#f59e0b" stroke-width="3" />
      <rect x="440" y="65" width="70" height="90" rx="8" fill="#fef08a" stroke="#f59e0b" stroke-width="3" />
    `;
  }
  // Default: courtyard
  return `
    <defs>
      <linearGradient id="ep-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#bae6fd" />
        <stop offset="100%" stop-color="#fef9c3" />
      </linearGradient>
    </defs>
    <rect width="600" height="320" fill="url(#ep-sky)" />
    <circle cx="520" cy="54" r="28" fill="#fde047" opacity="0.9" />
    <path d="M180 200 L220 90 L260 200 Z" fill="#f9a8d4" />
    <path d="M250 200 L300 65 L350 200 Z" fill="#c4b5fd" />
    <path d="M340 200 L380 90 L420 200 Z" fill="#f9a8d4" />
    <rect x="0" y="200" width="600" height="120" fill="#bbf7d0" />
    <ellipse cx="300" cy="255" rx="180" ry="38" fill="#fde68a" opacity="0.65" />
  `;
}

function renderPrincessMaya(mayaMood = 'neutral') {
  const isHappy = mayaMood === 'happy';
  const isSad = mayaMood === 'sad';
  const isShy = mayaMood === 'shy';

  const mouthPath = isHappy
    ? 'M 442 132 Q 450 142 458 132'
    : isSad
      ? 'M 443 138 Q 450 131 457 138'
      : isShy
        ? 'M 444 134 Q 450 137 456 134'
        : 'M 443 134 Q 450 138 457 134';

  const leftEye = isHappy
    ? '<path d="M 436 116 Q 441 110 446 116" fill="none" stroke="#2d1e2f" stroke-width="2.6" stroke-linecap="round" />'
    : '<circle cx="441" cy="116" r="3.4" fill="#2d1e2f" />';
  const rightEye = isHappy
    ? '<path d="M 454 116 Q 459 110 464 116" fill="none" stroke="#2d1e2f" stroke-width="2.6" stroke-linecap="round" />'
    : '<circle cx="459" cy="116" r="3.4" fill="#2d1e2f" />';

  const blushOpacity = isHappy || isShy ? '0.65' : '0.3';

  return `
    <g id="episode-maya" class="episode-maya episode-maya--${mayaMood}">
      <!-- Hair back -->
      <path d="M 418 112 Q 414 165 426 190 L 474 190 Q 486 165 482 112 Z" fill="#4a2c2a" />
      <!-- Gown -->
      <path d="M 432 155 L 468 155 L 494 275 Q 450 288 406 275 Z" fill="#a855f7" stroke="#7e22ce" stroke-width="2" />
      <path d="M 435 155 L 465 155 L 458 188 L 442 188 Z" fill="#e9d5ff" />
      <!-- Arms -->
      <path d="M 432 162 Q 412 185 422 204" fill="none" stroke="#f6c6a5" stroke-width="8" stroke-linecap="round" />
      <path d="M 468 162 Q 488 185 478 204" fill="none" stroke="#f6c6a5" stroke-width="8" stroke-linecap="round" />
      <!-- Head -->
      <circle cx="450" cy="120" r="28" fill="#f6c6a5" />
      <!-- Hair bangs -->
      <path d="M 422 116 Q 434 92 450 94 Q 466 92 478 116 Q 464 102 450 105 Q 436 102 422 116 Z" fill="#4a2c2a" />
      <!-- Tiara -->
      <path d="M 434 94 L 440 80 L 450 88 L 460 80 L 466 94 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
      <circle cx="450" cy="86" r="3" fill="#ec4899" />
      <!-- Face -->
      ${leftEye}
      ${rightEye}
      <circle cx="433" cy="126" r="4.5" fill="#fb7185" opacity="${blushOpacity}" />
      <circle cx="467" cy="126" r="4.5" fill="#fb7185" opacity="${blushOpacity}" />
      <path d="${mouthPath}" fill="none" stroke="#2d1e2f" stroke-width="2.4" stroke-linecap="round" />
    </g>
  `;
}

function renderReactionOverlay(reactionType) {
  if (reactionType === 'sparkle' || reactionType === 'celebrate') {
    return `
      <g class="episode-reaction episode-reaction--sparkle">
        <text x="275" y="95" font-size="24">✨</text>
        <text x="315" y="75" font-size="28">💖</text>
        <text x="355" y="100" font-size="22">⭐</text>
      </g>
    `;
  }
  if (reactionType === 'cloud' || reactionType === 'reflect') {
    return `
      <g class="episode-reaction episode-reaction--cloud">
        <text x="415" y="65" font-size="24">💭</text>
      </g>
    `;
  }
  return '';
}

export function renderEpisodeSceneSvg(
  episode,
  beatIndex,
  princessState,
  princessConfig,
  { mayaMood = 'neutral', reactionType = 'none', mayaPrincess = null } = {}
) {
  const beats = Array.isArray(episode?.beats) ? episode.beats : [];
  const beat = beats[beatIndex] || beats[0] || {};
  const backdrop = beat.backdrop || 'courtyard';
  const playerSvg = renderPaperDollSvg(princessState, princessConfig);
  const mayaState = mayaPrincess || {
    ...createInitialState(princessConfig).princess,
    name: 'Princess Maya',
    petId: 'none'
  };
  const mayaSvg = renderPaperDollSvg(mayaState, princessConfig, { includePet: false });

  return `
    <svg class="episode-scene-svg" viewBox="0 0 600 320" role="img" aria-label="Episode scene">
      ${renderBackdrop(backdrop)}
      <svg x="35" y="18" width="205" height="295" viewBox="0 0 320 460">
        ${playerSvg}
      </svg>
      <g id="episode-maya" class="maya-figure maya-${mayaMood} episode-maya--${mayaMood}">
        <svg x="355" y="18" width="205" height="295" viewBox="0 0 320 460">
          ${mayaSvg}
        </svg>
        <rect x="415" y="294" width="90" height="20" rx="10" fill="rgba(255,255,255,0.9)" stroke="#b388eb" stroke-width="1.5"/>
        <text x="460" y="308" text-anchor="middle" font-size="11" font-weight="700" fill="#5e3a8c">Princess Maya</text>
      </g>
      ${renderReactionOverlay(reactionType)}
    </svg>
  `;
}
