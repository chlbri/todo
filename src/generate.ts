import type { Todo, Todo2 } from './schemas';

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
 * Build a `Todo2` tree from a flat list of `Todo` items.
 *
 * Root todos (those with no parents) sit at the top level.
 * A todo with multiple parents is duplicated under each parent.
 */
export const generateDeck = (...todos: Todo[]): Todo2[] => {
  const roots = todos
    .filter(t => !t.parents?.length)
    .map(root => buildNode(root, todos));

  return roots;
};
