import { useParams, useNavigate } from 'react-router-dom';
import { useResource, useDeleteResource } from '../../api/hooks/resources';
import { useAuth } from '../../hooks/useAuth';
import { useToastMessage } from '../../components/toastProvider';
import { ArrowLeft, Trash, Wifi, Users, UserCheck } from 'lucide-react';
import { Button } from '@heroui/button';
import { Spinner, Link } from '@heroui/react';
import { useDisclosure } from '@heroui/modal';
import { ResourceUsageSession } from './usage/resourceUsageSession';
import { ResourceUsageHistory } from './usage/resourceUsageHistory';
import { PageHeader } from '../../components/pageHeader';
import { DeleteConfirmationModal } from '../../components/deleteConfirmationModal';
import { useTranslations } from '../../i18n';
import * as en from './translations/resourceDetails.en';
import * as de from './translations/resourceDetails.de';
import { ResourceIntroductions } from './introductions/resourceIntroductions';
import { ManageIntroducers } from './introductions/components/ManageIntroducers';
import { memo, useMemo } from 'react';
import {
  useCanManageIntroductions,
  useCanManageIntroducers,
  useResourceIntroducers,
} from '../../api/hooks/resourceIntroduction';
import { useGroupIntroducers } from '../../api/hooks/groupIntroduction';
import { AttraccessUser } from '../../components/AttraccessUser';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { ResourceIntroductionUser } from '@attraccess/api-client';

function ResourceDetailsComponent() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '', 10);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { hasPermission, user: currentUser } = useAuth();
  const { success, error: showError } = useToastMessage();
  const navigate = useNavigate();

  const { t } = useTranslations('resourceDetails', {
    en,
    de,
  });

  const {
    data: resource,
    isLoading: isLoadingResource,
    error: resourceError,
  } = useResource(resourceId);

  const { data: resourceIntroducers } = useResourceIntroducers(resourceId);
  const groupId = resource?.groupId;
  const { data: groupIntroducers } = useGroupIntroducers(groupId ?? 0);

  const deleteResource = useDeleteResource();

  const handleDelete = async () => {
    try {
      await deleteResource.mutateAsync(resourceId);
      success({
        title: 'Resource deleted',
        description: `${resource?.name} has been successfully deleted`,
      });
      navigate('/resources');
    } catch (err) {
      showError({
        title: 'Failed to delete resource',
        description:
          'An error occurred while deleting the resource. Please try again.',
      });
      console.error('Failed to delete resource:', err);
      throw err;
    }
  };

  const canManageResources = hasPermission('canManageResources');

  const canStartSession = useMemo(() => {
    if (canManageResources) return true;

    const isResourceIntroducer = resourceIntroducers?.some(
      (intro) => intro.userId === currentUser?.id
    );
    if (isResourceIntroducer) return true;

    const isGroupIntroducer = groupIntroducers?.some(
      (intro) => intro.userId === currentUser?.id
    );
    if (resource?.groupId && isGroupIntroducer) return true;

    return false;
  }, [
    canManageResources,
    resourceIntroducers,
    groupIntroducers,
    resource?.groupId,
    currentUser?.id,
  ]);

  const { data: canManageResourceIntroductions } =
    useCanManageIntroductions(resourceId);
  const { data: canManageResourceIntroducers } =
    useCanManageIntroducers(resourceId);

  const showIntroductionsManagement = useMemo(
    () => canManageResources || canManageResourceIntroductions,
    [canManageResources, canManageResourceIntroductions]
  );

  const showIntroducersManagement = useMemo(
    () => canManageResources || canManageResourceIntroducers,
    [canManageResources, canManageResourceIntroducers]
  );

  if (isLoadingResource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (resourceError || !resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
        <p className="text-gray-500 mb-4">
          The requested resource could not be found or you don't have permission
          to view it.
        </p>
        <Button
          onPress={() => navigate('/resources')}
          variant="light"
          startContent={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Resources
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen space-y-8">
      <PageHeader
        title={resource.name}
        subtitle={resource.description || undefined}
        backTo="/resources"
        actions={
          canManageResources && (
            <div className="flex space-x-2">
              <Link href={`/resources/${resourceId}/iot`}>
                <Button
                  variant="light"
                  startContent={<Wifi className="w-4 h-4" />}
                >
                  {t('iotSettings')}
                </Button>
              </Link>
              <Button
                onPress={onOpen}
                color="danger"
                variant="light"
                startContent={<Trash className="w-4 h-4" />}
              >
                {t('delete')}
              </Button>
            </div>
          )
        }
      />

      <div className="w-full space-y-6">
        {!canStartSession && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {t('missingIntroduction.title')}
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {t('missingIntroduction.description')}
              </p>
              {resourceIntroducers && resourceIntroducers.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    {t('resourceIntroducersTitle')}
                  </h3>
                  <Listbox
                    aria-label={t('resourceIntroducersTitle')}
                    variant="bordered"
                  >
                    {resourceIntroducers.map(
                      (intro: ResourceIntroductionUser) => (
                        <ListboxItem
                          key={`res-${intro.id}`}
                          textValue={intro.user.username}
                        >
                          <AttraccessUser user={intro.user} />
                        </ListboxItem>
                      )
                    )}
                  </Listbox>
                </div>
              )}
              {groupId && groupIntroducers && groupIntroducers.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    {t('groupIntroducersTitle')}
                  </h3>
                  <Listbox
                    aria-label={t('groupIntroducersTitle')}
                    variant="bordered"
                  >
                    {groupIntroducers.map((intro: ResourceIntroductionUser) => (
                      <ListboxItem
                        key={`grp-${intro.id}`}
                        textValue={intro.user.username}
                      >
                        <AttraccessUser user={intro.user} />
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              )}
              {(!resourceIntroducers || resourceIntroducers.length === 0) &&
                (!groupId ||
                  !groupIntroducers ||
                  groupIntroducers.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                    {t('missingIntroduction.noIntroducersFound')}
                  </p>
                )}
            </CardBody>
          </Card>
        )}
        {canStartSession && <ResourceUsageSession resourceId={resourceId} />}
        <ResourceUsageHistory resourceId={resourceId} />
      </div>

      {/* Management Section (Introductions & Introducers) */}
      {(showIntroducersManagement || showIntroductionsManagement) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showIntroductionsManagement && (
            <div className="w-full">
              <ResourceIntroductions resourceId={resourceId} />
            </div>
          )}

          {showIntroducersManagement && (
            <div className="w-full">
              <ManageIntroducers resourceId={resourceId} />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => onOpenChange()}
        onConfirm={handleDelete}
        itemName={resource.name}
      />
    </div>
  );
}

export const ResourceDetails = memo(ResourceDetailsComponent);
