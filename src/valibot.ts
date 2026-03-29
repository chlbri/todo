import * as v from 'valibot';
import { expandFn } from '#bemedev/globals/utils/expandFn';

type BS = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

export const create = expandFn(
  <const T extends BS>(schema: T) => {
    return (out: v.InferInput<T>) => v.parse(schema, out);
  },
  {
    low: <T extends BS>(schema: T) => {
      return (out: unknown) => v.safeParse(schema, out);
    },

    strict: <const T extends BS>(schema: T) => {
      return (out: unknown) => v.parse(schema, out);
    },

    typed: <const T extends BS>(schema: T) => {
      return (out: v.InferInput<T>) => v.parse(schema, out);
    },

    async: expandFn(
      <const T extends BS>(schema: T) => {
        return (out: v.InferInput<T>) => v.parseAsync(schema, out);
      },
      {
        low: <T extends BS>(schema: T) => {
          return (out: unknown) => v.safeParseAsync(schema, out);
        },

        strict: <const T extends BS>(schema: T) => {
          return (out: unknown) => v.parseAsync(schema, out);
        },

        typed: <const T extends BS>(schema: T) => {
          return (out: v.InferInput<T>) => v.parseAsync(schema, out);
        },
      },
    ),
  },
);
