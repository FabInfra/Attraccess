import { useResourceGroupsServiceGetOneResourceGroupById } from '@attraccess/react-query-client';
import { Spinner } from '@heroui/react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ManageGroupIntroducers } from './components/ManageGroupIntroducers';
import { useMemo } from 'react';
import { ResourceGroupIntroductions } from './introductions/ResourceGroupIntroductions';

export function ResourceGroupDetails() {
  const { id } = useParams<{ id: string }>();
  const groupId = parseInt(id || '', 10);
  const { hasPermission } = useAuth();

  const { data: group, isLoading: isLoadingGroup } = useResourceGroupsServiceGetOneResourceGroupById({ id: groupId });

  const canManageResources = hasPermission('canManageResources');
  const showIntroducersManagement = useMemo(() => canManageResources, [canManageResources]);

  if (isLoadingGroup) {
    return <Spinner variant="wave" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{group?.name}</h1>
        {group?.description && <p className="text-gray-600 dark:text-gray-400 mt-2">{group.description}</p>}
      </div>

      {showIntroducersManagement && (
        <div className="mt-8">
          <ManageGroupIntroducers groupId={groupId} />
        </div>
      )}

      {showIntroducersManagement && (
        <div className="mt-8">
          <ResourceGroupIntroductions groupId={groupId} />
        </div>
      )}
    </div>
  );
}
