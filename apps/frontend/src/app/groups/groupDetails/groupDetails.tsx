import { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResourceGroup } from '../../../api/hooks/resourceGroups'; // Assuming this hook exists or will be created
import { useAuth } from '../../../hooks/useAuth';
import { PageHeader } from '../../../components/pageHeader';
import { Spinner } from '@heroui/react';
import { useTranslations } from '../../../i18n';
import * as en from './translations/groupDetails.en';
import * as de from './translations/groupDetails.de';
import { Button } from '@heroui/button';
import { ArrowLeft } from 'lucide-react';
import { ManageGroupIntroducers } from '../introductions/components/ManageGroupIntroducers';

function GroupDetailsComponent() {
  const { id } = useParams<{ id: string }>();
  const groupId = parseInt(id || '', 10);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  // const { success, error: showError } = useToastMessage(); // For future actions like delete

  const { t } = useTranslations('groupDetails', {
    en,
    de,
  });

  // TODO: Check/Create useResourceGroup hook
  const {
    data: group,
    isLoading: isLoadingGroup,
    error: groupError,
  } = useResourceGroup(groupId);

  // TODO: Add delete group functionality (needs hook and modal)
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const deleteGroup = useDeleteResourceGroup(); // Needs hook

  // const handleDelete = async () => { ... };

  const canManageResources = hasPermission('canManageResources');
  // TODO: Add specific group management permission checks

  if (isLoadingGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-2">{t('notFound.title')}</h2>
        <p className="text-gray-500 mb-4">{t('notFound.description')}</p>
        <Button
          onPress={() => navigate('/resources')} // TODO: Navigate to a proper groups list page later
          variant="light"
          startContent={<ArrowLeft className="w-4 h-4" />}
        >
          {t('notFound.backButton')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen space-y-8">
      <PageHeader
        title={group.name}
        backTo="/resources"
      />

      {/* TODO: Add Group Management Sections Here */}
      {/* - Manage Group Introducers (using ManageGroupIntroducers component) */}
      {/* - Manage Group Introductions (needs new component/hooks) */}
      {/* - List/Manage Resources in Group (needs component/hooks) */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Manage Group Introducers section */}
        {canManageResources && (
          <div className="w-full">
            <ManageGroupIntroducers groupId={groupId} />
          </div>
        )}

        {/* Placeholder for other management sections */}
        {/* <div className="w-full"><p>Manage Group Introductions...</p></div> */}
        {/* <div className="w-full md:col-span-2"><p>Manage Resources in Group...</p></div> */}
      </div>

      {/* TODO: Add Delete Confirmation Modal */}
      {/* <DeleteConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => onOpenChange()}
        onConfirm={handleDelete}
        itemName={group.name}
        itemType={t('groupItemType')} // Add to translations
      /> */}
    </div>
  );
}

export const GroupDetails = memo(GroupDetailsComponent);
