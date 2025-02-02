import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { applicationGenerator } from '@nx/nest';
import { apiModuleGeneratorGenerator } from './api-module.generator';

// Helper function to generate all possible combinations of boolean options
function generateOptionPermutations(optionNames: string[]): Array<Record<string, boolean>> {
  const permutations: Array<Record<string, boolean>> = [];
  const totalCombinations = Math.pow(2, optionNames.length);

  for (let i = 0; i < totalCombinations; i++) {
    const combination: Record<string, boolean> = {};
    optionNames.forEach((name, index) => {
      combination[name] = !!(i & (1 << index));
    });
    permutations.push(combination);
  }

  return permutations;
}

describe('nest-module-generator generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await applicationGenerator(tree, { name: 'api', directory: 'apps' });
  });

  test.each(generateOptionPermutations([
    'createService',
    'createController',
  ]))(
    'should create module with correct files',
    async ({ createService, createController }) => {
      await apiModuleGeneratorGenerator(tree, {
        name: 'test',
        createService,
        createController,
      });

      expect(tree.exists(`apps/api/src/test/test.module.ts`)).toBe(true);
      expect(tree.exists(`apps/api/src/test/test.service.ts`)).toBe(
        createService
      );
      expect(tree.exists(`apps/api/src/test/test.controller.ts`)).toBe(
        createController
      );
    }
  );
});
