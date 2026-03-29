import { describe, expect, test } from 'vitest';
import { generateDeck } from './generate';
import { todo } from './schemas';
import { create } from './valibot';

const makeTodo = create(todo);

const A = makeTodo({
  id: 'aaaaaaaa-0000-0000-0000-000000000001',
  label: 'A',
});
const B = makeTodo({
  id: 'bbbbbbbb-0000-0000-0000-000000000002',
  label: 'B',
  parents: [A.id],
});
const C = makeTodo({
  id: 'cccccccc-0000-0000-0000-000000000003',
  label: 'C',
  parents: [A.id],
});
const D = makeTodo({
  id: 'dddddddd-0000-0000-0000-000000000004',
  label: 'D',
  // two parents → duplicated under both A and B
  parents: [A.id, B.id],
});
const E = makeTodo({
  id: 'eeeeeeee-0000-0000-0000-000000000005',
  label: 'E',
  parents: [B.id],
});

describe('generateDeck – empty list', () => {
  test('returns a deck with an empty todos array', () => {
    const deck = generateDeck('empty');
    expect(deck.todos).toHaveLength(0);
    expect(deck.name).toBe('empty');
  });

  test('assigns a valid UUID as the deck id', () => {
    const deck = generateDeck('empty');
    const uuidRegex = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu;
    expect(deck.id).toMatch(uuidRegex);
  });
});

describe('generateDeck – single root', () => {
  test('produces one root Todo2 node', () => {
    const deck = generateDeck('single', A);
    expect(deck.todos).toHaveLength(1);
  });

  test('root node has correct fields', () => {
    const deck = generateDeck('single', A);
    const root = deck.todos[0];
    expect(root.id).toBe(A.id);
    expect(root.label).toBe(A.label);
    expect(root.children).toHaveLength(0);
  });
});

describe('generateDeck – multiple flat roots', () => {
  const X = makeTodo({
    id: 'fa000000-0000-0000-0000-000000000010',
    label: 'X',
  });
  const Y = makeTodo({
    id: 'fb000000-0000-0000-0000-000000000011',
    label: 'Y',
  });
  const Z = makeTodo({
    id: 'fc000000-0000-0000-0000-000000000012',
    label: 'Z',
  });

  test('every parentless todo becomes a root', () => {
    const deck = generateDeck('flat', X, Y, Z);
    expect(deck.todos).toHaveLength(3);
  });

  test('roots have no children', () => {
    const deck = generateDeck('flat', X, Y, Z);
    for (const root of deck.todos) {
      expect(root.children).toHaveLength(0);
    }
  });
});

describe('generateDeck – one parent, one child', () => {
  test('child is nested under its parent', () => {
    const deck = generateDeck('p-c', A, B);
    expect(deck.todos).toHaveLength(1); // only A is root
    expect(deck.todos[0].id).toBe(A.id);
    expect(deck.todos[0].children).toHaveLength(1);
    expect(deck.todos[0].children[0].id).toBe(B.id);
  });

  test('child node has no children of its own', () => {
    const deck = generateDeck('p-c', A, B);
    expect(deck.todos[0].children[0].children).toHaveLength(0);
  });
});

describe('generateDeck – one parent, multiple children', () => {
  test('both children appear under the parent', () => {
    const deck = generateDeck('siblings', A, B, C);
    const root = deck.todos[0];
    expect(root.children).toHaveLength(2);
    const childIds = root.children.map(c => c.id);
    expect(childIds).toContain(B.id);
    expect(childIds).toContain(C.id);
  });
});

describe('generateDeck – multiple parents → duplication', () => {
  // D has parents [A, B]. Tree should be:
  //  A
  //  ├─ B
  //  │  └─ D  (copy 1)
  //  └─ D     (copy 2)

  test('D is duplicated under each of its parents', () => {
    const deck = generateDeck('dup', A, B, D);
    const root = deck.todos[0]; // A
    expect(root.id).toBe(A.id);

    const rootChildIds = root.children.map(c => c.id);
    // D is a direct child of A
    expect(rootChildIds).toContain(D.id);
    // B is also a direct child of A
    expect(rootChildIds).toContain(B.id);

    // D is also a child of B
    const nodeB = root.children.find(c => c.id === B.id)!;
    expect(nodeB.children.map(c => c.id)).toContain(D.id);
  });

  test('duplicated nodes are independent objects', () => {
    const deck = generateDeck('dup', A, B, D);
    const root = deck.todos[0];

    const dUnderA = root.children.find(c => c.id === D.id)!;
    const nodeB = root.children.find(c => c.id === B.id)!;
    const dUnderB = nodeB.children.find(c => c.id === D.id)!;

    expect(dUnderA).not.toBe(dUnderB); // different object references
  });
});

describe('generateDeck – deep nesting', () => {
  test('grandchild is nested two levels deep', () => {
    const deck = generateDeck('deep', A, B, E);
    const root = deck.todos[0]; // A
    const nodeB = root.children[0]; // B
    expect(nodeB.children).toHaveLength(1);
    expect(nodeB.children[0].id).toBe(E.id);
    expect(nodeB.children[0].children).toHaveLength(0);
  });
});

describe('generateDeck – mixed roots and children', () => {
  const R1 = makeTodo({
    id: 'f1000000-0000-0000-0000-000000000020',
    label: 'R1',
  });
  const R2 = makeTodo({
    id: 'f2000000-0000-0000-0000-000000000021',
    label: 'R2',
  });
  const CH = makeTodo({
    id: 'ca000000-0000-0000-0000-000000000022',
    label: 'CH',
    parents: [R1.id],
  });

  test('only truly parentless todos are roots', () => {
    const deck = generateDeck('mixed', R1, R2, CH);
    expect(deck.todos).toHaveLength(2);
    const rootIds = deck.todos.map(t => t.id);
    expect(rootIds).toContain(R1.id);
    expect(rootIds).toContain(R2.id);
    expect(rootIds).not.toContain(CH.id);
  });

  test('child appears under the correct root only', () => {
    const deck = generateDeck('mixed', R1, R2, CH);
    const nodeR1 = deck.todos.find(t => t.id === R1.id)!;
    const nodeR2 = deck.todos.find(t => t.id === R2.id)!;
    expect(nodeR1.children).toHaveLength(1);
    expect(nodeR1.children[0].id).toBe(CH.id);
    expect(nodeR2.children).toHaveLength(0);
  });
});

describe('generateDeck – orphaned parent reference', () => {
  const orphan = makeTodo({
    id: 'a0000000-0000-0000-0000-000000000030',
    label: 'Orphan',
    parents: ['deadbeef-0000-0000-0000-000000000000'],
  });

  test('todo whose parent is absent becomes a root', () => {
    const deck = generateDeck('orphan', orphan);
    expect(deck.todos).toHaveLength(1);
    expect(deck.todos[0].id).toBe(orphan.id);
  });
});

describe('generateDeck – unique deck ids', () => {
  test('two calls return different ids', () => {
    const d1 = generateDeck('d1', A);
    const d2 = generateDeck('d2', A);
    expect(d1.id).not.toBe(d2.id);
  });
});
