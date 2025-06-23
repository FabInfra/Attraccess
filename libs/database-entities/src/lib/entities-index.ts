// Import entities
import { EmailTemplate } from './entities/email-template.entity';
import { AuthenticationDetail } from './entities/authenticationDetail.entity';
import { MqttResourceConfig } from './entities/mqttResourceConfig.entity';
import { MqttServer } from './entities/mqttServer.entity';
import { NFCCard } from './entities/nfcCard.entity';
import { Resource } from './entities/resource.entity';
import { ResourceGroup } from './entities/resourceGroup.entity';
import { ResourceIntroduction } from './entities/resourceIntroduction.entity';
import {
  ResourceIntroductionHistoryItem,
  IntroductionHistoryAction,
} from './entities/resourceIntroductionHistoryItem.entity';
import { ResourceIntroducer } from './entities/resourceIntroducer.entity';
import { ResourceUsage } from './entities/resourceUsage.entity';
import { RevokedToken } from './entities/revokedToken.entity';
import { SSOProvider, SSOProviderType } from './entities/ssoProvider.entity';
import { SSOProviderOIDCConfiguration } from './entities/ssoProvider.oidc';
import { User, SystemPermissions, type SystemPermission } from './entities/user.entity';
import { WebhookConfig } from './entities/webhookConfig.entity';
import { FabReader } from './entities/fabReader.entity';
import { ResourceBillingConfiguration } from './entities/resourceBillingConfiguration.entity';
import { ResourceBillingConfigurationFixedFeeOptions } from './entities/resourceBillingConfigurationFixedFeeOptions.entity';

// Export all entities individually
export {
  AuthenticationDetail,
  MqttResourceConfig,
  MqttServer,
  Resource,
  ResourceGroup,
  ResourceIntroduction,
  ResourceIntroductionHistoryItem,
  IntroductionHistoryAction,
  ResourceIntroducer,
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
  ResourceBillingConfiguration,
  ResourceBillingConfigurationFixedFeeOptions,
};

// Export the entities object
export const entities = {
  User,
  AuthenticationDetail,
  RevokedToken,
  Resource,
  ResourceGroup,
  ResourceUsage,
  ResourceIntroduction,
  ResourceIntroducer,
  ResourceIntroductionHistoryItem,
  MqttServer,
  MqttResourceConfig,
  WebhookConfig,
  SSOProvider,
  SSOProviderOIDCConfiguration,
  NFCCard,
  FabReader,
  EmailTemplate,
  ResourceBillingConfiguration,
  ResourceBillingConfigurationFixedFeeOptions,
};
