# FabAccess

A comprehensive resource management system for tracking and managing access to shared resources.

## Features

- Resource Management
  - Track resource status, usage, and maintenance
  - Image support for resources with automatic resizing and caching
  - Role-based access control
  - Maintenance scheduling
  - Usage tracking and reporting

## ESPHome Integration

FabAccess provides [ESPHome components](https://github.com/FabInfra/FabAccess-esphome-components) for easily integrating IoT devices with your access control system:

- Real-time resource status monitoring via Server-Sent Events (SSE)
- No polling required - uses persistent connections for efficient updates
- Automatic reconnection if connection is lost
- Compatible with ESP8266/ESP32 devices
- Enables automation based on resource status (availability, usage, etc.)
- Provides both sensors and binary sensors for monitoring

To integrate your IoT devices with FabAccess, add this to your ESPHome configuration:

```yaml
external_components:
  - source:
      type: git
      url: https://github.com/FabInfra/FabAccess-esphome-components.git
    components: [fabaccess_resource]
```

See the [FabAccess ESPHome Components repository](https://github.com/FabInfra/FabAccess-esphome-components) for detailed documentation and examples.

## Image Support

Resources can have associated images to help users identify them. The system supports:

- Image upload during resource creation and updates
- Automatic image resizing and caching
- Supported formats: JPEG, PNG, WebP
- Maximum file size: 10MB
- Image dimensions: 16px-2000px
- Flexible URL structure:
  - Original image: `/storage/resources/{id}/original/{filename}`
  - Resized images: `/storage/cache/resources/{id}/{width}x{height}/{options_hash}/{filename}`
  - Optional parameters: fit (contain/cover/fill), format (webp/jpeg/png), quality

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run database migrations:
   ```bash
   nx run api:run-migrations
   ```

## Development

Start the development server:

```bash
nx serve api
```

The API will be available at `http://localhost:3000`.

## API Documentation

Swagger documentation is available at `/api` when the server is running.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/W8S3jvrL3V)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve api
```

To create a production bundle:

```sh
npx nx build api
```

To see all available targets to run for a project, run:

```sh
npx nx show project api
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/node:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

# This is a test comment
