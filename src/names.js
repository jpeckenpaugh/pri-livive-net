export function generateRoyalName(royalNames, rng = Math.random) {
  const prefixes = royalNames?.prefixes?.length ? royalNames.prefixes : ['Princess'];
  const firstNames = royalNames?.firstNames?.length ? royalNames.firstNames : ['Luna'];
  const realms = royalNames?.realms?.length ? royalNames.realms : ['Starlight Castle'];

  const pick = (arr) => arr[Math.floor(rng() * arr.length) % arr.length];
  return `${pick(prefixes)} ${pick(firstNames)} of ${pick(realms)}`;
}
