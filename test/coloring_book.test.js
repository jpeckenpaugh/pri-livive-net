import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createColoringController, renderColoringPageSvg } from '../src/coloring_book.js';

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
