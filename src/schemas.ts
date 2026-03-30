import * as v from 'valibot';

export const ID = v.pipe(
  v.optional(v.pipe(v.string(), v.uuid()), crypto.randomUUID()),
  v.description(
    'the REGEX is :/^[\\da-f]{8}(?:-[\\da-f]{4}){3}-[\\da-f]{12}$/iu',
  ),
);

export const todo = v.pipe(
  v.object({
    label: v.pipe(v.string(), v.description('The name of the task')),
    id: v.pipe(ID, v.description('The id of the task')),

    completed: v.pipe(
      v.optional(v.boolean(), false),
      v.description('The status of the task'),
    ),

    description: v.pipe(
      v.optional(v.string(), ''),
      v.description('The description of the task'),
    ),

    parents: v.pipe(
      v.optional(v.array(v.string()), []),
      v.description('The todo parents linked to this task'),
    ),
  }),
  v.description('The todo item'),
);

export type Todo = v.InferOutput<typeof todo>;

export type Todo2 = {
  label: string;
  id?: string;
  completed?: boolean;
  description?: string;
  children: Todo2[];
};

export const todo2: v.GenericSchema<Todo2> = v.pipe(
  v.object({
    label: v.pipe(v.string(), v.description('The name of the task')),
    id: v.pipe(ID, v.description('The id of the task')),
    children: v.lazy(() => v.array(todo2)),

    completed: v.pipe(
      v.optional(v.boolean(), false),
      v.description('The status of the task'),
    ),

    description: v.pipe(
      v.optional(v.string(), ''),
      v.description('The description of the task'),
    ),
  }),
  v.description('The todo item'),
);

export const deck = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.description('The name of the deck')),
    id: v.pipe(ID, v.description('The id of the deck')),
    todos: v.pipe(
      v.array(todo),
      v.description('The todos linked to this deck'),
    ),
  }),
  v.description('The deck item'),
);

export type Deck = v.InferOutput<typeof deck>;
