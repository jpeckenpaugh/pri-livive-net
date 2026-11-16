import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRoyalName } from '../src/names.js';

test('generateRoyalName formats prefix + firstName + of + realm', () => {
  const name = generateRoyalName(
    {
      prefixes: ['Princess'],
      firstNames: ['Luna'],
      realms: ['Starlight Castle']
    },
    () => 0
  );
  assert.equal(name, 'Princess Luna of Starlight Castle');
});
