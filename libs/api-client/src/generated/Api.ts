/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** The type of the provider */
export enum SSOProviderType {
  OIDC = "OIDC",
}

export interface CreateUserDto {
  /**
   * The username for the new user
   * @example "johndoe"
   */
  username: string;
  /**
   * The email address for the new user
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * The password for the new user
   * @example "password123"
   */
  password: string;
  /**
   * The authentication strategy to use
   * @example "local_password"
   */
  strategy: "local_password" | "sso";
}

export interface SystemPermissions {
  /**
   * Whether the user can manage resources
   * @example false
   */
  canManageResources: boolean;
  /**
   * Whether the user can manage system configuration
   * @example false
   */
  canManageSystemConfiguration: boolean;
  /**
   * Whether the user can manage users
   * @example false
   */
  canManageUsers: boolean;
}

export interface User {
  /**
   * The unique identifier of the user
   * @example 1
   */
  id: number;
  /**
   * The username of the user
   * @example "johndoe"
   */
  username: string;
  /**
   * Whether the user has verified their email address
   * @example true
   */
  isEmailVerified: boolean;
  /**
   * System-wide permissions for the user
   * @example {"canManageResources":true,"canManageSystemConfiguration":false,"canManageUsers":false}
   */
  systemPermissions: SystemPermissions;
  /**
   * When the user was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the user was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface VerifyEmailDto {
  /**
   * The token to verify the email
   * @example "1234567890"
   */
  token: string;
  /**
   * The email to verify
   * @example "john.doe@example.com"
   */
  email: string;
}

export type ResetPasswordDto = object;

export interface ChangePasswordDto {
  /**
   * The new password for the user
   * @example "password123"
   */
  password: string;
  /**
   * The token for the user
   * @example "1234567890"
   */
  token: string;
}

export type UserNotFoundException = object;

export interface PaginatedUsersResponseDto {
  total: number;
  page: number;
  limit: number;
  /** The next page number, or null if it is the last page. */
  nextPage: number | null;
  totalPages: number;
  data: User[];
}

export interface UpdateUserPermissionsDto {
  /**
   * Whether the user can manage resources
   * @example false
   */
  canManageResources?: boolean;
  /**
   * Whether the user can manage system configuration
   * @example false
   */
  canManageSystemConfiguration?: boolean;
  /**
   * Whether the user can manage users
   * @example false
   */
  canManageUsers?: boolean;
}

export interface UserPermissionsUpdateItem {
  /**
   * The user ID
   * @example 1
   */
  userId: number;
  /**
   * The permission updates to apply
   * @example {"canManageResources":true,"canManageSystemConfiguration":false,"canManageUsers":false}
   */
  permissions: UpdateUserPermissionsDto;
}

export interface BulkUpdateUserPermissionsDto {
  /** Array of user permission updates */
  updates: UserPermissionsUpdateItem[];
}

export interface CreateSessionResponse {
  /**
   * The user that has been logged in
   * @example {"id":1,"username":"testuser"}
   */
  user: User;
  /**
   * The authentication token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   */
  authToken: string;
}

export interface SSOProviderOIDCConfiguration {
  /**
   * The unique identifier of the provider
   * @example 1
   */
  id: number;
  /**
   * The ID of the SSO provider
   * @example 1
   */
  ssoProviderId: number;
  /**
   * The issuer of the provider
   * @example "https://sso.csh.rit.edu/auth/realms/csh"
   */
  issuer: string;
  /**
   * The authorization URL of the provider
   * @example "https://sso.csh.rit.edu/auth/realms/csh/protocol/openid-connect/auth"
   */
  authorizationURL: string;
  /**
   * The token URL of the provider
   * @example "https://sso.csh.rit.edu/auth/realms/csh/protocol/openid-connect/token"
   */
  tokenURL: string;
  /**
   * The user info URL of the provider
   * @example "https://sso.csh.rit.edu/auth/realms/csh/protocol/openid-connect/userinfo"
   */
  userInfoURL: string;
  /**
   * The client ID of the provider
   * @example "1234567890"
   */
  clientId: string;
  /**
   * The client secret of the provider
   * @example "1234567890"
   */
  clientSecret: string;
  /**
   * When the user was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the user was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface SSOProvider {
  /**
   * The unique identifier of the provider
   * @example 1
   */
  id: number;
  /**
   * The internal name of the provider
   * @example "Keycloak"
   */
  name: string;
  /**
   * The type of the provider
   * @example "OIDC"
   */
  type: SSOProviderType;
  /**
   * When the user was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the user was last updated
   * @format date-time
   */
  updatedAt: string;
  /** The OIDC configuration of the provider */
  oidcConfiguration: SSOProviderOIDCConfiguration;
}

export interface CreateOIDCConfigurationDto {
  /**
   * The issuer of the provider
   * @example "https://sso.example.com/auth/realms/example"
   */
  issuer: string;
  /**
   * The authorization URL of the provider
   * @example "https://sso.example.com/auth/realms/example/protocol/openid-connect/auth"
   */
  authorizationURL: string;
  /**
   * The token URL of the provider
   * @example "https://sso.example.com/auth/realms/example/protocol/openid-connect/token"
   */
  tokenURL: string;
  /**
   * The user info URL of the provider
   * @example "https://sso.example.com/auth/realms/example/protocol/openid-connect/userinfo"
   */
  userInfoURL: string;
  /**
   * The client ID of the provider
   * @example "attraccess-client"
   */
  clientId: string;
  /**
   * The client secret of the provider
   * @example "client-secret"
   */
  clientSecret: string;
}

export interface CreateSSOProviderDto {
  /**
   * The name of the SSO provider
   * @example "Company Keycloak"
   */
  name: string;
  /**
   * The type of SSO provider
   * @example "OIDC"
   */
  type: "OIDC";
  /** The OIDC configuration for the provider */
  oidcConfiguration?: CreateOIDCConfigurationDto;
}

export interface UpdateOIDCConfigurationDto {
  /**
   * The issuer of the provider
   * @example "https://sso.example.com/auth/realms/example"
   */
  issuer?: string;
  /**
   * The authorization URL of the provider
   * @example "https://sso.example.com/auth/realms/example/protocol/openid-connect/auth"
   */
  authorizationURL?: string;
  /**
   * The token URL of the provider
   * @example "https://sso.example.com/auth/realms/example/protocol/openid-connect/token"
   */
  tokenURL?: string;
  /**
   * The user info URL of the provider
   * @example "https://sso.example.com/auth/realms/example/protocol/openid-connect/userinfo"
   */
  userInfoURL?: string;
  /**
   * The client ID of the provider
   * @example "attraccess-client"
   */
  clientId?: string;
  /**
   * The client secret of the provider
   * @example "client-secret"
   */
  clientSecret?: string;
}

export interface UpdateSSOProviderDto {
  /**
   * The name of the SSO provider
   * @example "Company Keycloak"
   */
  name?: string;
  /** The OIDC configuration for the provider */
  oidcConfiguration?: UpdateOIDCConfigurationDto;
}

export interface CreateEmailTemplateDto {
  /**
   * Unique name for the template (e.g., verify-email, reset-password)
   * @maxLength 255
   * @example "verify-email"
   */
  name: string;
  /**
   * Email subject line
   * @maxLength 255
   * @example "Verify Your Email Address"
   */
  subject: string;
  /**
   * MJML content of the email body
   * @example "<mjml><mj-body><mj-section><mj-column><mj-text>Hello World</mj-text></mj-column></mj-section></mj-body></mjml>"
   */
  mjmlContent: string;
}

export type EmailTemplate = object;

export interface UpdateEmailTemplateDto {
  /**
   * Unique name for the template (e.g., verify-email, reset-password)
   * @maxLength 255
   * @example "verify-email"
   */
  name?: string;
  /**
   * Email subject line
   * @maxLength 255
   * @example "Verify Your Email Address"
   */
  subject?: string;
  /**
   * MJML content of the email body
   * @example "<mjml><mj-body><mj-section><mj-column><mj-text>Hello World Updated</mj-text></mj-column></mj-section></mj-body></mjml>"
   */
  mjmlContent?: string;
}

export interface CreateResourceGroupDto {
  name: string;
  description?: string;
}

export interface ResourceGroup {
  /**
   * The unique identifier of the resource group
   * @example 1
   */
  id: number;
  /**
   * The name of the resource
   * @example "3D Printer"
   */
  name: string;
  /**
   * A detailed description of the resource
   * @example "Prusa i3 MK3S+ 3D printer with 0.4mm nozzle"
   */
  description?: string;
  /**
   * When the resource was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the resource was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface PaginatedResourceGroupResponseDto {
  total: number;
  page: number;
  limit: number;
  /** The next page number, or null if it is the last page. */
  nextPage: number | null;
  totalPages: number;
  data: ResourceGroup[];
}

export interface UpdateResourceGroupDto {
  name?: string;
  description?: string;
}

export interface CreateResourceDto {
  /**
   * The name of the resource
   * @example "3D Printer"
   */
  name: string;
  /**
   * A detailed description of the resource
   * @example "Prusa i3 MK3S+ 3D printer with 0.4mm nozzle"
   */
  description?: string;
  /**
   * Resource image file
   * @format binary
   */
  image?: File;
  /**
   * The type of documentation (markdown or url)
   * @example "markdown"
   */
  documentationType?: "markdown" | "url";
  /**
   * Markdown content for resource documentation
   * @example "# Resource Documentation
   *
   * This is a markdown documentation for the resource."
   */
  documentationMarkdown?: string;
  /**
   * URL to external documentation
   * @example "https://example.com/documentation"
   */
  documentationUrl?: string;
  /**
   * Whether this resource allows overtaking by the next user without the prior user ending their session
   * @default false
   * @example false
   */
  allowTakeOver?: boolean;
}

export interface Resource {
  /**
   * The unique identifier of the resource
   * @example 1
   */
  id: number;
  /**
   * The name of the resource
   * @example "3D Printer"
   */
  name: string;
  /**
   * A detailed description of the resource
   * @example "Prusa i3 MK3S+ 3D printer with 0.4mm nozzle"
   */
  description?: string;
  /**
   * The filename of the resource image
   * @example "1234567890_abcdef.jpg"
   */
  imageFilename?: string;
  /**
   * The type of documentation (markdown or url)
   * @example "markdown"
   */
  documentationType?: "markdown" | "url";
  /**
   * Markdown content for resource documentation
   * @example "# Resource Documentation
   *
   * This is a markdown documentation for the resource."
   */
  documentationMarkdown?: string;
  /**
   * URL to external documentation
   * @example "https://example.com/documentation"
   */
  documentationUrl?: string;
  /**
   * Whether this resource allows overtaking by the next user without the prior user ending their session
   * @default false
   * @example false
   */
  allowTakeOver: boolean;
  /**
   * When the resource was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the resource was last updated
   * @format date-time
   */
  updatedAt: string;
  /** The groups the resource belongs to */
  groups: ResourceGroup[];
}

export interface PaginatedResourceResponseDto {
  total: number;
  page: number;
  limit: number;
  /** The next page number, or null if it is the last page. */
  nextPage: number | null;
  totalPages: number;
  data: Resource[];
}

export interface UpdateResourceDto {
  /**
   * The name of the resource
   * @example "3D Printer"
   */
  name?: string;
  /**
   * A detailed description of the resource
   * @example "Prusa i3 MK3S+ 3D printer with 0.4mm nozzle"
   */
  description?: string;
  /**
   * New resource image file
   * @format binary
   */
  image?: File;
  /**
   * Whether the resource image should be deleted
   * @default false
   */
  deleteImage?: boolean;
  /**
   * The type of documentation (markdown or url)
   * @example "markdown"
   */
  documentationType?: "markdown" | "url";
  /**
   * Markdown content for resource documentation
   * @example "# Resource Documentation
   *
   * This is a markdown documentation for the resource."
   */
  documentationMarkdown?: string;
  /**
   * URL to external documentation
   * @example "https://example.com/documentation"
   */
  documentationUrl?: string;
  /**
   * Whether this resource allows overtaking by the next user without the prior user ending their session
   * @example false
   */
  allowTakeOver?: boolean;
}

export interface StartUsageSessionDto {
  /**
   * Optional notes about the usage session
   * @example "Printing a prototype case"
   */
  notes?: string;
  /**
   * Whether to force takeover of an existing session (only works if resource allows takeover)
   * @default false
   * @example false
   */
  forceTakeOver?: boolean;
}

export interface ResourceUsage {
  /**
   * The unique identifier of the resource usage
   * @example 1
   */
  id: number;
  /**
   * The ID of the resource being used
   * @example 1
   */
  resourceId: number;
  /**
   * The ID of the user using the resource (null if user was deleted)
   * @example 1
   */
  userId?: number;
  /**
   * When the usage session started
   * @format date-time
   */
  startTime: string;
  /**
   * Notes provided when starting the session
   * @example "Starting prototype development for client XYZ"
   */
  startNotes?: string;
  /**
   * When the usage session ended
   * @format date-time
   */
  endTime?: string;
  /**
   * Notes provided when ending the session
   * @example "Completed initial prototype, material usage: 500g"
   */
  endNotes?: string;
  /** The resource being used */
  resource?: Resource;
  /** The user who used the resource */
  user?: User;
  /**
   * The duration of the usage session in minutes
   * @example 120
   */
  usageInMinutes: number;
}

export interface EndUsageSessionDto {
  /**
   * Additional notes about the completed session
   * @example "Print completed successfully"
   */
  notes?: string;
  /**
   * The end time of the session. If not provided, current time will be used.
   * @format date-time
   */
  endTime?: string;
}

export interface GetResourceHistoryResponseDto {
  total: number;
  page: number;
  limit: number;
  /** The next page number, or null if it is the last page. */
  nextPage: number | null;
  totalPages: number;
  data: ResourceUsage[];
}

export interface GetActiveUsageSessionDto {
  /** The active usage session or null if none exists */
  usage: ResourceUsage | null;
}

export interface CompleteIntroductionDto {
  /**
   * User ID
   * @example 1
   */
  userId?: number;
}

export interface ResourceIntroductionHistoryItem {
  /**
   * The unique identifier of the introduction history entry
   * @example 1
   */
  id: number;
  /**
   * The ID of the related introduction
   * @example 1
   */
  introductionId: number;
  /**
   * The action performed (revoke or unrevoke)
   * @example "revoke"
   */
  action: "revoke" | "unrevoke";
  /**
   * The ID of the user who performed the action
   * @example 1
   */
  performedByUserId: number;
  /**
   * Optional comment explaining the reason for the action
   * @example "User no longer requires access to this resource"
   */
  comment?: string;
  /**
   * When the action was performed
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /** The user who performed the action */
  performedByUser: User;
}

export interface ResourceIntroduction {
  /**
   * The unique identifier of the introduction
   * @example 1
   */
  id: number;
  /**
   * The ID of the resource
   * @example 1
   */
  resourceId: number;
  /**
   * The ID of the user who received the introduction
   * @example 1
   */
  receiverUserId: number;
  /**
   * The ID of the user who tutored the receiver
   * @example 2
   */
  tutorUserId: number;
  /**
   * When the introduction was completed
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  completedAt: string;
  /**
   * When the introduction record was created
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /** The user who received the introduction */
  receiverUser: User;
  /** The user who tutored the receiver */
  tutorUser: User;
  /** History of revoke/unrevoke actions for this introduction */
  history: ResourceIntroductionHistoryItem[];
}

export interface PaginatedResourceIntroductionResponseDto {
  total: number;
  page: number;
  limit: number;
  /** The next page number, or null if it is the last page. */
  nextPage: number | null;
  totalPages: number;
  data: ResourceIntroduction[];
}

export interface RevokeIntroductionDto {
  /**
   * Optional comment explaining the reason for revoking access
   * @example "User no longer works on this project"
   */
  comment?: string;
}

export interface UnrevokeIntroductionDto {
  /**
   * Optional comment explaining the reason for unrevoking access
   * @example "User rejoined the project"
   */
  comment?: string;
}

export interface ResourceIntroductionUser {
  /**
   * The unique identifier of the introduction permission
   * @example 1
   */
  id: number;
  /**
   * The ID of the resource
   * @example 1
   */
  resourceId: number;
  /**
   * The ID of the user who can give introductions
   * @example 1
   */
  userId: number;
  /**
   * When the permission was granted
   * @format date-time
   */
  grantedAt: string;
  /** The user who can give introductions */
  user: User;
}

export interface CanManageIntroducersResponseDto {
  /**
   * Whether the user can manage introducers for the resource
   * @example true
   */
  canManageIntroducers: boolean;
}

export interface MqttServer {
  /**
   * The unique identifier of the MQTT server
   * @example 1
   */
  id: number;
  /**
   * Friendly name for the MQTT server
   * @example "Workshop MQTT Server"
   */
  name: string;
  /**
   * MQTT server hostname/IP
   * @example "mqtt.example.com"
   */
  host: string;
  /**
   * MQTT server port (default: 1883 for MQTT, 8883 for MQTTS)
   * @example 1883
   */
  port: number;
  /**
   * Optional authentication username
   * @example "mqttuser"
   */
  username?: string;
  /**
   * Optional authentication password
   * @example "password123"
   */
  password?: string;
  /**
   * Client ID for MQTT connection
   * @example "attraccess-client-1"
   */
  clientId?: string;
  /**
   * Whether to use TLS/SSL
   * @example false
   */
  useTls: boolean;
  /**
   * When the MQTT server was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the MQTT server was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface CreateMqttServerDto {
  /** Friendly name for the MQTT server */
  name: string;
  /** Hostname or IP address of the MQTT server */
  host: string;
  /**
   * Port number of the MQTT server
   * @example 1883
   */
  port: number;
  /** Optional username for authentication */
  username?: string;
  /** Optional password for authentication */
  password?: string;
  /** Optional client ID for MQTT connection */
  clientId?: string;
  /**
   * Whether to use TLS/SSL for the connection
   * @default false
   */
  useTls?: boolean;
}

export interface UpdateMqttServerDto {
  /** Friendly name for the MQTT server */
  name?: string;
  /** Hostname or IP address of the MQTT server */
  host?: string;
  /**
   * Port number of the MQTT server
   * @example 1883
   */
  port?: number;
  /** Optional username for authentication */
  username?: string;
  /** Optional password for authentication */
  password?: string;
  /** Optional client ID for MQTT connection */
  clientId?: string;
  /**
   * Whether to use TLS/SSL for the connection
   * @default false
   */
  useTls?: boolean;
}

export interface TestConnectionResponseDto {
  /**
   * Whether the connection test was successful
   * @example true
   */
  success: boolean;
  /**
   * Message describing the test result
   * @example "Connection successful"
   */
  message: string;
}

export interface MqttHealthStatusDto {
  /**
   * Whether the connection is healthy
   * @example true
   */
  healthy: boolean;
  /**
   * Detailed health status message
   * @example "Connected: true, Failures: 0/3, Messages: 10 sent, 0 failed"
   */
  details: string;
}

export interface MqttConnectionStatsDto {
  /**
   * Number of connection attempts
   * @example 5
   */
  connectionAttempts: number;
  /**
   * Number of failed connections
   * @example 1
   */
  connectionFailures: number;
  /**
   * Number of successful connections
   * @example 4
   */
  connectionSuccesses: number;
  /**
   * Timestamp of last successful connection
   * @format date-time
   * @example "2023-01-01T12:00:00.000Z"
   */
  lastConnectTime?: string;
  /**
   * Timestamp of last disconnection
   * @format date-time
   * @example "2023-01-01T12:30:00.000Z"
   */
  lastDisconnectTime?: string;
}

export interface MqttMessageStatsDto {
  /**
   * Number of successfully published messages
   * @example 42
   */
  published: number;
  /**
   * Number of failed message publications
   * @example 3
   */
  failed: number;
  /**
   * Timestamp of last successful message publication
   * @format date-time
   * @example "2023-01-01T12:15:00.000Z"
   */
  lastPublishTime?: string;
  /**
   * Timestamp of last failed message publication
   * @format date-time
   * @example "2023-01-01T12:10:00.000Z"
   */
  lastFailureTime?: string;
}

export interface MqttServerStatsDto {
  /** Connection statistics */
  connection: MqttConnectionStatsDto;
  /** Message statistics */
  messages: MqttMessageStatsDto;
}

export interface MqttServerStatusDto {
  /**
   * Whether the server is currently connected
   * @example true
   */
  connected: boolean;
  /** Health status of the connection */
  healthStatus: MqttHealthStatusDto;
  /** Detailed statistics */
  stats: MqttServerStatsDto;
}

export interface AllMqttServerStatusesDto {
  /** Map of server IDs to their statuses */
  servers: Record<string, MqttServerStatusDto>;
}

export interface WebhookConfigResponseDto {
  /**
   * The unique identifier of the webhook configuration
   * @example 1
   */
  id: number;
  /**
   * The ID of the resource this webhook configuration is for
   * @example 1
   */
  resourceId: number;
  /**
   * Friendly name for the webhook
   * @example "Slack Notification"
   */
  name: string;
  /**
   * Destination URL for the webhook. Supports templating with variables like {{id}}, {{name}}, {{event}}, etc.
   * @example "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
   */
  url: string;
  /**
   * HTTP method to use for the webhook request
   * @example "POST"
   */
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * JSON object for custom headers. Values can include templates like {{id}}, {{name}}, etc.
   * @example "{"Content-Type": "application/json", "Authorization": "Bearer token123", "X-Resource-Name": "{{name}}"}"
   */
  headers: string;
  /**
   * Template for payload when resource is in use
   * @example "{"status": "in_use", "resource": "{{name}}", "user": "{{user.name}}", "timestamp": "{{timestamp}}"}"
   */
  inUseTemplate: string;
  /**
   * Template for payload when resource is not in use
   * @example "{"status": "not_in_use", "resource": "{{name}}", "timestamp": "{{timestamp}}"}"
   */
  notInUseTemplate: string;
  /**
   * Whether the webhook is active
   * @example true
   */
  active: boolean;
  /**
   * Whether to enable retry mechanism for failed webhook requests
   * @example true
   */
  retryEnabled: boolean;
  /**
   * Number of retry attempts for failed webhook requests
   * @example 3
   */
  maxRetries: number;
  /**
   * Delay in milliseconds between retries
   * @example 1000
   */
  retryDelay: number;
  /**
   * Name of the header that contains the signature
   * @example "X-Webhook-Signature"
   */
  signatureHeader: string;
  /**
   * When the webhook configuration was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the webhook configuration was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface CreateWebhookConfigDto {
  /**
   * Friendly name for the webhook
   * @example "Slack Notification"
   */
  name: string;
  /**
   * Destination URL for the webhook. Supports templating with variables like {{id}}, {{name}}, {{event}}, etc.
   * @example "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
   */
  url: string;
  /**
   * HTTP method to use for the webhook request
   * @example "POST"
   */
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * JSON object for custom headers. Values can include templates like {{id}}, {{name}}, etc.
   * @example "{"Content-Type": "application/json", "Authorization": "Bearer token123", "X-Resource-Name": "{{name}}"}"
   */
  headers?: string;
  /**
   * Template for payload when resource is in use
   * @example "{"status": "in_use", "resource": "{{name}}", "user": "{{user.name}}", "timestamp": "{{timestamp}}"}"
   */
  inUseTemplate: string;
  /**
   * Template for payload when resource is not in use
   * @example "{"status": "not_in_use", "resource": "{{name}}", "timestamp": "{{timestamp}}"}"
   */
  notInUseTemplate: string;
  /**
   * Whether the webhook is active
   * @default true
   * @example true
   */
  active?: boolean;
  /**
   * Whether to enable retry mechanism for failed webhook requests
   * @default false
   * @example true
   */
  retryEnabled?: boolean;
  /**
   * Number of retry attempts for failed webhook requests (maximum 10)
   * @default 3
   * @example 3
   */
  maxRetries?: number;
  /**
   * Delay in milliseconds between retries (maximum 10000)
   * @default 1000
   * @example 1000
   */
  retryDelay?: number;
  /**
   * Name of the header that contains the signature
   * @default "X-Webhook-Signature"
   * @example "X-Webhook-Signature"
   */
  signatureHeader?: string;
}

export interface UpdateWebhookConfigDto {
  /**
   * Friendly name for the webhook
   * @example "Slack Notification"
   */
  name?: string;
  /**
   * Destination URL for the webhook. Supports templating with variables like {{id}}, {{name}}, {{event}}, etc.
   * @example "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
   */
  url?: string;
  /**
   * HTTP method to use for the webhook request
   * @example "POST"
   */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * JSON object for custom headers. Values can include templates like {{id}}, {{name}}, etc.
   * @example "{"Content-Type": "application/json", "Authorization": "Bearer token123", "X-Resource-Name": "{{name}}"}"
   */
  headers?: string;
  /**
   * Template for payload when resource is in use
   * @example "{"status": "in_use", "resource": "{{name}}", "user": "{{user.name}}", "timestamp": "{{timestamp}}"}"
   */
  inUseTemplate?: string;
  /**
   * Template for payload when resource is not in use
   * @example "{"status": "not_in_use", "resource": "{{name}}", "timestamp": "{{timestamp}}"}"
   */
  notInUseTemplate?: string;
  /**
   * Whether to enable retry mechanism for failed webhook requests
   * @example true
   */
  retryEnabled?: boolean;
  /**
   * Number of retry attempts for failed webhook requests (maximum 10)
   * @example 3
   */
  maxRetries?: number;
  /**
   * Delay in milliseconds between retries (maximum 10000)
   * @example 1000
   */
  retryDelay?: number;
  /**
   * Name of the header that contains the signature
   * @example "X-Webhook-Signature"
   */
  signatureHeader?: string;
}

export interface WebhookStatusDto {
  /**
   * Whether the webhook is active
   * @example true
   */
  active: boolean;
}

export interface WebhookTestResponseDto {
  /**
   * Whether the test was successful
   * @example true
   */
  success: boolean;
  /**
   * Message describing the test result
   * @example "Webhook test request sent successfully"
   */
  message: string;
}

export interface MqttResourceConfig {
  /**
   * The unique identifier of the MQTT resource configuration
   * @example 1
   */
  id: number;
  /**
   * The ID of the resource this configuration is for
   * @example 1
   */
  resourceId: number;
  /**
   * Name of this MQTT configuration
   * @example "Primary Status Feed"
   */
  name: string;
  /**
   * The ID of the MQTT server to publish to
   * @example 1
   */
  serverId: number;
  /**
   * Topic template using Handlebars for in-use status
   * @example "resources/{{id}}/status"
   */
  inUseTopic: string;
  /**
   * Message template using Handlebars for in-use status
   * @example "{"status": "in_use", "resourceId": "{{id}}", "timestamp": "{{timestamp}}"}"
   */
  inUseMessage: string;
  /**
   * Topic template using Handlebars for not-in-use status
   * @example "resources/{{id}}/status"
   */
  notInUseTopic: string;
  /**
   * Message template using Handlebars for not-in-use status
   * @example "{"status": "not_in_use", "resourceId": "{{id}}", "timestamp": "{{timestamp}}"}"
   */
  notInUseMessage: string;
  /**
   * When the MQTT resource configuration was created
   * @format date-time
   */
  createdAt: string;
  /**
   * When the MQTT resource configuration was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface CreateMqttResourceConfigDto {
  /**
   * ID of the MQTT server to use
   * @example 1
   */
  serverId: number;
  /**
   * Name of this MQTT configuration
   * @example "Primary Status Feed"
   */
  name: string;
  /**
   * Topic template for when resource is in use
   * @example "resources/{{id}}/status"
   */
  inUseTopic: string;
  /**
   * Message template for when resource is in use
   * @example "{"status":"in_use","resourceId":{{id}},"resourceName":"{{name}}"}"
   */
  inUseMessage: string;
  /**
   * Topic template for when resource is not in use
   * @example "resources/{{id}}/status"
   */
  notInUseTopic: string;
  /**
   * Message template for when resource is not in use
   * @example "{"status":"not_in_use","resourceId":{{id}},"resourceName":"{{name}}"}"
   */
  notInUseMessage: string;
}

export interface UpdateMqttResourceConfigDto {
  /**
   * ID of the MQTT server to use
   * @example 1
   */
  serverId?: number;
  /**
   * Name of this MQTT configuration
   * @example "Primary Status Feed"
   */
  name?: string;
  /**
   * Topic template for when resource is in use
   * @example "resources/{{id}}/status"
   */
  inUseTopic?: string;
  /**
   * Message template for when resource is in use
   * @example "{"status":"in_use","resourceId":{{id}},"resourceName":"{{name}}"}"
   */
  inUseMessage?: string;
  /**
   * Topic template for when resource is not in use
   * @example "resources/{{id}}/status"
   */
  notInUseTopic?: string;
  /**
   * Message template for when resource is not in use
   * @example "{"status":"not_in_use","resourceId":{{id}},"resourceName":"{{name}}"}"
   */
  notInUseMessage?: string;
}

export interface TestMqttConfigResponseDto {
  /**
   * Whether the test was successful
   * @example true
   */
  success: boolean;
  /**
   * Message describing the test result
   * @example "MQTT configuration is valid and connection to server was successful"
   */
  message: string;
}

export interface PluginMainFrontend {
  /**
   * The directory of the plugins frontend files
   * @example "frontend"
   */
  directory: string;
  /**
   * The entry point of the plugin, relative to the frontend directory
   * @example "index.mjs"
   */
  entryPoint: string;
}

export interface PluginMainBackend {
  /**
   * The directory of the plugins backend files
   * @example "backend"
   */
  directory: string;
  /**
   * The entry point of the plugin, relative to the backend directory
   * @example "index.mjs"
   */
  entryPoint: string;
}

export interface PluginMain {
  /**
   * The frontend files of the plugin
   * @example {"directory":"frontend","entryPoint":"index.mjs"}
   */
  frontend: PluginMainFrontend;
  /**
   * The backend file of the plugin
   * @example {"directory":"backend","entryPoint":"src/plugin.js"}
   */
  backend: PluginMainBackend;
}

export interface PluginAttraccessVersion {
  /**
   * The minimum version of the plugin
   * @example "1.0.0"
   */
  min: string;
  /**
   * The maximum version of the plugin
   * @example "1.0.0"
   */
  max: string;
  /**
   * The exact version of the plugin
   * @example "1.0.0"
   */
  exact: string;
}

export interface LoadedPluginManifest {
  /**
   * The name of the plugin
   * @example "plugin-name"
   */
  name: string;
  main: PluginMain;
  /**
   * The version of the plugin
   * @example "1.0.0"
   */
  version: string;
  attraccessVersion: PluginAttraccessVersion;
  /**
   * The directory of the plugin
   * @example "plugin-name"
   */
  pluginDirectory: string;
  /**
   * The id of the plugin
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
}

export interface UploadPluginDto {
  /**
   * Plugin zip file
   * @format binary
   */
  pluginZip: File;
}

export interface EnrollNfcCardDto {
  /**
   * The ID of the reader to enroll the NFC card on
   * @example 1
   */
  readerId: number;
}

export interface EnrollNfcCardResponseDto {
  /**
   * Success message
   * @example "Enrollment initiated, continue on Reader"
   */
  message: string;
}

export interface ResetNfcCardDto {
  /**
   * The ID of the reader to reset the NFC card on
   * @example 1
   */
  readerId: number;
  /**
   * The ID of the NFC card to reset
   * @example 123
   */
  cardId: number;
}

export interface ResetNfcCardResponseDto {
  /**
   * Success message
   * @example "Reset initiated, continue on Reader"
   */
  message: string;
}

export interface UpdateReaderDto {
  /**
   * The name of the reader
   * @example "Main Entrance Reader"
   */
  name: string;
  /** The IDs of the resources that the reader has access to */
  connectedResources: number[];
}

export interface FabReader {
  /** The ID of the reader */
  id: number;
  /** The name of the reader */
  name: string;
  /** The IDs of the resources that the reader has access to */
  hasAccessToResourceIds: number[];
  /**
   * The last time the reader connected to the server
   * @format date-time
   */
  lastConnection: string;
  /**
   * The first time the reader connected to the server
   * @format date-time
   */
  firstConnection: string;
  /** Whether the reader is currently connected */
  connected: boolean;
}

export interface UpdateReaderResponseDto {
  /**
   * Success message
   * @example "Reader updated successfully"
   */
  message: string;
  /** The updated reader */
  reader: FabReader;
}

export interface AppKeyRequestDto {
  /**
   * The UID of the card to get the app key for
   * @example "04A2B3C4D5E6"
   */
  cardUID: string;
  /**
   * The key number to generate
   * @example 1
   */
  keyNo: number;
}

export interface AppKeyResponseDto {
  /**
   * Generated key in hex format
   * @example "0A1B2C3D4E5F6789"
   */
  key: string;
}

export interface NFCCard {
  /** The ID of the NFC card */
  id: number;
  /** The UID of the NFC card */
  uid: string;
  /** The ID of the user that owns the NFC card */
  userId: number;
  /**
   * The date and time the NFC card was created
   * @format date-time
   */
  createdAt: string;
  /**
   * The date and time the NFC card was last updated
   * @format date-time
   */
  updatedAt: string;
}

export interface Ping2Data {
  /** @example "pong" */
  message?: string;
}

export type CreateOneUserData = User;

export interface GetAllUsersParams {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Search query */
  search?: string;
}

export type GetAllUsersData = PaginatedUsersResponseDto;

export interface VerifyEmailData {
  /** @example "Email verified successfully" */
  message?: string;
}

export type RequestPasswordResetData = any;

export type ChangePasswordViaResetTokenData = any;

export type GetCurrentData = User;

export type GetOneUserByIdData = User;

export type GetOneUserByIdError = UserNotFoundException;

export type UpdatePermissionsData = User;

export interface GetPermissionsData {
  canManageResources?: boolean;
  canManageSystemConfiguration?: boolean;
  canManageUsers?: boolean;
}

export type BulkUpdatePermissionsData = User[];

export interface GetAllWithPermissionParams {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Filter users by permission */
  permission?:
    | "canManageResources"
    | "canManageSystemConfiguration"
    | "canManageUsers";
}

export type GetAllWithPermissionData = PaginatedUsersResponseDto;

export interface CreateSessionPayload {
  username?: string;
  password?: string;
}

export type CreateSessionData = CreateSessionResponse;

export type EndSessionData = object;

export type GetAllSsoProvidersData = SSOProvider[];

export type CreateOneSsoProviderData = SSOProvider;

export type GetOneSsoProviderByIdData = SSOProvider;

export type UpdateOneSsoProviderData = SSOProvider;

export type DeleteOneSsoProviderData = any;

export interface LoginWithOidcParams {
  /** The URL to redirect to after login (optional), if you intend to redirect to your frontned, your frontend should pass the query parameters back to the sso callback endpoint to retreive a JWT token for furhter authentication */
  redirectTo?: any;
  /** The ID of the SSO provider */
  providerId: string;
}

export type LoginWithOidcData = any;

export interface OidcLoginCallbackParams {
  redirectTo: string;
  code: any;
  iss: any;
  "session-state": any;
  state: any;
  /** The ID of the SSO provider */
  providerId: string;
}

export type OidcLoginCallbackData = CreateSessionResponse;

export type EmailTemplateControllerCreateData = EmailTemplate;

export type EmailTemplateControllerFindAllData = EmailTemplate[];

export type EmailTemplateControllerFindOneData = EmailTemplate;

export type EmailTemplateControllerUpdateData = EmailTemplate;

export type EmailTemplateControllerRemoveData = any;

export type CreateOneResourceGroupData = ResourceGroup;

export interface GetAllResourceGroupsParams {
  /**
   * Page number
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Number of items per page
   * @min 1
   * @max 100
   * @default 10
   */
  limit?: number;
  /** Search term for name or description */
  search?: string;
}

export type GetAllResourceGroupsData = PaginatedResourceGroupResponseDto;

export type GetOneResourceGroupByIdData = ResourceGroup;

export type UpdateOneResourceGroupData = ResourceGroup;

export type DeleteOneResourceGroupData = any;

export type CreateOneResourceData = Resource;

export interface GetAllResourcesParams {
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
  /** Search term to filter resources */
  search?: string;
  /** Group ID to filter resources. Send -1 to find ungrouped resources. */
  groupId?: number;
  /** Resource IDs to filter resources */
  ids?: number[];
}

export type GetAllResourcesData = PaginatedResourceResponseDto;

export type GetOneResourceByIdData = Resource;

export type UpdateOneResourceData = Resource;

export type DeleteOneResourceData = any;

export type AddResourceToGroupData = Resource;

export type RemoveResourceFromGroupData = any;

export type StartSessionData = ResourceUsage;

export type EndSessionResult = ResourceUsage;

export interface GetHistoryOfResourceUsageParams {
  /**
   * The page number to retrieve
   * @example 1
   */
  page?: number;
  /**
   * The number of items per page
   * @example 10
   */
  limit?: number;
  /**
   * The user ID to filter by
   * @example 1
   */
  userId?: number;
  resourceId: number;
}

export type GetHistoryOfResourceUsageData = GetResourceHistoryResponseDto;

export type GetActiveSessionData = GetActiveUsageSessionDto;

export type MarkCompletedData = ResourceIntroduction;

export interface GetAllResourceIntroductionsParams {
  /**
   * Page number (1-based)
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Number of items per page
   * @min 1
   * @max 100
   * @default 10
   */
  limit: number;
  resourceId: number;
}

export type GetAllResourceIntroductionsData =
  PaginatedResourceIntroductionResponseDto;

export interface CheckStatusData {
  hasValidIntroduction?: boolean;
}

export type MarkRevokedData = ResourceIntroductionHistoryItem;

export type MarkUnrevokedData = ResourceIntroductionHistoryItem;

export type GetHistoryOfIntroductionData = ResourceIntroductionHistoryItem[];

export interface CheckIsRevokedStatusData {
  isRevoked?: boolean;
}

export type GetOneResourceIntroductionData = ResourceIntroduction;

export interface CheckCanManagePermissionData {
  canManageIntroductions?: boolean;
}

export type GetAllResourceIntroducersData = ResourceIntroductionUser[];

export type AddOneData = ResourceIntroductionUser;

export type RemoveOneData = any;

export type CheckCanManagePermissionResult = CanManageIntroducersResponseDto;

export type GetAllMqttServersData = MqttServer[];

export type CreateOneMqttServerData = MqttServer;

export type GetOneMqttServerByIdData = MqttServer;

export type UpdateOneMqttServerData = MqttServer;

export type DeleteOneMqttServerData = any;

export type TestConnectionData = TestConnectionResponseDto;

export type GetStatusOfOneData = MqttServerStatusDto;

export type GetStatusOfAllData = AllMqttServerStatusesDto;

export type SseControllerStreamEventsData = any;

export type GetAllWebhookConfigurationsData = WebhookConfigResponseDto[];

export type CreateOneWebhookConfigurationData = WebhookConfigResponseDto;

export type GetOneWebhookConfigurationByIdData = WebhookConfigResponseDto;

export type UpdateOneWebhookConfigurationData = WebhookConfigResponseDto;

export type DeleteOneWebhookConfigurationData = any;

export type UpdateStatusData = WebhookConfigResponseDto;

export type TestData = WebhookTestResponseDto;

export type RegenerateSecretData = WebhookConfigResponseDto;

export type GetAllMqttConfigurationsData = MqttResourceConfig[];

export type CreateMqttConfigurationData = MqttResourceConfig;

export type GetOneMqttConfigurationData = MqttResourceConfig;

export type UpdateMqttConfigurationData = MqttResourceConfig;

export type DeleteOneMqttConfigurationData = any;

export type TestOneData = TestMqttConfigResponseDto;

export type GetPluginsData = LoadedPluginManifest[];

export type GetFrontendPluginFileData = string;

export type DeletePluginData = any;

export type EnrollNfcCardData = EnrollNfcCardResponseDto;

export type ResetNfcCardData = ResetNfcCardResponseDto;

export type UpdateReaderData = UpdateReaderResponseDto;

export type GetReaderByIdData = FabReader;

export type GetReadersData = FabReader[];

export type GetAppKeyByUidData = AppKeyResponseDto;

export type GetAllCardsData = NFCCard[];

export interface AnalyticsControllerGetResourceUsageHoursInDateRangeParams {
  /**
   * The start date of the range
   * @format date-time
   * @example "2021-01-01"
   */
  start: string;
  /**
   * The end date of the range
   * @format date-time
   * @example "2021-01-01"
   */
  end: string;
}

export type AnalyticsControllerGetResourceUsageHoursInDateRangeData =
  ResourceUsage[];

export namespace Application {
  /**
   * No description
   * @tags Application
   * @name Ping2
   * @summary Check API availability
   * @request GET:/api/ping
   */
  export namespace Ping2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Ping2Data;
  }
}

export namespace Users {
  /**
   * No description
   * @tags users
   * @name CreateOneUser
   * @summary Create a new user
   * @request POST:/api/users
   */
  export namespace CreateOneUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateUserDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateOneUserData;
  }

  /**
   * No description
   * @tags users
   * @name GetAllUsers
   * @summary Get a paginated list of users
   * @request GET:/api/users
   * @secure
   */
  export namespace GetAllUsers {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Page number (1-based) */
      page?: number;
      /** Number of items per page */
      limit?: number;
      /** Search query */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllUsersData;
  }

  /**
   * No description
   * @tags users
   * @name VerifyEmail
   * @summary Verify a user email address
   * @request POST:/api/users/verify-email
   */
  export namespace VerifyEmail {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VerifyEmailDto;
    export type RequestHeaders = {};
    export type ResponseBody = VerifyEmailData;
  }

  /**
   * No description
   * @tags users
   * @name RequestPasswordReset
   * @summary Request a password reset
   * @request POST:/api/users/reset-password
   */
  export namespace RequestPasswordReset {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ResetPasswordDto;
    export type RequestHeaders = {};
    export type ResponseBody = RequestPasswordResetData;
  }

  /**
   * No description
   * @tags users
   * @name ChangePasswordViaResetToken
   * @summary Change a user password after password reset
   * @request POST:/api/users/{userId}/change-password
   */
  export namespace ChangePasswordViaResetToken {
    export type RequestParams = {
      userId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ChangePasswordDto;
    export type RequestHeaders = {};
    export type ResponseBody = ChangePasswordViaResetTokenData;
  }

  /**
   * No description
   * @tags users
   * @name GetCurrent
   * @summary Get the current authenticated user
   * @request GET:/api/users/me
   * @secure
   */
  export namespace GetCurrent {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCurrentData;
  }

  /**
   * No description
   * @tags users
   * @name GetOneUserById
   * @summary Get a user by ID
   * @request GET:/api/users/{id}
   * @secure
   */
  export namespace GetOneUserById {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneUserByIdData;
  }

  /**
   * No description
   * @tags users
   * @name UpdatePermissions
   * @summary Update a user's system permissions
   * @request PATCH:/api/users/{id}/permissions
   * @secure
   */
  export namespace UpdatePermissions {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateUserPermissionsDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdatePermissionsData;
  }

  /**
   * No description
   * @tags users
   * @name GetPermissions
   * @summary Get a user's system permissions
   * @request GET:/api/users/{id}/permissions
   * @secure
   */
  export namespace GetPermissions {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPermissionsData;
  }

  /**
   * No description
   * @tags users
   * @name BulkUpdatePermissions
   * @summary Bulk update user permissions
   * @request POST:/api/users/permissions
   * @secure
   */
  export namespace BulkUpdatePermissions {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BulkUpdateUserPermissionsDto;
    export type RequestHeaders = {};
    export type ResponseBody = BulkUpdatePermissionsData;
  }

  /**
   * No description
   * @tags users
   * @name GetAllWithPermission
   * @summary Get users with a specific permission
   * @request GET:/api/users/with-permission
   * @secure
   */
  export namespace GetAllWithPermission {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Page number (1-based) */
      page?: number;
      /** Number of items per page */
      limit?: number;
      /** Filter users by permission */
      permission?:
        | "canManageResources"
        | "canManageSystemConfiguration"
        | "canManageUsers";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllWithPermissionData;
  }
}

export namespace Authentication {
  /**
   * No description
   * @tags Authentication
   * @name CreateSession
   * @summary Create a new session using local authentication
   * @request POST:/api/auth/session/local
   */
  export namespace CreateSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateSessionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = CreateSessionData;
  }

  /**
   * No description
   * @tags Authentication
   * @name EndSession
   * @summary Logout and invalidate the current session
   * @request DELETE:/api/auth/session
   * @secure
   */
  export namespace EndSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = EndSessionData;
  }
}

export namespace Sso {
  /**
   * No description
   * @tags SSO
   * @name GetAllSsoProviders
   * @summary Get all SSO providers
   * @request GET:/api/auth/sso/providers
   */
  export namespace GetAllSsoProviders {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllSsoProvidersData;
  }

  /**
   * No description
   * @tags SSO
   * @name CreateOneSsoProvider
   * @summary Create a new SSO provider
   * @request POST:/api/auth/sso/providers
   * @secure
   */
  export namespace CreateOneSsoProvider {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateSSOProviderDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateOneSsoProviderData;
  }

  /**
   * No description
   * @tags SSO
   * @name GetOneSsoProviderById
   * @summary Get SSO provider by ID with full configuration
   * @request GET:/api/auth/sso/providers/{id}
   * @secure
   */
  export namespace GetOneSsoProviderById {
    export type RequestParams = {
      /** The ID of the SSO provider */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneSsoProviderByIdData;
  }

  /**
   * No description
   * @tags SSO
   * @name UpdateOneSsoProvider
   * @summary Update an existing SSO provider
   * @request PUT:/api/auth/sso/providers/{id}
   * @secure
   */
  export namespace UpdateOneSsoProvider {
    export type RequestParams = {
      /** The ID of the SSO provider */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateSSOProviderDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateOneSsoProviderData;
  }

  /**
   * No description
   * @tags SSO
   * @name DeleteOneSsoProvider
   * @summary Delete an SSO provider
   * @request DELETE:/api/auth/sso/providers/{id}
   * @secure
   */
  export namespace DeleteOneSsoProvider {
    export type RequestParams = {
      /** The ID of the SSO provider */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteOneSsoProviderData;
  }

  /**
   * @description Login with OIDC and redirect to the callback URL (optional), if you intend to redirect to your frontned, your frontend should pass the query parameters back to the sso callback endpoint to retreive a JWT token for furhter authentication
   * @tags SSO
   * @name LoginWithOidc
   * @summary Login with OIDC
   * @request GET:/api/auth/sso/OIDC/{providerId}/login
   */
  export namespace LoginWithOidc {
    export type RequestParams = {
      /** The ID of the SSO provider */
      providerId: string;
    };
    export type RequestQuery = {
      /** The URL to redirect to after login (optional), if you intend to redirect to your frontned, your frontend should pass the query parameters back to the sso callback endpoint to retreive a JWT token for furhter authentication */
      redirectTo?: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = LoginWithOidcData;
  }

  /**
   * No description
   * @tags SSO
   * @name OidcLoginCallback
   * @summary Callback for OIDC login
   * @request GET:/api/auth/sso/OIDC/{providerId}/callback
   */
  export namespace OidcLoginCallback {
    export type RequestParams = {
      /** The ID of the SSO provider */
      providerId: string;
    };
    export type RequestQuery = {
      redirectTo: string;
      code: any;
      iss: any;
      "session-state": any;
      state: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = OidcLoginCallbackData;
  }
}

export namespace EmailTemplates {
  /**
   * No description
   * @tags Email Templates
   * @name EmailTemplateControllerCreate
   * @summary Create a new email template
   * @request POST:/api/email-templates
   * @secure
   */
  export namespace EmailTemplateControllerCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateEmailTemplateDto;
    export type RequestHeaders = {};
    export type ResponseBody = EmailTemplateControllerCreateData;
  }

  /**
   * No description
   * @tags Email Templates
   * @name EmailTemplateControllerFindAll
   * @summary List all email templates
   * @request GET:/api/email-templates
   * @secure
   */
  export namespace EmailTemplateControllerFindAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = EmailTemplateControllerFindAllData;
  }

  /**
   * No description
   * @tags Email Templates
   * @name EmailTemplateControllerFindOne
   * @summary Get an email template by ID
   * @request GET:/api/email-templates/{id}
   * @secure
   */
  export namespace EmailTemplateControllerFindOne {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = EmailTemplateControllerFindOneData;
  }

  /**
   * No description
   * @tags Email Templates
   * @name EmailTemplateControllerUpdate
   * @summary Update an email template
   * @request PATCH:/api/email-templates/{id}
   * @secure
   */
  export namespace EmailTemplateControllerUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateEmailTemplateDto;
    export type RequestHeaders = {};
    export type ResponseBody = EmailTemplateControllerUpdateData;
  }

  /**
   * No description
   * @tags Email Templates
   * @name EmailTemplateControllerRemove
   * @summary Delete an email template
   * @request DELETE:/api/email-templates/{id}
   * @secure
   */
  export namespace EmailTemplateControllerRemove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = EmailTemplateControllerRemoveData;
  }
}

export namespace ResourceGroups {
  /**
   * No description
   * @tags Resource Groups
   * @name CreateOneResourceGroup
   * @summary Create a new resource group
   * @request POST:/api/resources/groups
   * @secure
   */
  export namespace CreateOneResourceGroup {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateResourceGroupDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateOneResourceGroupData;
  }

  /**
   * No description
   * @tags Resource Groups
   * @name GetAllResourceGroups
   * @summary Retrieve all resource groups
   * @request GET:/api/resources/groups
   * @secure
   */
  export namespace GetAllResourceGroups {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Number of items per page
       * @min 1
       * @max 100
       * @default 10
       */
      limit?: number;
      /** Search term for name or description */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllResourceGroupsData;
  }

  /**
   * No description
   * @tags Resource Groups
   * @name GetOneResourceGroupById
   * @summary Retrieve a specific resource group by ID
   * @request GET:/api/resources/groups/{id}
   * @secure
   */
  export namespace GetOneResourceGroupById {
    export type RequestParams = {
      /** Resource Group ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneResourceGroupByIdData;
  }

  /**
   * No description
   * @tags Resource Groups
   * @name UpdateOneResourceGroup
   * @summary Update a specific resource group by ID
   * @request PATCH:/api/resources/groups/{id}
   * @secure
   */
  export namespace UpdateOneResourceGroup {
    export type RequestParams = {
      /** Resource Group ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateResourceGroupDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateOneResourceGroupData;
  }

  /**
   * No description
   * @tags Resource Groups
   * @name DeleteOneResourceGroup
   * @summary Delete a specific resource group by ID
   * @request DELETE:/api/resources/groups/{id}
   * @secure
   */
  export namespace DeleteOneResourceGroup {
    export type RequestParams = {
      /** Resource Group ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteOneResourceGroupData;
  }
}

export namespace Resources {
  /**
   * No description
   * @tags Resources
   * @name CreateOneResource
   * @summary Create a new resource
   * @request POST:/api/resources
   * @secure
   */
  export namespace CreateOneResource {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateResourceDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateOneResourceData;
  }

  /**
   * No description
   * @tags Resources
   * @name GetAllResources
   * @summary Get all resources
   * @request GET:/api/resources
   * @secure
   */
  export namespace GetAllResources {
    export type RequestParams = {};
    export type RequestQuery = {
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
      /** Search term to filter resources */
      search?: string;
      /** Group ID to filter resources. Send -1 to find ungrouped resources. */
      groupId?: number;
      /** Resource IDs to filter resources */
      ids?: number[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllResourcesData;
  }

  /**
   * No description
   * @tags Resources
   * @name GetOneResourceById
   * @summary Get a resource by ID
   * @request GET:/api/resources/{id}
   * @secure
   */
  export namespace GetOneResourceById {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneResourceByIdData;
  }

  /**
   * No description
   * @tags Resources
   * @name UpdateOneResource
   * @summary Update a resource
   * @request PUT:/api/resources/{id}
   * @secure
   */
  export namespace UpdateOneResource {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateResourceDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateOneResourceData;
  }

  /**
   * No description
   * @tags Resources
   * @name DeleteOneResource
   * @summary Delete a resource
   * @request DELETE:/api/resources/{id}
   * @secure
   */
  export namespace DeleteOneResource {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteOneResourceData;
  }

  /**
   * No description
   * @tags Resources
   * @name AddResourceToGroup
   * @summary Add a resource to a group
   * @request POST:/api/resources/{id}/groups/{groupId}
   * @secure
   */
  export namespace AddResourceToGroup {
    export type RequestParams = {
      id: number;
      groupId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AddResourceToGroupData;
  }

  /**
   * No description
   * @tags Resources
   * @name RemoveResourceFromGroup
   * @summary Remove a resource from a group
   * @request DELETE:/api/resources/{id}/groups/{groupId}
   * @secure
   */
  export namespace RemoveResourceFromGroup {
    export type RequestParams = {
      id: number;
      groupId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RemoveResourceFromGroupData;
  }
}

export namespace ResourceUsage {
  /**
   * No description
   * @tags Resource Usage
   * @name StartSession
   * @summary Start a resource usage session
   * @request POST:/api/resources/{resourceId}/usage/start
   * @secure
   */
  export namespace StartSession {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = StartUsageSessionDto;
    export type RequestHeaders = {};
    export type ResponseBody = StartSessionData;
  }

  /**
   * No description
   * @tags Resource Usage
   * @name EndSession
   * @summary End a resource usage session
   * @request PUT:/api/resources/{resourceId}/usage/end
   * @secure
   */
  export namespace EndSession {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = EndUsageSessionDto;
    export type RequestHeaders = {};
    export type ResponseBody = EndSessionResult;
  }

  /**
   * No description
   * @tags Resource Usage
   * @name GetHistoryOfResourceUsage
   * @summary Get usage history for a resource
   * @request GET:/api/resources/{resourceId}/usage/history
   * @secure
   */
  export namespace GetHistoryOfResourceUsage {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {
      /**
       * The page number to retrieve
       * @example 1
       */
      page?: number;
      /**
       * The number of items per page
       * @example 10
       */
      limit?: number;
      /**
       * The user ID to filter by
       * @example 1
       */
      userId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetHistoryOfResourceUsageData;
  }

  /**
   * No description
   * @tags Resource Usage
   * @name GetActiveSession
   * @summary Get active usage session for current user
   * @request GET:/api/resources/{resourceId}/usage/active
   * @secure
   */
  export namespace GetActiveSession {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetActiveSessionData;
  }
}

export namespace ResourceIntroductions {
  /**
   * @description Complete an introduction for a user identified by their user ID, username, or email.
   * @tags Resource Introductions
   * @name MarkCompleted
   * @summary Mark resource introduction as completed for a user
   * @request POST:/api/resources/{resourceId}/introductions/complete
   * @secure
   */
  export namespace MarkCompleted {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = CompleteIntroductionDto;
    export type RequestHeaders = {};
    export type ResponseBody = MarkCompletedData;
  }

  /**
   * @description Retrieve introductions for a resource, possibly paginated
   * @tags Resource Introductions
   * @name GetAllResourceIntroductions
   * @summary Get introductions for a specific resource
   * @request GET:/api/resources/{resourceId}/introductions
   * @secure
   */
  export namespace GetAllResourceIntroductions {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {
      /**
       * Page number (1-based)
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Number of items per page
       * @min 1
       * @max 100
       * @default 10
       */
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllResourceIntroductionsData;
  }

  /**
   * @description Check if the current user has completed the introduction for this resource and it is not revoked
   * @tags Resource Introductions
   * @name CheckStatus
   * @summary Check if current user has a valid introduction
   * @request GET:/api/resources/{resourceId}/introductions/status
   * @secure
   */
  export namespace CheckStatus {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckStatusData;
  }

  /**
   * @description Revoke access for a user by marking their introduction as revoked
   * @tags Resource Introductions
   * @name MarkRevoked
   * @summary Revoke an introduction
   * @request POST:/api/resources/{resourceId}/introductions/{introductionId}/revoke
   * @secure
   */
  export namespace MarkRevoked {
    export type RequestParams = {
      resourceId: number;
      introductionId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = RevokeIntroductionDto;
    export type RequestHeaders = {};
    export type ResponseBody = MarkRevokedData;
  }

  /**
   * @description Restore access for a user by unrevoking their introduction
   * @tags Resource Introductions
   * @name MarkUnrevoked
   * @summary Unrevoke an introduction
   * @request POST:/api/resources/{resourceId}/introductions/{introductionId}/unrevoke
   * @secure
   */
  export namespace MarkUnrevoked {
    export type RequestParams = {
      resourceId: number;
      introductionId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UnrevokeIntroductionDto;
    export type RequestHeaders = {};
    export type ResponseBody = MarkUnrevokedData;
  }

  /**
   * @description Retrieve the history of revoke/unrevoke actions for an introduction
   * @tags Resource Introductions
   * @name GetHistoryOfIntroduction
   * @summary Get history for a specific introduction
   * @request GET:/api/resources/{resourceId}/introductions/{introductionId}/history
   * @secure
   */
  export namespace GetHistoryOfIntroduction {
    export type RequestParams = {
      resourceId: number;
      introductionId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetHistoryOfIntroductionData;
  }

  /**
   * @description Determine if a specific introduction is currently revoked
   * @tags Resource Introductions
   * @name CheckIsRevokedStatus
   * @summary Check if an introduction is revoked
   * @request GET:/api/resources/{resourceId}/introductions/{introductionId}/revoked
   * @secure
   */
  export namespace CheckIsRevokedStatus {
    export type RequestParams = {
      resourceId: number;
      introductionId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckIsRevokedStatusData;
  }

  /**
   * @description Retrieve detailed information about a specific introduction
   * @tags Resource Introductions
   * @name GetOneResourceIntroduction
   * @summary Get a single resource introduction
   * @request GET:/api/resources/{resourceId}/introductions/{introductionId}
   * @secure
   */
  export namespace GetOneResourceIntroduction {
    export type RequestParams = {
      resourceId: number;
      introductionId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneResourceIntroductionData;
  }

  /**
   * No description
   * @tags Resource Introductions
   * @name CheckCanManagePermission
   * @summary Check if user can manage introductions for the resource
   * @request GET:/api/resources/{resourceId}/introductions/permissions/manage
   * @secure
   */
  export namespace CheckCanManagePermission {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckCanManagePermissionData;
  }
}

export namespace ResourceIntroducers {
  /**
   * No description
   * @tags Resource Introducers
   * @name GetAllResourceIntroducers
   * @summary Get all authorized introducers for a resource
   * @request GET:/api/resources/{resourceId}/introducers
   * @secure
   */
  export namespace GetAllResourceIntroducers {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllResourceIntroducersData;
  }

  /**
   * No description
   * @tags Resource Introducers
   * @name AddOne
   * @summary Add a user as an introducer for a resource
   * @request POST:/api/resources/{resourceId}/introducers/{userId}
   * @secure
   */
  export namespace AddOne {
    export type RequestParams = {
      resourceId: number;
      userId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AddOneData;
  }

  /**
   * No description
   * @tags Resource Introducers
   * @name RemoveOne
   * @summary Remove a user as an introducer for a resource
   * @request DELETE:/api/resources/{resourceId}/introducers/{userId}
   * @secure
   */
  export namespace RemoveOne {
    export type RequestParams = {
      resourceId: number;
      userId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RemoveOneData;
  }

  /**
   * No description
   * @tags Resource Introducers
   * @name CheckCanManagePermission
   * @summary Check if the current user can manage introducers for a resource
   * @request GET:/api/resources/{resourceId}/introducers/can-manage
   * @secure
   */
  export namespace CheckCanManagePermission {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckCanManagePermissionResult;
  }
}

export namespace MqttServers {
  /**
   * No description
   * @tags MQTT Servers
   * @name GetAllMqttServers
   * @summary Get all MQTT servers
   * @request GET:/api/mqtt/servers
   * @secure
   */
  export namespace GetAllMqttServers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllMqttServersData;
  }

  /**
   * No description
   * @tags MQTT Servers
   * @name CreateOneMqttServer
   * @summary Create new MQTT server
   * @request POST:/api/mqtt/servers
   * @secure
   */
  export namespace CreateOneMqttServer {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMqttServerDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateOneMqttServerData;
  }

  /**
   * No description
   * @tags MQTT Servers
   * @name GetOneMqttServerById
   * @summary Get MQTT server by ID
   * @request GET:/api/mqtt/servers/{id}
   * @secure
   */
  export namespace GetOneMqttServerById {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneMqttServerByIdData;
  }

  /**
   * No description
   * @tags MQTT Servers
   * @name UpdateOneMqttServer
   * @summary Update MQTT server
   * @request PUT:/api/mqtt/servers/{id}
   * @secure
   */
  export namespace UpdateOneMqttServer {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateMqttServerDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateOneMqttServerData;
  }

  /**
   * No description
   * @tags MQTT Servers
   * @name DeleteOneMqttServer
   * @summary Delete MQTT server
   * @request DELETE:/api/mqtt/servers/{id}
   * @secure
   */
  export namespace DeleteOneMqttServer {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteOneMqttServerData;
  }

  /**
   * No description
   * @tags MQTT Servers
   * @name TestConnection
   * @summary Test MQTT server connection
   * @request POST:/api/mqtt/servers/{id}/test
   * @secure
   */
  export namespace TestConnection {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TestConnectionData;
  }

  /**
   * No description
   * @tags MQTT Servers
   * @name GetStatusOfOne
   * @summary Get MQTT server connection status and statistics
   * @request GET:/api/mqtt/servers/{id}/status
   * @secure
   */
  export namespace GetStatusOfOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStatusOfOneData;
  }

  /**
   * No description
   * @tags MQTT Servers
   * @name GetStatusOfAll
   * @summary Get all MQTT server connection statuses and statistics
   * @request GET:/api/mqtt/servers/status
   * @secure
   */
  export namespace GetStatusOfAll {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetStatusOfAllData;
  }
}

export namespace Sse {
  /**
   * No description
   * @tags SSE
   * @name SseControllerStreamEvents
   * @request GET:/api/resources/{resourceId}/events
   */
  export namespace SseControllerStreamEvents {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SseControllerStreamEventsData;
  }
}

export namespace Webhooks {
  /**
   * No description
   * @tags Webhooks
   * @name GetAllWebhookConfigurations
   * @summary Get all webhook configurations for a resource
   * @request GET:/api/resources/{resourceId}/webhooks
   * @secure
   */
  export namespace GetAllWebhookConfigurations {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllWebhookConfigurationsData;
  }

  /**
   * @description Creates a new webhook configuration for a resource. ## URL Templating The webhook URL can include Handlebars templates that will be replaced with context values when the webhook is triggered. Example: `https://example.com/webhooks/{{id}}/{{event}}` ## Header Templating Header values can include Handlebars templates that will be replaced with context values when the webhook is triggered. Example: `{"Authorization": "Bearer {{user.id}}", "X-Resource-Name": "{{name}}"}` ## Available Template Variables Available template variables for URLs, headers, and payloads: - `id`: Resource ID - `name`: Resource name - `description`: Resource description - `timestamp`: ISO timestamp of the event - `user.id`: ID of the user who triggered the event - `event`: Either "started" or "ended" depending on the resource usage state
   * @tags Webhooks
   * @name CreateOneWebhookConfiguration
   * @summary Create a new webhook configuration
   * @request POST:/api/resources/{resourceId}/webhooks
   * @secure
   */
  export namespace CreateOneWebhookConfiguration {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateWebhookConfigDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateOneWebhookConfigurationData;
  }

  /**
   * No description
   * @tags Webhooks
   * @name GetOneWebhookConfigurationById
   * @summary Get webhook configuration by ID
   * @request GET:/api/resources/{resourceId}/webhooks/{id}
   * @secure
   */
  export namespace GetOneWebhookConfigurationById {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
      /** Webhook configuration ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneWebhookConfigurationByIdData;
  }

  /**
   * No description
   * @tags Webhooks
   * @name UpdateOneWebhookConfiguration
   * @summary Update webhook configuration
   * @request PUT:/api/resources/{resourceId}/webhooks/{id}
   * @secure
   */
  export namespace UpdateOneWebhookConfiguration {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
      /** Webhook configuration ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateWebhookConfigDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateOneWebhookConfigurationData;
  }

  /**
   * No description
   * @tags Webhooks
   * @name DeleteOneWebhookConfiguration
   * @summary Delete webhook configuration
   * @request DELETE:/api/resources/{resourceId}/webhooks/{id}
   * @secure
   */
  export namespace DeleteOneWebhookConfiguration {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
      /** Webhook configuration ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteOneWebhookConfigurationData;
  }

  /**
   * No description
   * @tags Webhooks
   * @name UpdateStatus
   * @summary Enable or disable webhook
   * @request PUT:/api/resources/{resourceId}/webhooks/{id}/status
   * @secure
   */
  export namespace UpdateStatus {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
      /** Webhook configuration ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = WebhookStatusDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateStatusData;
  }

  /**
   * No description
   * @tags Webhooks
   * @name Test
   * @summary Test webhook
   * @request POST:/api/resources/{resourceId}/webhooks/{id}/test
   * @secure
   */
  export namespace Test {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
      /** Webhook configuration ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TestData;
  }

  /**
   * @description When signature verification is enabled, each webhook request includes: 1. A timestamp header (X-Webhook-Timestamp) 2. A signature header (configurable, default: X-Webhook-Signature) To verify the signature: 1. Extract the timestamp from the X-Webhook-Timestamp header 2. Combine the timestamp and payload as "${timestamp}.${payload}" 3. Compute the HMAC-SHA256 signature using your webhook secret 4. Compare the resulting signature with the value in the signature header Example (Node.js): ```javascript const crypto = require('crypto'); function verifySignature(payload, timestamp, signature, secret) { const signaturePayload = `${timestamp}.${payload}`; const expectedSignature = crypto .createHmac('sha256', secret) .update(signaturePayload) .digest('hex'); return crypto.timingSafeEqual( Buffer.from(signature), Buffer.from(expectedSignature) ); } ```
   * @tags Webhooks
   * @name RegenerateSecret
   * @summary Regenerate webhook secret
   * @request POST:/api/resources/{resourceId}/webhooks/{id}/regenerate-secret
   * @secure
   */
  export namespace RegenerateSecret {
    export type RequestParams = {
      /** Resource ID */
      resourceId: number;
      /** Webhook configuration ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RegenerateSecretData;
  }
}

export namespace MqttResourceConfiguration {
  /**
   * No description
   * @tags MQTT Resource Configuration
   * @name GetAllMqttConfigurations
   * @summary Get all MQTT configurations for a resource
   * @request GET:/api/resources/{resourceId}/mqtt/config
   * @secure
   */
  export namespace GetAllMqttConfigurations {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllMqttConfigurationsData;
  }

  /**
   * No description
   * @tags MQTT Resource Configuration
   * @name CreateMqttConfiguration
   * @summary Create a new MQTT configuration for a resource
   * @request POST:/api/resources/{resourceId}/mqtt/config
   * @secure
   */
  export namespace CreateMqttConfiguration {
    export type RequestParams = {
      resourceId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateMqttResourceConfigDto;
    export type RequestHeaders = {};
    export type ResponseBody = CreateMqttConfigurationData;
  }

  /**
   * No description
   * @tags MQTT Resource Configuration
   * @name GetOneMqttConfiguration
   * @summary Get a specific MQTT configuration for a resource
   * @request GET:/api/resources/{resourceId}/mqtt/config/{configId}
   * @secure
   */
  export namespace GetOneMqttConfiguration {
    export type RequestParams = {
      resourceId: number;
      configId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetOneMqttConfigurationData;
  }

  /**
   * No description
   * @tags MQTT Resource Configuration
   * @name UpdateMqttConfiguration
   * @summary Update a specific MQTT configuration
   * @request PUT:/api/resources/{resourceId}/mqtt/config/{configId}
   * @secure
   */
  export namespace UpdateMqttConfiguration {
    export type RequestParams = {
      resourceId: number;
      configId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateMqttResourceConfigDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateMqttConfigurationData;
  }

  /**
   * No description
   * @tags MQTT Resource Configuration
   * @name DeleteOneMqttConfiguration
   * @summary Delete a specific MQTT configuration
   * @request DELETE:/api/resources/{resourceId}/mqtt/config/{configId}
   * @secure
   */
  export namespace DeleteOneMqttConfiguration {
    export type RequestParams = {
      resourceId: number;
      configId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteOneMqttConfigurationData;
  }

  /**
   * No description
   * @tags MQTT Resource Configuration
   * @name TestOne
   * @summary Test a specific MQTT configuration
   * @request POST:/api/resources/{resourceId}/mqtt/config/{configId}/test
   * @secure
   */
  export namespace TestOne {
    export type RequestParams = {
      resourceId: number;
      configId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TestOneData;
  }
}

export namespace Plugin {
  /**
   * No description
   * @tags Plugin
   * @name GetPlugins
   * @summary Get all plugins
   * @request GET:/api/plugins
   */
  export namespace GetPlugins {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPluginsData;
  }

  /**
   * No description
   * @tags Plugin
   * @name UploadPlugin
   * @summary Upload a new plugin
   * @request POST:/api/plugins
   * @secure
   */
  export namespace UploadPlugin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UploadPluginDto;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @tags Plugin
   * @name GetFrontendPluginFile
   * @summary Get any frontend plugin file
   * @request GET:/api/plugins/{pluginName}/frontend/module-federation/{filePath}
   */
  export namespace GetFrontendPluginFile {
    export type RequestParams = {
      pluginName: string;
      filePath: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetFrontendPluginFileData;
  }

  /**
   * No description
   * @tags Plugin
   * @name DeletePlugin
   * @summary Delete a plugin
   * @request DELETE:/api/plugins/{pluginId}
   * @secure
   */
  export namespace DeletePlugin {
    export type RequestParams = {
      pluginId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeletePluginData;
  }
}

export namespace FabReaderReaders {
  /**
   * No description
   * @tags FabReader Readers
   * @name EnrollNfcCard
   * @summary Enroll a new NFC card
   * @request POST:/api/fabreader/readers/enroll-nfc-card
   * @secure
   */
  export namespace EnrollNfcCard {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EnrollNfcCardDto;
    export type RequestHeaders = {};
    export type ResponseBody = EnrollNfcCardData;
  }

  /**
   * No description
   * @tags FabReader Readers
   * @name ResetNfcCard
   * @summary Reset an NFC card
   * @request POST:/api/fabreader/readers/reset-nfc-card
   * @secure
   */
  export namespace ResetNfcCard {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ResetNfcCardDto;
    export type RequestHeaders = {};
    export type ResponseBody = ResetNfcCardData;
  }

  /**
   * No description
   * @tags FabReader Readers
   * @name UpdateReader
   * @summary Update reader name and connected resources
   * @request PATCH:/api/fabreader/readers/{readerId}
   * @secure
   */
  export namespace UpdateReader {
    export type RequestParams = {
      /**
       * The ID of the reader to update
       * @example 1
       */
      readerId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateReaderDto;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateReaderData;
  }

  /**
   * No description
   * @tags FabReader Readers
   * @name GetReaderById
   * @summary Get a reader by ID
   * @request GET:/api/fabreader/readers/{readerId}
   * @secure
   */
  export namespace GetReaderById {
    export type RequestParams = {
      /**
       * The ID of the reader to get
       * @example 1
       */
      readerId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetReaderByIdData;
  }

  /**
   * No description
   * @tags FabReader Readers
   * @name GetReaders
   * @summary Get all readers
   * @request GET:/api/fabreader/readers
   * @secure
   */
  export namespace GetReaders {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetReadersData;
  }
}

export namespace FabReaderNfcCards {
  /**
   * No description
   * @tags FabReader NFC Cards
   * @name GetAppKeyByUid
   * @summary Get the app key for a card by UID
   * @request POST:/api/fabreader/cards/keys
   * @secure
   */
  export namespace GetAppKeyByUid {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AppKeyRequestDto;
    export type RequestHeaders = {};
    export type ResponseBody = GetAppKeyByUidData;
  }

  /**
   * No description
   * @tags FabReader NFC Cards
   * @name GetAllCards
   * @summary Get all cards (to which you have access)
   * @request GET:/api/fabreader/cards
   * @secure
   */
  export namespace GetAllCards {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllCardsData;
  }
}

export namespace Analytics {
  /**
   * No description
   * @tags Analytics
   * @name AnalyticsControllerGetResourceUsageHoursInDateRange
   * @request GET:/api/analytics/resource-usage-hours
   * @secure
   */
  export namespace AnalyticsControllerGetResourceUsageHoursInDateRange {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * The start date of the range
       * @format date-time
       * @example "2021-01-01"
       */
      start: string;
      /**
       * The end date of the range
       * @format date-time
       * @example "2021-01-01"
       */
      end: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      AnalyticsControllerGetResourceUsageHoursInDateRangeData;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Attraccess API
 * @version 1.0.0
 * @contact
 *
 * The Attraccess API used to manage machine and tool access in a Makerspace or FabLab
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  application = {
    /**
     * No description
     *
     * @tags Application
     * @name Ping2
     * @summary Check API availability
     * @request GET:/api/ping
     */
    ping2: (params: RequestParams = {}) =>
      this.request<Ping2Data, any>({
        path: `/api/ping`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name CreateOneUser
     * @summary Create a new user
     * @request POST:/api/users
     */
    createOneUser: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<CreateOneUserData, void>({
        path: `/api/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetAllUsers
     * @summary Get a paginated list of users
     * @request GET:/api/users
     * @secure
     */
    getAllUsers: (query: GetAllUsersParams, params: RequestParams = {}) =>
      this.request<GetAllUsersData, void>({
        path: `/api/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name VerifyEmail
     * @summary Verify a user email address
     * @request POST:/api/users/verify-email
     */
    verifyEmail: (data: VerifyEmailDto, params: RequestParams = {}) =>
      this.request<VerifyEmailData, void>({
        path: `/api/users/verify-email`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name RequestPasswordReset
     * @summary Request a password reset
     * @request POST:/api/users/reset-password
     */
    requestPasswordReset: (
      data: ResetPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<RequestPasswordResetData, void>({
        path: `/api/users/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name ChangePasswordViaResetToken
     * @summary Change a user password after password reset
     * @request POST:/api/users/{userId}/change-password
     */
    changePasswordViaResetToken: (
      userId: number,
      data: ChangePasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<ChangePasswordViaResetTokenData, void>({
        path: `/api/users/${userId}/change-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetCurrent
     * @summary Get the current authenticated user
     * @request GET:/api/users/me
     * @secure
     */
    getCurrent: (params: RequestParams = {}) =>
      this.request<GetCurrentData, void>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetOneUserById
     * @summary Get a user by ID
     * @request GET:/api/users/{id}
     * @secure
     */
    getOneUserById: (id: number, params: RequestParams = {}) =>
      this.request<GetOneUserByIdData, GetOneUserByIdError>({
        path: `/api/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UpdatePermissions
     * @summary Update a user's system permissions
     * @request PATCH:/api/users/{id}/permissions
     * @secure
     */
    updatePermissions: (
      id: number,
      data: UpdateUserPermissionsDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdatePermissionsData, void>({
        path: `/api/users/${id}/permissions`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetPermissions
     * @summary Get a user's system permissions
     * @request GET:/api/users/{id}/permissions
     * @secure
     */
    getPermissions: (id: number, params: RequestParams = {}) =>
      this.request<GetPermissionsData, void>({
        path: `/api/users/${id}/permissions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name BulkUpdatePermissions
     * @summary Bulk update user permissions
     * @request POST:/api/users/permissions
     * @secure
     */
    bulkUpdatePermissions: (
      data: BulkUpdateUserPermissionsDto,
      params: RequestParams = {},
    ) =>
      this.request<BulkUpdatePermissionsData, void>({
        path: `/api/users/permissions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetAllWithPermission
     * @summary Get users with a specific permission
     * @request GET:/api/users/with-permission
     * @secure
     */
    getAllWithPermission: (
      query: GetAllWithPermissionParams,
      params: RequestParams = {},
    ) =>
      this.request<GetAllWithPermissionData, void>({
        path: `/api/users/with-permission`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  authentication = {
    /**
     * No description
     *
     * @tags Authentication
     * @name CreateSession
     * @summary Create a new session using local authentication
     * @request POST:/api/auth/session/local
     */
    createSession: (data: CreateSessionPayload, params: RequestParams = {}) =>
      this.request<CreateSessionData, void>({
        path: `/api/auth/session/local`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name EndSession
     * @summary Logout and invalidate the current session
     * @request DELETE:/api/auth/session
     * @secure
     */
    endSession: (params: RequestParams = {}) =>
      this.request<EndSessionData, void>({
        path: `/api/auth/session`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  sso = {
    /**
     * No description
     *
     * @tags SSO
     * @name GetAllSsoProviders
     * @summary Get all SSO providers
     * @request GET:/api/auth/sso/providers
     */
    getAllSsoProviders: (params: RequestParams = {}) =>
      this.request<GetAllSsoProvidersData, any>({
        path: `/api/auth/sso/providers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SSO
     * @name CreateOneSsoProvider
     * @summary Create a new SSO provider
     * @request POST:/api/auth/sso/providers
     * @secure
     */
    createOneSsoProvider: (
      data: CreateSSOProviderDto,
      params: RequestParams = {},
    ) =>
      this.request<CreateOneSsoProviderData, void>({
        path: `/api/auth/sso/providers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SSO
     * @name GetOneSsoProviderById
     * @summary Get SSO provider by ID with full configuration
     * @request GET:/api/auth/sso/providers/{id}
     * @secure
     */
    getOneSsoProviderById: (id: number, params: RequestParams = {}) =>
      this.request<GetOneSsoProviderByIdData, void>({
        path: `/api/auth/sso/providers/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SSO
     * @name UpdateOneSsoProvider
     * @summary Update an existing SSO provider
     * @request PUT:/api/auth/sso/providers/{id}
     * @secure
     */
    updateOneSsoProvider: (
      id: number,
      data: UpdateSSOProviderDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateOneSsoProviderData, void>({
        path: `/api/auth/sso/providers/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags SSO
     * @name DeleteOneSsoProvider
     * @summary Delete an SSO provider
     * @request DELETE:/api/auth/sso/providers/{id}
     * @secure
     */
    deleteOneSsoProvider: (id: number, params: RequestParams = {}) =>
      this.request<DeleteOneSsoProviderData, void>({
        path: `/api/auth/sso/providers/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Login with OIDC and redirect to the callback URL (optional), if you intend to redirect to your frontned, your frontend should pass the query parameters back to the sso callback endpoint to retreive a JWT token for furhter authentication
     *
     * @tags SSO
     * @name LoginWithOidc
     * @summary Login with OIDC
     * @request GET:/api/auth/sso/OIDC/{providerId}/login
     */
    loginWithOidc: (
      { providerId, ...query }: LoginWithOidcParams,
      params: RequestParams = {},
    ) =>
      this.request<LoginWithOidcData, any>({
        path: `/api/auth/sso/OIDC/${providerId}/login`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags SSO
     * @name OidcLoginCallback
     * @summary Callback for OIDC login
     * @request GET:/api/auth/sso/OIDC/{providerId}/callback
     */
    oidcLoginCallback: (
      { providerId, ...query }: OidcLoginCallbackParams,
      params: RequestParams = {},
    ) =>
      this.request<OidcLoginCallbackData, any>({
        path: `/api/auth/sso/OIDC/${providerId}/callback`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  emailTemplates = {
    /**
     * No description
     *
     * @tags Email Templates
     * @name EmailTemplateControllerCreate
     * @summary Create a new email template
     * @request POST:/api/email-templates
     * @secure
     */
    emailTemplateControllerCreate: (
      data: CreateEmailTemplateDto,
      params: RequestParams = {},
    ) =>
      this.request<EmailTemplateControllerCreateData, void>({
        path: `/api/email-templates`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email Templates
     * @name EmailTemplateControllerFindAll
     * @summary List all email templates
     * @request GET:/api/email-templates
     * @secure
     */
    emailTemplateControllerFindAll: (params: RequestParams = {}) =>
      this.request<EmailTemplateControllerFindAllData, void>({
        path: `/api/email-templates`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email Templates
     * @name EmailTemplateControllerFindOne
     * @summary Get an email template by ID
     * @request GET:/api/email-templates/{id}
     * @secure
     */
    emailTemplateControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<EmailTemplateControllerFindOneData, void>({
        path: `/api/email-templates/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email Templates
     * @name EmailTemplateControllerUpdate
     * @summary Update an email template
     * @request PATCH:/api/email-templates/{id}
     * @secure
     */
    emailTemplateControllerUpdate: (
      id: string,
      data: UpdateEmailTemplateDto,
      params: RequestParams = {},
    ) =>
      this.request<EmailTemplateControllerUpdateData, void>({
        path: `/api/email-templates/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Email Templates
     * @name EmailTemplateControllerRemove
     * @summary Delete an email template
     * @request DELETE:/api/email-templates/{id}
     * @secure
     */
    emailTemplateControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<EmailTemplateControllerRemoveData, void>({
        path: `/api/email-templates/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  resourceGroups = {
    /**
     * No description
     *
     * @tags Resource Groups
     * @name CreateOneResourceGroup
     * @summary Create a new resource group
     * @request POST:/api/resources/groups
     * @secure
     */
    createOneResourceGroup: (
      data: CreateResourceGroupDto,
      params: RequestParams = {},
    ) =>
      this.request<CreateOneResourceGroupData, void>({
        path: `/api/resources/groups`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Groups
     * @name GetAllResourceGroups
     * @summary Retrieve all resource groups
     * @request GET:/api/resources/groups
     * @secure
     */
    getAllResourceGroups: (
      query: GetAllResourceGroupsParams,
      params: RequestParams = {},
    ) =>
      this.request<GetAllResourceGroupsData, void>({
        path: `/api/resources/groups`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Groups
     * @name GetOneResourceGroupById
     * @summary Retrieve a specific resource group by ID
     * @request GET:/api/resources/groups/{id}
     * @secure
     */
    getOneResourceGroupById: (id: number, params: RequestParams = {}) =>
      this.request<GetOneResourceGroupByIdData, void>({
        path: `/api/resources/groups/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Groups
     * @name UpdateOneResourceGroup
     * @summary Update a specific resource group by ID
     * @request PATCH:/api/resources/groups/{id}
     * @secure
     */
    updateOneResourceGroup: (
      id: number,
      data: UpdateResourceGroupDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateOneResourceGroupData, void>({
        path: `/api/resources/groups/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Groups
     * @name DeleteOneResourceGroup
     * @summary Delete a specific resource group by ID
     * @request DELETE:/api/resources/groups/{id}
     * @secure
     */
    deleteOneResourceGroup: (id: number, params: RequestParams = {}) =>
      this.request<DeleteOneResourceGroupData, void>({
        path: `/api/resources/groups/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  resources = {
    /**
     * No description
     *
     * @tags Resources
     * @name CreateOneResource
     * @summary Create a new resource
     * @request POST:/api/resources
     * @secure
     */
    createOneResource: (data: CreateResourceDto, params: RequestParams = {}) =>
      this.request<CreateOneResourceData, void>({
        path: `/api/resources`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resources
     * @name GetAllResources
     * @summary Get all resources
     * @request GET:/api/resources
     * @secure
     */
    getAllResources: (
      query: GetAllResourcesParams,
      params: RequestParams = {},
    ) =>
      this.request<GetAllResourcesData, void>({
        path: `/api/resources`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resources
     * @name GetOneResourceById
     * @summary Get a resource by ID
     * @request GET:/api/resources/{id}
     * @secure
     */
    getOneResourceById: (id: number, params: RequestParams = {}) =>
      this.request<GetOneResourceByIdData, void>({
        path: `/api/resources/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resources
     * @name UpdateOneResource
     * @summary Update a resource
     * @request PUT:/api/resources/{id}
     * @secure
     */
    updateOneResource: (
      id: number,
      data: UpdateResourceDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateOneResourceData, void>({
        path: `/api/resources/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resources
     * @name DeleteOneResource
     * @summary Delete a resource
     * @request DELETE:/api/resources/{id}
     * @secure
     */
    deleteOneResource: (id: number, params: RequestParams = {}) =>
      this.request<DeleteOneResourceData, void>({
        path: `/api/resources/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resources
     * @name AddResourceToGroup
     * @summary Add a resource to a group
     * @request POST:/api/resources/{id}/groups/{groupId}
     * @secure
     */
    addResourceToGroup: (
      id: number,
      groupId: number,
      params: RequestParams = {},
    ) =>
      this.request<AddResourceToGroupData, void>({
        path: `/api/resources/${id}/groups/${groupId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resources
     * @name RemoveResourceFromGroup
     * @summary Remove a resource from a group
     * @request DELETE:/api/resources/{id}/groups/{groupId}
     * @secure
     */
    removeResourceFromGroup: (
      id: number,
      groupId: number,
      params: RequestParams = {},
    ) =>
      this.request<RemoveResourceFromGroupData, void>({
        path: `/api/resources/${id}/groups/${groupId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  resourceUsage = {
    /**
     * No description
     *
     * @tags Resource Usage
     * @name StartSession
     * @summary Start a resource usage session
     * @request POST:/api/resources/{resourceId}/usage/start
     * @secure
     */
    startSession: (
      resourceId: number,
      data: StartUsageSessionDto,
      params: RequestParams = {},
    ) =>
      this.request<StartSessionData, void>({
        path: `/api/resources/${resourceId}/usage/start`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Usage
     * @name EndSession
     * @summary End a resource usage session
     * @request PUT:/api/resources/{resourceId}/usage/end
     * @secure
     */
    endSession: (
      resourceId: number,
      data: EndUsageSessionDto,
      params: RequestParams = {},
    ) =>
      this.request<EndSessionResult, void>({
        path: `/api/resources/${resourceId}/usage/end`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Usage
     * @name GetHistoryOfResourceUsage
     * @summary Get usage history for a resource
     * @request GET:/api/resources/{resourceId}/usage/history
     * @secure
     */
    getHistoryOfResourceUsage: (
      { resourceId, ...query }: GetHistoryOfResourceUsageParams,
      params: RequestParams = {},
    ) =>
      this.request<GetHistoryOfResourceUsageData, void>({
        path: `/api/resources/${resourceId}/usage/history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Usage
     * @name GetActiveSession
     * @summary Get active usage session for current user
     * @request GET:/api/resources/{resourceId}/usage/active
     * @secure
     */
    getActiveSession: (resourceId: number, params: RequestParams = {}) =>
      this.request<GetActiveSessionData, void>({
        path: `/api/resources/${resourceId}/usage/active`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  resourceIntroductions = {
    /**
     * @description Complete an introduction for a user identified by their user ID, username, or email.
     *
     * @tags Resource Introductions
     * @name MarkCompleted
     * @summary Mark resource introduction as completed for a user
     * @request POST:/api/resources/{resourceId}/introductions/complete
     * @secure
     */
    markCompleted: (
      resourceId: number,
      data: CompleteIntroductionDto,
      params: RequestParams = {},
    ) =>
      this.request<MarkCompletedData, void>({
        path: `/api/resources/${resourceId}/introductions/complete`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve introductions for a resource, possibly paginated
     *
     * @tags Resource Introductions
     * @name GetAllResourceIntroductions
     * @summary Get introductions for a specific resource
     * @request GET:/api/resources/{resourceId}/introductions
     * @secure
     */
    getAllResourceIntroductions: (
      { resourceId, ...query }: GetAllResourceIntroductionsParams,
      params: RequestParams = {},
    ) =>
      this.request<GetAllResourceIntroductionsData, void>({
        path: `/api/resources/${resourceId}/introductions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Check if the current user has completed the introduction for this resource and it is not revoked
     *
     * @tags Resource Introductions
     * @name CheckStatus
     * @summary Check if current user has a valid introduction
     * @request GET:/api/resources/{resourceId}/introductions/status
     * @secure
     */
    checkStatus: (resourceId: number, params: RequestParams = {}) =>
      this.request<CheckStatusData, void>({
        path: `/api/resources/${resourceId}/introductions/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Revoke access for a user by marking their introduction as revoked
     *
     * @tags Resource Introductions
     * @name MarkRevoked
     * @summary Revoke an introduction
     * @request POST:/api/resources/{resourceId}/introductions/{introductionId}/revoke
     * @secure
     */
    markRevoked: (
      resourceId: number,
      introductionId: number,
      data: RevokeIntroductionDto,
      params: RequestParams = {},
    ) =>
      this.request<MarkRevokedData, void>({
        path: `/api/resources/${resourceId}/introductions/${introductionId}/revoke`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Restore access for a user by unrevoking their introduction
     *
     * @tags Resource Introductions
     * @name MarkUnrevoked
     * @summary Unrevoke an introduction
     * @request POST:/api/resources/{resourceId}/introductions/{introductionId}/unrevoke
     * @secure
     */
    markUnrevoked: (
      resourceId: number,
      introductionId: number,
      data: UnrevokeIntroductionDto,
      params: RequestParams = {},
    ) =>
      this.request<MarkUnrevokedData, void>({
        path: `/api/resources/${resourceId}/introductions/${introductionId}/unrevoke`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the history of revoke/unrevoke actions for an introduction
     *
     * @tags Resource Introductions
     * @name GetHistoryOfIntroduction
     * @summary Get history for a specific introduction
     * @request GET:/api/resources/{resourceId}/introductions/{introductionId}/history
     * @secure
     */
    getHistoryOfIntroduction: (
      resourceId: number,
      introductionId: number,
      params: RequestParams = {},
    ) =>
      this.request<GetHistoryOfIntroductionData, void>({
        path: `/api/resources/${resourceId}/introductions/${introductionId}/history`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Determine if a specific introduction is currently revoked
     *
     * @tags Resource Introductions
     * @name CheckIsRevokedStatus
     * @summary Check if an introduction is revoked
     * @request GET:/api/resources/{resourceId}/introductions/{introductionId}/revoked
     * @secure
     */
    checkIsRevokedStatus: (
      resourceId: number,
      introductionId: number,
      params: RequestParams = {},
    ) =>
      this.request<CheckIsRevokedStatusData, void>({
        path: `/api/resources/${resourceId}/introductions/${introductionId}/revoked`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific introduction
     *
     * @tags Resource Introductions
     * @name GetOneResourceIntroduction
     * @summary Get a single resource introduction
     * @request GET:/api/resources/{resourceId}/introductions/{introductionId}
     * @secure
     */
    getOneResourceIntroduction: (
      resourceId: number,
      introductionId: number,
      params: RequestParams = {},
    ) =>
      this.request<GetOneResourceIntroductionData, void>({
        path: `/api/resources/${resourceId}/introductions/${introductionId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Introductions
     * @name CheckCanManagePermission
     * @summary Check if user can manage introductions for the resource
     * @request GET:/api/resources/{resourceId}/introductions/permissions/manage
     * @secure
     */
    checkCanManagePermission: (
      resourceId: number,
      params: RequestParams = {},
    ) =>
      this.request<CheckCanManagePermissionData, void>({
        path: `/api/resources/${resourceId}/introductions/permissions/manage`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  resourceIntroducers = {
    /**
     * No description
     *
     * @tags Resource Introducers
     * @name GetAllResourceIntroducers
     * @summary Get all authorized introducers for a resource
     * @request GET:/api/resources/{resourceId}/introducers
     * @secure
     */
    getAllResourceIntroducers: (
      resourceId: number,
      params: RequestParams = {},
    ) =>
      this.request<GetAllResourceIntroducersData, void>({
        path: `/api/resources/${resourceId}/introducers`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Introducers
     * @name AddOne
     * @summary Add a user as an introducer for a resource
     * @request POST:/api/resources/{resourceId}/introducers/{userId}
     * @secure
     */
    addOne: (resourceId: number, userId: number, params: RequestParams = {}) =>
      this.request<AddOneData, void>({
        path: `/api/resources/${resourceId}/introducers/${userId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Introducers
     * @name RemoveOne
     * @summary Remove a user as an introducer for a resource
     * @request DELETE:/api/resources/{resourceId}/introducers/{userId}
     * @secure
     */
    removeOne: (
      resourceId: number,
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<RemoveOneData, void>({
        path: `/api/resources/${resourceId}/introducers/${userId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Resource Introducers
     * @name CheckCanManagePermission
     * @summary Check if the current user can manage introducers for a resource
     * @request GET:/api/resources/{resourceId}/introducers/can-manage
     * @secure
     */
    checkCanManagePermission: (
      resourceId: number,
      params: RequestParams = {},
    ) =>
      this.request<CheckCanManagePermissionResult, void>({
        path: `/api/resources/${resourceId}/introducers/can-manage`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  mqttServers = {
    /**
     * No description
     *
     * @tags MQTT Servers
     * @name GetAllMqttServers
     * @summary Get all MQTT servers
     * @request GET:/api/mqtt/servers
     * @secure
     */
    getAllMqttServers: (params: RequestParams = {}) =>
      this.request<GetAllMqttServersData, void>({
        path: `/api/mqtt/servers`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Servers
     * @name CreateOneMqttServer
     * @summary Create new MQTT server
     * @request POST:/api/mqtt/servers
     * @secure
     */
    createOneMqttServer: (
      data: CreateMqttServerDto,
      params: RequestParams = {},
    ) =>
      this.request<CreateOneMqttServerData, void>({
        path: `/api/mqtt/servers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Servers
     * @name GetOneMqttServerById
     * @summary Get MQTT server by ID
     * @request GET:/api/mqtt/servers/{id}
     * @secure
     */
    getOneMqttServerById: (id: number, params: RequestParams = {}) =>
      this.request<GetOneMqttServerByIdData, void>({
        path: `/api/mqtt/servers/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Servers
     * @name UpdateOneMqttServer
     * @summary Update MQTT server
     * @request PUT:/api/mqtt/servers/{id}
     * @secure
     */
    updateOneMqttServer: (
      id: number,
      data: UpdateMqttServerDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateOneMqttServerData, void>({
        path: `/api/mqtt/servers/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Servers
     * @name DeleteOneMqttServer
     * @summary Delete MQTT server
     * @request DELETE:/api/mqtt/servers/{id}
     * @secure
     */
    deleteOneMqttServer: (id: number, params: RequestParams = {}) =>
      this.request<DeleteOneMqttServerData, void>({
        path: `/api/mqtt/servers/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Servers
     * @name TestConnection
     * @summary Test MQTT server connection
     * @request POST:/api/mqtt/servers/{id}/test
     * @secure
     */
    testConnection: (id: number, params: RequestParams = {}) =>
      this.request<TestConnectionData, void>({
        path: `/api/mqtt/servers/${id}/test`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Servers
     * @name GetStatusOfOne
     * @summary Get MQTT server connection status and statistics
     * @request GET:/api/mqtt/servers/{id}/status
     * @secure
     */
    getStatusOfOne: (id: number, params: RequestParams = {}) =>
      this.request<GetStatusOfOneData, void>({
        path: `/api/mqtt/servers/${id}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Servers
     * @name GetStatusOfAll
     * @summary Get all MQTT server connection statuses and statistics
     * @request GET:/api/mqtt/servers/status
     * @secure
     */
    getStatusOfAll: (params: RequestParams = {}) =>
      this.request<GetStatusOfAllData, void>({
        path: `/api/mqtt/servers/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  sse = {
    /**
     * No description
     *
     * @tags SSE
     * @name SseControllerStreamEvents
     * @request GET:/api/resources/{resourceId}/events
     */
    sseControllerStreamEvents: (
      resourceId: number,
      params: RequestParams = {},
    ) =>
      this.request<SseControllerStreamEventsData, any>({
        path: `/api/resources/${resourceId}/events`,
        method: "GET",
        ...params,
      }),
  };
  webhooks = {
    /**
     * No description
     *
     * @tags Webhooks
     * @name GetAllWebhookConfigurations
     * @summary Get all webhook configurations for a resource
     * @request GET:/api/resources/{resourceId}/webhooks
     * @secure
     */
    getAllWebhookConfigurations: (
      resourceId: number,
      params: RequestParams = {},
    ) =>
      this.request<GetAllWebhookConfigurationsData, void>({
        path: `/api/resources/${resourceId}/webhooks`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new webhook configuration for a resource. ## URL Templating The webhook URL can include Handlebars templates that will be replaced with context values when the webhook is triggered. Example: `https://example.com/webhooks/{{id}}/{{event}}` ## Header Templating Header values can include Handlebars templates that will be replaced with context values when the webhook is triggered. Example: `{"Authorization": "Bearer {{user.id}}", "X-Resource-Name": "{{name}}"}` ## Available Template Variables Available template variables for URLs, headers, and payloads: - `id`: Resource ID - `name`: Resource name - `description`: Resource description - `timestamp`: ISO timestamp of the event - `user.id`: ID of the user who triggered the event - `event`: Either "started" or "ended" depending on the resource usage state
     *
     * @tags Webhooks
     * @name CreateOneWebhookConfiguration
     * @summary Create a new webhook configuration
     * @request POST:/api/resources/{resourceId}/webhooks
     * @secure
     */
    createOneWebhookConfiguration: (
      resourceId: number,
      data: CreateWebhookConfigDto,
      params: RequestParams = {},
    ) =>
      this.request<CreateOneWebhookConfigurationData, void>({
        path: `/api/resources/${resourceId}/webhooks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Webhooks
     * @name GetOneWebhookConfigurationById
     * @summary Get webhook configuration by ID
     * @request GET:/api/resources/{resourceId}/webhooks/{id}
     * @secure
     */
    getOneWebhookConfigurationById: (
      resourceId: number,
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<GetOneWebhookConfigurationByIdData, void>({
        path: `/api/resources/${resourceId}/webhooks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Webhooks
     * @name UpdateOneWebhookConfiguration
     * @summary Update webhook configuration
     * @request PUT:/api/resources/{resourceId}/webhooks/{id}
     * @secure
     */
    updateOneWebhookConfiguration: (
      resourceId: number,
      id: number,
      data: UpdateWebhookConfigDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateOneWebhookConfigurationData, void>({
        path: `/api/resources/${resourceId}/webhooks/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Webhooks
     * @name DeleteOneWebhookConfiguration
     * @summary Delete webhook configuration
     * @request DELETE:/api/resources/{resourceId}/webhooks/{id}
     * @secure
     */
    deleteOneWebhookConfiguration: (
      resourceId: number,
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<DeleteOneWebhookConfigurationData, void>({
        path: `/api/resources/${resourceId}/webhooks/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Webhooks
     * @name UpdateStatus
     * @summary Enable or disable webhook
     * @request PUT:/api/resources/{resourceId}/webhooks/{id}/status
     * @secure
     */
    updateStatus: (
      resourceId: number,
      id: number,
      data: WebhookStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateStatusData, void>({
        path: `/api/resources/${resourceId}/webhooks/${id}/status`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Webhooks
     * @name Test
     * @summary Test webhook
     * @request POST:/api/resources/{resourceId}/webhooks/{id}/test
     * @secure
     */
    test: (resourceId: number, id: number, params: RequestParams = {}) =>
      this.request<TestData, void>({
        path: `/api/resources/${resourceId}/webhooks/${id}/test`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description When signature verification is enabled, each webhook request includes: 1. A timestamp header (X-Webhook-Timestamp) 2. A signature header (configurable, default: X-Webhook-Signature) To verify the signature: 1. Extract the timestamp from the X-Webhook-Timestamp header 2. Combine the timestamp and payload as "${timestamp}.${payload}" 3. Compute the HMAC-SHA256 signature using your webhook secret 4. Compare the resulting signature with the value in the signature header Example (Node.js): ```javascript const crypto = require('crypto'); function verifySignature(payload, timestamp, signature, secret) { const signaturePayload = `${timestamp}.${payload}`; const expectedSignature = crypto .createHmac('sha256', secret) .update(signaturePayload) .digest('hex'); return crypto.timingSafeEqual( Buffer.from(signature), Buffer.from(expectedSignature) ); } ```
     *
     * @tags Webhooks
     * @name RegenerateSecret
     * @summary Regenerate webhook secret
     * @request POST:/api/resources/{resourceId}/webhooks/{id}/regenerate-secret
     * @secure
     */
    regenerateSecret: (
      resourceId: number,
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<RegenerateSecretData, void>({
        path: `/api/resources/${resourceId}/webhooks/${id}/regenerate-secret`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  mqttResourceConfiguration = {
    /**
     * No description
     *
     * @tags MQTT Resource Configuration
     * @name GetAllMqttConfigurations
     * @summary Get all MQTT configurations for a resource
     * @request GET:/api/resources/{resourceId}/mqtt/config
     * @secure
     */
    getAllMqttConfigurations: (
      resourceId: number,
      params: RequestParams = {},
    ) =>
      this.request<GetAllMqttConfigurationsData, void>({
        path: `/api/resources/${resourceId}/mqtt/config`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Resource Configuration
     * @name CreateMqttConfiguration
     * @summary Create a new MQTT configuration for a resource
     * @request POST:/api/resources/{resourceId}/mqtt/config
     * @secure
     */
    createMqttConfiguration: (
      resourceId: number,
      data: CreateMqttResourceConfigDto,
      params: RequestParams = {},
    ) =>
      this.request<CreateMqttConfigurationData, void>({
        path: `/api/resources/${resourceId}/mqtt/config`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Resource Configuration
     * @name GetOneMqttConfiguration
     * @summary Get a specific MQTT configuration for a resource
     * @request GET:/api/resources/{resourceId}/mqtt/config/{configId}
     * @secure
     */
    getOneMqttConfiguration: (
      resourceId: number,
      configId: number,
      params: RequestParams = {},
    ) =>
      this.request<GetOneMqttConfigurationData, void>({
        path: `/api/resources/${resourceId}/mqtt/config/${configId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Resource Configuration
     * @name UpdateMqttConfiguration
     * @summary Update a specific MQTT configuration
     * @request PUT:/api/resources/{resourceId}/mqtt/config/{configId}
     * @secure
     */
    updateMqttConfiguration: (
      resourceId: number,
      configId: number,
      data: UpdateMqttResourceConfigDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateMqttConfigurationData, void>({
        path: `/api/resources/${resourceId}/mqtt/config/${configId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Resource Configuration
     * @name DeleteOneMqttConfiguration
     * @summary Delete a specific MQTT configuration
     * @request DELETE:/api/resources/{resourceId}/mqtt/config/{configId}
     * @secure
     */
    deleteOneMqttConfiguration: (
      resourceId: number,
      configId: number,
      params: RequestParams = {},
    ) =>
      this.request<DeleteOneMqttConfigurationData, void>({
        path: `/api/resources/${resourceId}/mqtt/config/${configId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MQTT Resource Configuration
     * @name TestOne
     * @summary Test a specific MQTT configuration
     * @request POST:/api/resources/{resourceId}/mqtt/config/{configId}/test
     * @secure
     */
    testOne: (
      resourceId: number,
      configId: number,
      params: RequestParams = {},
    ) =>
      this.request<TestOneData, void>({
        path: `/api/resources/${resourceId}/mqtt/config/${configId}/test`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  plugin = {
    /**
     * No description
     *
     * @tags Plugin
     * @name GetPlugins
     * @summary Get all plugins
     * @request GET:/api/plugins
     */
    getPlugins: (params: RequestParams = {}) =>
      this.request<GetPluginsData, any>({
        path: `/api/plugins`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name UploadPlugin
     * @summary Upload a new plugin
     * @request POST:/api/plugins
     * @secure
     */
    uploadPlugin: (data: UploadPluginDto, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/api/plugins`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name GetFrontendPluginFile
     * @summary Get any frontend plugin file
     * @request GET:/api/plugins/{pluginName}/frontend/module-federation/{filePath}
     */
    getFrontendPluginFile: (
      pluginName: string,
      filePath: string,
      params: RequestParams = {},
    ) =>
      this.request<GetFrontendPluginFileData, any>({
        path: `/api/plugins/${pluginName}/frontend/module-federation/${filePath}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name DeletePlugin
     * @summary Delete a plugin
     * @request DELETE:/api/plugins/{pluginId}
     * @secure
     */
    deletePlugin: (pluginId: string, params: RequestParams = {}) =>
      this.request<DeletePluginData, void>({
        path: `/api/plugins/${pluginId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  fabReaderReaders = {
    /**
     * No description
     *
     * @tags FabReader Readers
     * @name EnrollNfcCard
     * @summary Enroll a new NFC card
     * @request POST:/api/fabreader/readers/enroll-nfc-card
     * @secure
     */
    enrollNfcCard: (data: EnrollNfcCardDto, params: RequestParams = {}) =>
      this.request<EnrollNfcCardData, void>({
        path: `/api/fabreader/readers/enroll-nfc-card`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags FabReader Readers
     * @name ResetNfcCard
     * @summary Reset an NFC card
     * @request POST:/api/fabreader/readers/reset-nfc-card
     * @secure
     */
    resetNfcCard: (data: ResetNfcCardDto, params: RequestParams = {}) =>
      this.request<ResetNfcCardData, void>({
        path: `/api/fabreader/readers/reset-nfc-card`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags FabReader Readers
     * @name UpdateReader
     * @summary Update reader name and connected resources
     * @request PATCH:/api/fabreader/readers/{readerId}
     * @secure
     */
    updateReader: (
      readerId: number,
      data: UpdateReaderDto,
      params: RequestParams = {},
    ) =>
      this.request<UpdateReaderData, void>({
        path: `/api/fabreader/readers/${readerId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags FabReader Readers
     * @name GetReaderById
     * @summary Get a reader by ID
     * @request GET:/api/fabreader/readers/{readerId}
     * @secure
     */
    getReaderById: (readerId: number, params: RequestParams = {}) =>
      this.request<GetReaderByIdData, void>({
        path: `/api/fabreader/readers/${readerId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags FabReader Readers
     * @name GetReaders
     * @summary Get all readers
     * @request GET:/api/fabreader/readers
     * @secure
     */
    getReaders: (params: RequestParams = {}) =>
      this.request<GetReadersData, void>({
        path: `/api/fabreader/readers`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  fabReaderNfcCards = {
    /**
     * No description
     *
     * @tags FabReader NFC Cards
     * @name GetAppKeyByUid
     * @summary Get the app key for a card by UID
     * @request POST:/api/fabreader/cards/keys
     * @secure
     */
    getAppKeyByUid: (data: AppKeyRequestDto, params: RequestParams = {}) =>
      this.request<GetAppKeyByUidData, void>({
        path: `/api/fabreader/cards/keys`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags FabReader NFC Cards
     * @name GetAllCards
     * @summary Get all cards (to which you have access)
     * @request GET:/api/fabreader/cards
     * @secure
     */
    getAllCards: (params: RequestParams = {}) =>
      this.request<GetAllCardsData, void>({
        path: `/api/fabreader/cards`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  analytics = {
    /**
     * No description
     *
     * @tags Analytics
     * @name AnalyticsControllerGetResourceUsageHoursInDateRange
     * @request GET:/api/analytics/resource-usage-hours
     * @secure
     */
    analyticsControllerGetResourceUsageHoursInDateRange: (
      query: AnalyticsControllerGetResourceUsageHoursInDateRangeParams,
      params: RequestParams = {},
    ) =>
      this.request<
        AnalyticsControllerGetResourceUsageHoursInDateRangeData,
        void
      >({
        path: `/api/analytics/resource-usage-hours`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
