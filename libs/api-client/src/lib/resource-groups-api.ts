import { PaginatedResponse, Resource } from './api';

export interface ResourceGroup {
  /**
   * The unique identifier of the resource group
   * @example 1
   */
  id: number;
  /**
   * The name of the resource group
   * @example "3D Printers"
   */
  name: string;
  /**
   * When the resource group was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the resource group was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface CreateResourceGroupDto {
  /**
   * The name of the resource group
   * @example "3D Printers"
   */
  name: string;
}

export interface UpdateResourceGroupDto {
  /**
   * The name of the resource group
   * @example "3D Printers"
   */
  name?: string;
}

export interface AssignResourceToGroupDto {
  /**
   * The ID of the resource to assign to the group
   * @example 1
   */
  resourceId: number;
}

export interface ListResourceGroupsParams {
  /**
   * Page number (1-based)
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Number of items per page
   * @min 1
   * @default 10
   */
  limit?: number;
  /** Search term to filter resource groups */
  search?: string;
}

export type ResourceGroupsControllerCreateGroupData = ResourceGroup;
export type ResourceGroupsControllerGetGroupsData = PaginatedResponse & {
  data: ResourceGroup[];
};
export type ResourceGroupsControllerGetGroupByIdData = ResourceGroup;
export type ResourceGroupsControllerUpdateGroupData = ResourceGroup;
export type ResourceGroupsControllerDeleteGroupData = void;
export type ResourceGroupsControllerGetResourcesInGroupData =
  PaginatedResponse & {
    data: Resource[];
  };
export type ResourceGroupsControllerAssignResourceToGroupData = Resource;
export type ResourceGroupsControllerRemoveResourceFromGroupData = Resource;
