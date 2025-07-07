# OpenAPI

## Overview

OpenAPI (formerly known as Swagger) is a specification for machine-readable interface files for describing, producing, consuming, and visualizing RESTful web services. The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to RESTful APIs which allows both humans and computers to discover and understand the capabilities of the service.

Key benefits include:

- **API Documentation**: Clear, interactive documentation for APIs
- **Code Generation**: Automatic generation of client SDKs in various languages
- **Standardization**: Consistent documentation format across services
- **Testing & Validation**: Simplifies API testing and validation

Learn more about OpenAPI:

- [OpenAPI Specification](https://swagger.io/specification/)
- [OpenAPI Initiative](https://www.openapis.org/)
- [Swagger Documentation](https://swagger.io/docs/)

## FabAccess OpenAPI Support

All FabAccess endpoints are documented using OpenAPI specifications. This provides a comprehensive API reference that can be explored interactively.

### Accessing the OpenAPI UI

Once you have a running FabAccess instance, you can access the OpenAPI UI at:

```
<your-fabaccess-url>/api
```

This interactive interface allows you to:

- Browse all available endpoints
- View request and response models
- Test API calls directly from the UI
- Understand authentication requirements

### Accessing the OpenAPI Schema

The raw OpenAPI schema is available in JSON format at:

```
<your-fabaccess-url>/api-json
```

This schema can be downloaded and used with various OpenAPI tools for client code generation, documentation, and more.

### Accessing the Documentation

The full FabAccess documentation is available through docsify and can be accessed at:

```
<your-fabaccess-url>/docs
```

This provides comprehensive documentation on all aspects of FabAccess, including setup guides, user guides, and developer documentation.

## Generating Client Code

The OpenAPI schema can be used to generate client code in various programming languages, which helps ensure type safety and reduces the amount of boilerplate code needed to interact with the API.

You can use tools like:

- [OpenAPI Generator](https://openapi-generator.tech/) - Supports 50+ languages
- [Swagger Codegen](https://github.com/swagger-api/swagger-codegen) - Official Swagger code generation tool
- [NSwag](https://github.com/RicoSuter/NSwag) - .NET-focused OpenAPI toolchain

### Pre-Generated FabAccess Clients

FabAccess automatically generates JavaScript/TypeScript clients based on the OpenAPI schema. These clients are available as npm packages:

- **@fabaccess/api-client**: Basic fetch-based API client

  ```bash
  npm install @fabaccess/api-client
  ```

- **@fabaccess/react-query-client**: Client with React Query integration for React applications
  ```bash
  npm install @fabaccess/react-query-client
  ```

These pre-generated clients provide type-safe access to all FabAccess endpoints with proper TypeScript typing, reducing implementation time and potential errors when interacting with the API.
