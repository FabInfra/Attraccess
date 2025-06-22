import { Card, CardBody, CardProps } from '@heroui/react';
import { AlertCircle } from 'lucide-react';
import {
  useAccessControlServiceResourceIntroducersGetMany,
  useAccessControlServiceResourceIntroducersGrant,
  useAccessControlServiceResourceIntroducersRevoke,
  UseAccessControlServiceResourceIntroducersGetManyKeyFn,
  User,
} from '@attraccess/react-query-client';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { ErrorDisplay } from '../../../components/errorDisplay/ErrorDisplay';
import { useQueryClient } from '@tanstack/react-query';
import * as en from './en.json';
import * as de from './de.json';
import { IntroducerManagement } from '../../../components/IntroducerManagement';

interface ResourceIntroducerManagementProps {
  resourceId: number;
}

export function ResoureIntroducerManagement(
  props: Readonly<ResourceIntroducerManagementProps & Omit<CardProps, 'children'>>
) {
  const { resourceId, ...rest } = props;

  const { t } = useTranslations('resourceIntroducerManagement', { en, de });
  const queryClient = useQueryClient();

  const { data: introducers, isLoading, error } = useAccessControlServiceResourceIntroducersGetMany({ resourceId });

  const {
    mutate: grantIntroducerMutation,
    isPending: isGranting,
    error: grantError,
  } = useAccessControlServiceResourceIntroducersGrant({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: UseAccessControlServiceResourceIntroducersGetManyKeyFn({ resourceId }),
      });
    },
    onError: (err: Error) => {
      console.error('Failed to grant introducer privileges:', err);
    },
  });

  const grantIntroducer = (user: User) => {
    if (user?.id) {
      grantIntroducerMutation({ resourceId, userId: user.id });
    }
  };

  const {
    mutate: revokeIntroducerMutation,
    isPending: isRevoking,
    error: revokeError,
  } = useAccessControlServiceResourceIntroducersRevoke({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: UseAccessControlServiceResourceIntroducersGetManyKeyFn({ resourceId }),
      });
    },
    onError: (err: Error) => {
      console.error('Failed to revoke introducer privileges:', err);
    },
  });

  const revokeIntroducer = (user: User) => {
    if (user?.id) {
      revokeIntroducerMutation({ resourceId, userId: user.id });
    }
  };

  if (error) {
    return (
      <Card {...rest}>
        <CardBody>
          <ErrorDisplay error={error as Error} onRetry={() => window.location.reload()} />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card {...rest}>
      <CardBody>
        {(grantError || revokeError) && (
          <ErrorDisplay
            error={(grantError || revokeError) as Error}
            onRetry={() => {
              if (grantError) grantIntroducerMutation.reset?.();
              if (revokeError) revokeIntroducerMutation.reset?.();
            }}
          />
        )}
        <IntroducerManagement
          isLoadingIntroducers={isLoading}
          introducers={introducers ?? []}
          onGrantIntroducer={grantIntroducer}
          onRevokeIntroducer={revokeIntroducer}
          isGranting={isGranting}
          isRevoking={isRevoking}
        />
      </CardBody>
    </Card>
  );
}
