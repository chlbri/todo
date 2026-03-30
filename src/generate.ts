import type { Deck2, Todo, Todo2 } from './schemas';

/**
 * Recursively build a `Todo2` tree node for `todo`, attaching every todo
 * whose `parents` list contains `todo.id` as children.
 * A child that lists multiple parents is duplicated under each parent.
 */
const buildNode = (todo: Todo, all: Todo[]): Todo2 => {
  const children = all
    .filter(t => t.parents?.includes(todo.id))
    .map(child => buildNode(child, all));

  return { ...todo, children };
};

/**
 * Generate a `Deck` from a flat list of `Todo` items.
 *
 * The todos are organised into a tree:
 * - Root todos (no parents, or parents not present in the list) sit at the
 *   top level of `deck.todos`.
 * - Each todo is attached as a child under every parent it references,
 *   meaning a todo with multiple parents will be **duplicated** once per
 *   parent.
 *
 * @param name  The name of the deck.
 * @param todos The flat list of todos to organise.
 */
export const generateDeck = (name: string, ...todos: Todo[]): Deck2 => {
  const ids = new Set(todos.map(t => t.id));

  // Roots: todos with no parents, or whose parents are all outside the list
  const roots = todos.filter(
    t => !t.parents?.length || !t.parents.some(pid => ids.has(pid)),
  );

  return {
    name,
    id: crypto.randomUUID(),
    todos: roots.map(root => buildNode(root, todos)),
  };
};
