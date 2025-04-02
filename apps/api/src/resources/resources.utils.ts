import { Resource } from "@attraccess/database-entities";
import { ResourceImageService } from "../common/services/resource-image.service";

export function transformResource(resource: Resource, resourceImageService: ResourceImageService): Resource {
    const result = {
      ...resource,
      imageFilename: resourceImageService.getPublicPath(
        resource.id,
        resource.imageFilename
      ),
    };

    // Remove circular references
    if (resource.group) {
      delete resource.group.resources;
    }

    return result;
  };
