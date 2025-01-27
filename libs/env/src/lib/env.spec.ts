import { loadEnv } from './env';
import { z } from 'zod';

describe('env', () => {
  it('should work', () => {
    expect(loadEnv(z.object({}))).toEqual({});
  });

  it('should return a parsed env object', () => {
    const env = {
      TEST: 'test',
      TEST_AS_INT: '1',
    };

    expect(
      loadEnv(
        z.object({
          TEST: z.string(),
          TEST_AS_INT: z.string().transform(Number),
        }),
        env
      )
    ).toEqual({
      TEST: 'test',
      TEST_AS_INT: 1,
    });
  });

  it('should throw an error if the env is missing a required field', () => {
    expect(() =>
      loadEnv(
        z.object({
          TEST: z.string(),
          TEST_AS_INT: z.string().transform(Number),
        }),
        {}
      )
    ).toThrow();
  });
});
