import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  createColoringController,
  renderColoringPageSvg,
  addStroke,
  undoStroke,
  clearDrawings
} from '../src/coloring_book.js';

const coloringData = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'data/coloring_pages.json'), 'utf8')
);

test('coloring controller fills regions, supports undo, and clears page', () => {
  const controller = createColoringController(coloringData.pages);
  const pageId = 'royal-princess-ballgown';

  let fills = {};
  const res1 = controller.fillRegion(fills, pageId, 'crown', '#FFD166');
  assert.equal(res1.changed, true);
  fills = res1.fillsByPage;
  assert.equal(fills[pageId].crown, '#FFD166');
  assert.equal(controller.canUndo(pageId), true);

  const undoRes = controller.undo(fills, pageId);
  assert.equal(undoRes.undone, true);
  fills = undoRes.fillsByPage;
  assert.equal(fills[pageId].crown, undefined);

  const res2 = controller.fillRegion(fills, pageId, 'bodice', '#FF70A6');
  fills = controller.clearPage(res2.fillsByPage, pageId);
  assert.equal(fills[pageId], undefined);
  assert.equal(controller.canUndo(pageId), false);
});

test('renderColoringPageSvg renders clickable regions and crisp lines', () => {
  const page = coloringData.pages[0];
  const svg = renderColoringPageSvg(page, { crown: '#FFD166' });
  assert.ok(svg.includes('data-region-id="crown"'));
  assert.ok(svg.includes('fill="#FFD166"'));
  assert.ok(svg.includes('class="coloring-line"'));
});

test('addStroke, undoStroke, and clearDrawings manage free-draw strokes immutably', () => {
  const pageId = 'royal-princess-ballgown';
  const stroke1 = { color: '#FF70A6', width: 6, d: 'M 10 10 L 20 20' };
  const stroke2 = { color: '#FFD166', width: 12, d: 'M 30 30 L 40 40' };

  let drawings = addStroke({}, pageId, stroke1);
  drawings = addStroke(drawings, pageId, stroke2);
  assert.equal(drawings[pageId].length, 2);
  assert.deepEqual(drawings[pageId][1], stroke2);

  const undo1 = undoStroke(drawings, pageId);
  assert.equal(undo1.undone, true);
  assert.equal(undo1.drawingsByPage[pageId].length, 1);

  const undoEmpty = undoStroke({}, pageId);
  assert.equal(undoEmpty.undone, false);

  const cleared = clearDrawings(drawings, pageId);
  assert.equal(cleared[pageId], undefined);
});

test('renderColoringPageSvg renders free-draw strokes in #layer-free-draw', () => {
  const page = coloringData.pages[0];
  const strokes = [{ color: '#FF70A6', width: 6, d: 'M 10 10 L 50 50' }];
  const svg = renderColoringPageSvg(page, {}, strokes);
  assert.ok(svg.includes('id="layer-free-draw"'));
  assert.ok(svg.includes('class="free-draw-stroke"'));
  assert.ok(svg.includes('d="M 10 10 L 50 50"'));
  assert.ok(svg.includes('stroke="#FF70A6"'));
  assert.ok(svg.includes('stroke-width="6"'));
});
