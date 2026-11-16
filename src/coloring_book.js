export function createColoringController(pages = []) {
  const undoStacks = new Map();

  function getPage(pageId) {
    return pages.find((p) => p.id === pageId) || pages[0] || null;
  }

  function getStack(pageId) {
    if (!undoStacks.has(pageId)) {
      undoStacks.set(pageId, []);
    }
    return undoStacks.get(pageId);
  }

  function fillRegion(fillsByPage, pageId, regionId, colorHex) {
    const next = { ...(fillsByPage || {}) };
    const pageFills = { ...(next[pageId] || {}) };
    const previousColor = pageFills[regionId] ?? null;

    if (previousColor === colorHex) {
      return { fillsByPage: next, changed: false };
    }

    getStack(pageId).push({ regionId, previousColor });
    pageFills[regionId] = colorHex;
    next[pageId] = pageFills;
    return { fillsByPage: next, changed: true };
  }

  function undo(fillsByPage, pageId) {
    const stack = getStack(pageId);
    if (stack.length === 0) {
      return { fillsByPage: fillsByPage || {}, undone: false };
    }
    const entry = stack.pop();
    const next = { ...(fillsByPage || {}) };
    const pageFills = { ...(next[pageId] || {}) };
    if (entry.previousColor === null) {
      delete pageFills[entry.regionId];
    } else {
      pageFills[entry.regionId] = entry.previousColor;
    }
    next[pageId] = pageFills;
    return { fillsByPage: next, undone: true };
  }

  function clearPage(fillsByPage, pageId) {
    const next = { ...(fillsByPage || {}) };
    delete next[pageId];
    undoStacks.set(pageId, []);
    return next;
  }

  function canUndo(pageId) {
    return getStack(pageId).length > 0;
  }

  return {
    getPage,
    fillRegion,
    undo,
    clearPage,
    canUndo
  };
}

export function addStroke(drawingsByPage, pageId, stroke) {
  const next = { ...(drawingsByPage || {}) };
  const existing = Array.isArray(next[pageId]) ? next[pageId] : [];
  next[pageId] = [...existing, stroke];
  return next;
}

export function undoStroke(drawingsByPage, pageId) {
  const next = { ...(drawingsByPage || {}) };
  const existing = Array.isArray(next[pageId]) ? next[pageId] : [];
  if (existing.length === 0) {
    return { drawingsByPage: next, undone: false };
  }
  next[pageId] = existing.slice(0, -1);
  return { drawingsByPage: next, undone: true };
}

export function clearDrawings(drawingsByPage, pageId) {
  const next = { ...(drawingsByPage || {}) };
  delete next[pageId];
  return next;
}

export function renderColoringPageSvg(page, pageFills = {}, pageDrawings = []) {
  if (!page) return '';
  const regionsSvg = page.regions
    .map((r) => {
      const fill = pageFills[r.id] || r.defaultFill || '#FFFFFF';
      return `<path class="coloring-region" data-region-id="${r.id}" d="${r.d}" fill="${fill}" stroke="#2B2D42" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" />`;
    })
    .join('\n');

  const linesSvg = (page.lines || [])
    .map(
      (d) =>
        `<path class="coloring-line" d="${d}" fill="none" stroke="#2B2D42" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pointer-events="none" />`
    )
    .join('\n');

  const strokesSvg = (Array.isArray(pageDrawings) ? pageDrawings : [])
    .map(
      (s) =>
        `<path class="free-draw-stroke" d="${s.d}" fill="none" stroke="${s.color}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round" />`
    )
    .join('\n');

  return `<svg class="coloring-svg" viewBox="${page.viewBox || '0 0 320 340'}" role="img" aria-label="${page.title}">
    ${regionsSvg}
    ${linesSvg}
    <g id="layer-free-draw" pointer-events="none">${strokesSvg}</g>
  </svg>`;
}
