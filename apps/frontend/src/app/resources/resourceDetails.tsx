import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToastMessage } from '../../components/toastProvider';
import { ArrowLeft, BookOpen, PenSquareIcon, ShapesIcon, Trash, Wifi } from 'lucide-react';
import { Button } from '@heroui/button';
import { Spinner, Link } from '@heroui/react';
import { useDisclosure } from '@heroui/modal';
import { ResourceUsageSession } from './usage/resourceUsageSession';
import { ResourceUsageHistory } from './usage/resourceUsageHistory';
import { PageHeader } from '../../components/pageHeader';
import { DeleteConfirmationModal } from '../../components/deleteConfirmationModal';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { ResourceIntroductions } from './introductions/resourceIntroductions';
import { ManageIntroducers } from './introductions/components/ManageIntroducers';
import { memo, useMemo } from 'react';
import {
  useResourceIntroducersServiceCheckCanManagePermission,
  useResourceIntroductionsServiceCheckCanManagePermission,
  useResourcesServiceDeleteOneResource,
  useResourcesServiceGetOneResourceById,
  UseResourcesServiceGetAllResourcesKeyFn,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';
import { ManageResourceGroups } from './groups/ManageResourceGroups';
import { DocumentationModal } from './documentation';
import de from './resourceDetails.de.json';
import en from './resourceDetails.en.json';
import { ResourceEditModal } from './resourceEditModal';

function ResourceDetailsComponent() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '', 10);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { hasPermission } = useAuth();
  const { success, error: showError } = useToastMessage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { t } = useTranslations('resourceDetails', {
    en,
    de,
  });

  const {
    data: resource,
    isLoading: isLoadingResource,
    error: resourceError,
  } = useResourcesServiceGetOneResourceById({ id: resourceId });

  const deleteResource = useResourcesServiceDeleteOneResource();

  const handleDelete = async () => {
    try {
      await deleteResource.mutateAsync({ id: resourceId });
      success({
        title: 'Resource deleted',
        description: `${resource?.name} has been successfully deleted`,
      });
      queryClient.invalidateQueries({
        queryKey: [UseResourcesServiceGetAllResourcesKeyFn()[0]],
      });
      navigate('/resources');
    } catch (err) {
      showError({
        title: 'Failed to delete resource',
        description: 'An error occurred while deleting the resource. Please try again.',
      });
      console.error('Failed to delete resource:', err);
      throw err;
    }
  };

  const canManageResourceGroups = hasPermission('canManageResources');
  const { data: canManageIntroductions } = useResourceIntroductionsServiceCheckCanManagePermission({ resourceId });
  const { data: canManageIntroducers } = useResourceIntroducersServiceCheckCanManagePermission({ resourceId });

  const showIntroductionsManagement = useMemo(
    () => canManageResourceGroups || canManageIntroductions?.canManageIntroductions,
    [canManageResourceGroups, canManageIntroductions]
  );

  const showIntroducersManagement = useMemo(
    () => canManageResourceGroups || canManageIntroducers?.canManageIntroductions,
    [canManageResourceGroups, canManageIntroducers]
  );

  const showGroupsManagement = useMemo(
    () => canManageResourceGroups || canManageResourceGroups,
    [canManageResourceGroups]
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
        <h2 className="text-xl font-semibold mb-2">{t('error.resourceNotFound.title')}</h2>
        <p className="text-gray-500 mb-4">{t('error.resourceNotFound.description')}</p>
        <Button
          onPress={() => navigate('/resources')}
          variant="light"
          startContent={<ArrowLeft className="w-4 h-4" />}
          data-cy="back-to-resources-button"
        >
          {t('error.resourceNotFound.backToResources')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <PageHeader
        title={resource.name}
        icon={<ShapesIcon className="w-6 h-6" />}
        subtitle={resource.description || undefined}
        backTo="/resources"
        actions={
          <>
            <DocumentationModal resourceId={resourceId}>
              {(onOpenDocumentation) => (
                <Button
                  variant="light"
                  startContent={<BookOpen className="w-4 h-4" />}
                  onPress={onOpenDocumentation}
                  data-cy="documentation-button"
                >
                  {t('actions.documentation')}
                </Button>
              )}
            </DocumentationModal>

            {canManageResourceGroups && (
              <>
                <Button
                  as={Link}
                  href={`/resources/${resourceId}/iot`}
                  variant="light"
                  startContent={<Wifi className="w-4 h-4" />}
                  data-cy="iot-settings-button"
                >
                  {t('navItems.iotSettings')}
                </Button>

                <ResourceEditModal resourceId={resourceId} closeOnSuccess>
                  {(onOpen) => (
                    <Button
                      onPress={onOpen}
                      variant="light"
                      startContent={<PenSquareIcon className="w-4 h-4" />}
                      data-cy="edit-resource-button"
                    >
                      {t('actions.edit')}
                    </Button>
                  )}
                </ResourceEditModal>

                <Button
                  onPress={onOpen}
                  color="danger"
                  variant="light"
                  startContent={<Trash className="w-4 h-4" />}
                  data-cy="delete-resource-button"
                >
                  {t('actions.delete')}
                </Button>
              </>
            )}
          </>
        }
      />

      {/* Full width Usage section for all devices */}
      <div className="w-full space-y-6 mb-8">
        <ResourceUsageSession resourceId={resourceId} resource={resource} data-cy="resource-usage-session" />
        <ResourceUsageHistory resourceId={resourceId} data-cy="resource-usage-history" />
      </div>

      {/* 2-column layout for Introductions and Introducers on non-mobile */}
      {(showIntroducersManagement || showIntroductionsManagement) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showIntroductionsManagement && (
            <div className="w-full">
              <ResourceIntroductions resourceId={resourceId} data-cy="resource-introductions" />
            </div>
          )}

          {showIntroducersManagement && (
            <div className="w-full">
              <ManageIntroducers resourceId={resourceId} data-cy="manage-introducers" />
            </div>
          )}
        </div>
      )}

      {/* Add the ManageResourceGroups component */}
      {showGroupsManagement && (
        <div className="mt-8 w-full">
          <ManageResourceGroups resourceId={resourceId} data-cy="manage-resource-groups" />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => onOpenChange()}
        onConfirm={handleDelete}
        itemName={resource.name}
        data-cy="delete-confirmation-modal"
      />
    </div>
  );
}

export const ResourceDetails = memo(ResourceDetailsComponent);
