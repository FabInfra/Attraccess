import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { createRequire } from 'module';
import { PluginManifest } from './plugin.manifest';
import { PluginService, pluginConfig } from './plugin.service';
import { PluginController } from './plugin.controller';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({})
export class PluginModule {
  private static pluginManifests: PluginManifest[];
  private static logger = new Logger(PluginModule.name);

  public static forRoot(): DynamicModule {
    // Load plugin configuration
    const config = pluginConfig();
    
    if (config.DISABLE_PLUGINS) {
      PluginModule.logger.log('Plugins are disabled');

      return {
        module: PluginModule,
        imports: [ConfigModule.forFeature(pluginConfig)],
        providers: [PluginService],
        controllers: [PluginController],
      };
    }

    this.pluginManifests = PluginService.getPlugins();

    const pluginModules = this.pluginManifests
      .map((manifest) => {
        try {
          const module = PluginModule.loadPluginModule(manifest);
          PluginService.markPluginAsLoaded(`${manifest.name}@${manifest.version}`);
          return module;
        } catch (error) {
          this.logger.error(`Error loading plugin ${manifest.name}`, error);
          PluginService.setPluginLoadError(`${manifest.name}@${manifest.version}`, error as Error);
          return null;
        }
      })
      .filter((module) => module !== null);

    return {
      module: PluginModule,
      providers: [PluginService],
      imports: [
        ConfigModule.forFeature(pluginConfig),
        ...pluginModules
      ],
      controllers: [PluginController],
    };
  }

  private static loadPluginModule(manifest: PluginManifest): DynamicModule {
    this.logger.log(`Loading plugin ${manifest.name} from ${manifest.main.backend.directory}`);

    if (!manifest.main.backend?.directory || !manifest.main.backend?.entryPoint) {
      this.logger.error(`Plugin ${manifest.name} has no backend, skipping backend module loading`);
      return null;
    }

    const pluginRequire = createRequire(__filename);
    const importedModule = pluginRequire(
      join(PluginService.PLUGIN_PATH, manifest.main.backend.directory, manifest.main.backend.entryPoint)
    );

    this.logger.log(`Imported module: ${manifest.name}`);

    return importedModule.default;
  }
}
