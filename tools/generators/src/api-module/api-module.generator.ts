import { Tree } from '@nx/devkit';
import { ApiModuleGeneratorGeneratorSchema } from './api-module.schema';
import {
  moduleGenerator,
  serviceGenerator,
  controllerGenerator,
} from '@nx/nest';

export async function apiModuleGeneratorGenerator(
  tree: Tree,
  options: ApiModuleGeneratorGeneratorSchema
) {
  const apiAppRoot = `apps/api`;

  await moduleGenerator(tree, {
    path: `${apiAppRoot}/src/${options.name}/${options.name}.module.ts`,
  });

  if (options.createService) {
    await serviceGenerator(tree, {
      path: `${apiAppRoot}/src/${options.name}/${options.name}.service.ts`,
    });
  }

  if (options.createController) {
    await controllerGenerator(tree, {
      path: `${apiAppRoot}/src/${options.name}/${options.name}.controller.ts`,
    });
  }
}

export default apiModuleGeneratorGenerator;
