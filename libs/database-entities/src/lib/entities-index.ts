// Import entities
import { EmailTemplate } from './email-template.entity';
import { AuthenticationDetail } from './entities/authenticationDetail.entity';
import { MqttResourceConfig } from './entities/mqttResourceConfig.entity';
import { MqttServer } from './entities/mqttServer.entity';
import { NFCCard } from './entities/nfcCard.entity';
import { Resource, ResourceComputedView } from './entities/resource.entity';
import { ResourceGroup } from './entities/resourceGroup.entity';
import { ResourceIntroduction } from './entities/resourceIntroduction.entity';
import {
  ResourceIntroductionHistoryItem,
  IntroductionHistoryAction,
} from './entities/resourceIntroductionHistoryItem.entity';
import { ResourceIntroductionUser } from './entities/resourceIntroductionUser.entity';
import { ResourceUsage } from './entities/resourceUsage.entity';
import { RevokedToken } from './entities/revokedToken.entity';
import { SSOProvider, SSOProviderType } from './entities/ssoProvider.entity';
import { SSOProviderOIDCConfiguration } from './entities/ssoProvider.oidc';
import { User, SystemPermissions, type SystemPermission } from './entities/user.entity';
import { WebhookConfig } from './entities/webhookConfig.entity';
import { FabReader } from './entities/fabReader.entity';

// Export all entities individually
export {
  AuthenticationDetail,
  MqttResourceConfig,
  MqttServer,
  Resource,
  ResourceComputedView,
  ResourceGroup,
  ResourceIntroduction,
  ResourceIntroductionHistoryItem,
  IntroductionHistoryAction,
  ResourceIntroductionUser,
  ResourceUsage,
  RevokedToken,
  SSOProvider,
  SSOProviderType,
  SSOProviderOIDCConfiguration,
  User,
  SystemPermissions,
  SystemPermission,
  WebhookConfig,
  NFCCard,
  FabReader,
  EmailTemplate,
};

// Export the entities object
export const entities = {
  User,
  AuthenticationDetail,
  RevokedToken,
  Resource,
  ResourceComputedView,
  ResourceGroup,
  ResourceUsage,
  ResourceIntroduction,
  ResourceIntroductionUser,
  ResourceIntroductionHistoryItem,
  MqttServer,
  MqttResourceConfig,
  WebhookConfig,
  SSOProvider,
  SSOProviderOIDCConfiguration,
  NFCCard,
  FabReader,
  EmailTemplate,
};
