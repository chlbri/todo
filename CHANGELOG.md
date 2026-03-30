## CHANGELOG

<br/>
<br/>

<details>
<summary>

## **[0.1.0] - 30/03/2026** => _01:19_

</summary>

- **BREAKING** — `generateDeck` ne prend plus les paramètres `name` et `id`
  ; retourne directement `Todo2[]` au lieu d'un objet `Deck`
- Add state machine implementation (`machine.machine.ts`)
- Add auto-generated machine type definitions (`machine.machine.gen.ts`)
- Add machine error definitions (`machine.errors.ts`)
- Add `app:gen` and `app:gen:watch` scripts
- Fix rolldown build — add `require.js` CJS polyfill for `clone-deep`
  compatibility
- Refactor `generate.test.ts` — tests alignés sur la nouvelle signature de
  `generateDeck` (suppression des blocs `orphan` et `unique deck ids`)
- Remove `index.test.ts`
- Update `rxjs` and `valibot` moved to `peerDependencies`
- Add `@bemedev/app-ts`, `@bemedev/app-cli`, `@bemedev/decompose`
  dependencies
- <u>Test coverage **_100%_** on `generate.ts` and `schemas.ts`</u>

</details>

<br/>

<details>
<summary>

## **[0.0.1] - 29/03/2026** => _19:55_

</summary>

- Add `generateDeck` function — builds a tree-structured `Deck` from a flat
  list of `Todo` items
- Add Valibot schemas for `Todo`, `Todo2`, and `Deck` types
- Add `create` utility for schema-validated object factories
- Add auto-generated TypeScript type definitions for arrays, objects,
  strings, numbers, functions, promises, and transforms
- <u>Test coverage **_100%_** on `generate.ts` and `schemas.ts`</u>

</details>

<br/>

<br/>

## Auteur

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Liens

- [Documentation](https://github.com/chlbri/new-package)
