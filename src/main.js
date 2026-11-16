import { createStore } from './state.js';
import { createColoringController } from './coloring_book.js';
import { createSoundPlayer } from './audio.js';
import { mountApp } from './ui.js';

async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }
  return res.json();
}

async function bootstrap() {
  const root = document.getElementById('app');
  if (!root) return;

  try {
    const [config, coloringData, soundsMap, ballroomConfig, lessonsConfig] = await Promise.all([
      loadJson('./data/princess_config.json'),
      loadJson('./data/coloring_pages.json'),
      loadJson('./data/sounds.json'),
      loadJson('./data/ballroom_config.json'),
      loadJson('./data/lessons_config.json')
    ]);

    const store = createStore(null, globalThis.localStorage, config);
    const coloringController = createColoringController(coloringData.pages);
    const soundPlayer = createSoundPlayer(soundsMap);

    mountApp({
      root,
      store,
      config,
      coloringData,
      coloringController,
      soundPlayer,
      ballroomConfig,
      lessonsConfig
    });
  } catch (err) {
    root.innerHTML = `<div class="error-banner">Oops! Could not open the Princess Studio. (${err.message})</div>`;
  }
}

bootstrap();
