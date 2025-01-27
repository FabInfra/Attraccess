import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { nestModuleGeneratorGenerator } from './api-module.generator';
import { NestModuleGeneratorGeneratorSchema } from './api-module.schema';

describe('nest-module-generator generator', () => {
  let tree: Tree;
  const options: NestModuleGeneratorGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await nestModuleGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
