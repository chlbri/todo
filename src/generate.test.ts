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
  parents: [A.id, B.id],
});
const E = makeTodo({
  id: 'eeeeeeee-0000-0000-0000-000000000005',
  label: 'E',
  parents: [B.id],
});

describe('generateDeck', () => {
  describe('#01 => empty list', () => {
    test('#01 => is empty', () => expect(generateDeck()).toHaveLength(0));
  });

  describe('#02 => single root', () => {
    const deck = generateDeck(A);
    const root = deck[0];

    test('#01 => one root', () => expect(deck).toHaveLength(1));
    test('#02 => root id is A.id', () => expect(root.id).toBe(A.id));
    test('#03 => root label', () => expect(root.label).toBe(A.label));

    test('#04 => no children', () =>
      expect(root.children).toHaveLength(0));
  });

  describe('#03 => multiple flat roots', () => {
    const X = makeTodo({
      label: 'X',
    });

    const Y = makeTodo({
      label: 'Y',
    });

    const Z = makeTodo({
      label: 'Z',
    });

    const deck = generateDeck(X, Y, Z);
    const [nodeX, nodeY, nodeZ] = deck;

    test('#01 => three roots', () => expect(deck).toHaveLength(3));
    test('#02 => X is leaf', () => expect(nodeX.children).toHaveLength(0));
    test('#03 => Y is leaf', () => expect(nodeY.children).toHaveLength(0));
    test('#04 => Z is leaf', () => expect(nodeZ.children).toHaveLength(0));
  });

  describe('#04 => one parent, one child', () => {
    const deck = generateDeck(A, B);
    const root = deck[0];
    const child = root.children[0];

    test('#01 => one root', () => expect(deck).toHaveLength(1));
    test('#02 => root is A', () => expect(root.id).toBe(A.id));
    test('#03 => one child', () => expect(root.children).toHaveLength(1));
    test('#04 => child is B', () => expect(child.id).toBe(B.id));
    test('#05 => leaf node', () => expect(child.children).toHaveLength(0));
  });

  describe('#05 => one parent, multiple children', () => {
    const deck = generateDeck(A, B, C);
    const root = deck[0];
    const childIds = root.children.map(c => c.id);

    test('#01 => two children', () => {
      expect(root.children).toHaveLength(2);
    });

    test('#02 => B is a child', () => expect(childIds).toContain(B.id));
    test('#03 => C is a child', () => expect(childIds).toContain(C.id));
  });

  describe('#06 => multiple parents → duplication', () => {
    const deck = generateDeck(A, B, D);
    const root = deck[0];
    const rootChildIds = root.children.map(c => c.id);
    const nodeB = root.children.find(c => c.id === B.id)!;
    const dUnderA = root.children.find(c => c.id === D.id)!;
    const dUnderB = nodeB.children.find(c => c.id === D.id)!;

    test('#01 => root is A', () => expect(root.id).toBe(A.id));
    test('#02 => D under A', () => expect(rootChildIds).toContain(D.id));
    test('#03 => B under A', () => expect(rootChildIds).toContain(B.id));
    test('#04 => D under B', () => expect(dUnderB).toBeDefined());

    test('#05 => distinct copies', () => {
      expect(dUnderA).not.toBe(dUnderB);
    });
  });

  describe('#07 => deep nesting', () => {
    const deck = generateDeck(A, B, E);
    const root = deck[0];
    const nodeB = root.children[0];
    const nodeE = nodeB.children[0];

    test('#01 => one child', () => expect(nodeB.children).toHaveLength(1));
    test('#02 => child is E', () => expect(nodeE.id).toBe(E.id));

    test('#03 => E is a leaf', () => {
      expect(nodeE.children).toHaveLength(0);
    });
  });

  describe('#08 => mixed roots and children', () => {
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

    const deck = generateDeck(R1, R2, CH);
    const rootIds = deck.map(t => t.id);
    const nodeR1 = deck.find(t => t.id === R1.id)!;
    const nodeR2 = deck.find(t => t.id === R2.id)!;
    const nodeR1Child = nodeR1.children[0];

    test('#01 => two roots', () => expect(deck).toHaveLength(2));
    test('#02 => R1 is a root', () => expect(rootIds).toContain(R1.id));
    test('#03 => R2 is a root', () => expect(rootIds).toContain(R2.id));

    test('#04 => CH not a root', () => {
      expect(rootIds).not.toContain(CH.id);
    });

    test('#05 => R1 kids', () => expect(nodeR1.children).toHaveLength(1));

    test('#06 => R1 child is CH', () => {
      expect(nodeR1Child.id).toBe(CH.id);
    });

    test('#07 => R2 leaf', () => expect(nodeR2.children).toHaveLength(0));
  });
});
