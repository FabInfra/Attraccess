import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToastMessage } from '../../components/toastProvider';
import { ArrowLeft, BookOpen, Trash, Wifi } from 'lucide-react';
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
        <Button onPress={() => navigate('/resources')} variant="light" startContent={<ArrowLeft className="w-4 h-4" />}>
          {t('error.resourceNotFound.backToResources')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <PageHeader
        title={resource.name}
        subtitle={resource.description || undefined}
        backTo="/resources"
        actions={
          <div className="flex space-x-2 flex-wrap justify-end">
            <DocumentationModal resourceId={resourceId}>
              {(onOpenDocumentation) => (
                <Button
                  variant="light"
                  startContent={<BookOpen className="w-4 h-4" />}
                  onPress={onOpenDocumentation}
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
                >
                  {t('navItems.iotSettings')}
                </Button>
                <Button onPress={onOpen} color="danger" variant="light" startContent={<Trash className="w-4 h-4" />}>
                  {t('actions.delete')}
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Full width Usage section for all devices */}
      <div className="w-full space-y-6 mb-8">
        <ResourceUsageSession resourceId={resourceId} />
        <ResourceUsageHistory resourceId={resourceId} />
      </div>

      {/* 2-column layout for Introductions and Introducers on non-mobile */}
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

      {/* Add the ManageResourceGroups component */}
      {showGroupsManagement && (
        <div className="mt-8 w-full">
          <ManageResourceGroups resourceId={resourceId} />
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
