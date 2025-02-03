import { loadEnv } from './env';

describe('env', () => {
  it('should work', () => {
    expect(loadEnv(() => ({}))).toEqual({});
  });

  it('should return a parsed env object', () => {
    const env = {
      TEST: 'test',
      TEST_AS_INT: '1',
    };

    expect(
      loadEnv(
        (z) => ({
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
        (z) => ({
          TEST: z.string(),
          TEST_AS_INT: z.string().transform(Number),
        }),
        {}
      )
    ).toThrow();
  });
});
