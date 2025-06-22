import { usePluginsServiceDeletePlugin, usePluginsServiceGetPlugins } from '@attraccess/react-query-client';
import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Alert,
} from '@heroui/react';
import { Trash2, Upload } from 'lucide-react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { UploadPluginModal } from './UploadPluginModal';
import { useToastMessage } from '../../components/toastProvider';
import { ErrorDisplay } from '../../components/errorDisplay/ErrorDisplay';
import { TableEmptyState } from '../../components/tableComponents';
import { useReactQueryStatusToHeroUiTableLoadingState } from '../../hooks/useReactQueryStatusToHeroUiTableLoadingState';
import { TableDataLoadingIndicator } from '../../components/tableComponents';

import de from './PluginsList.de.json';
import en from './PluginsList.en.json';

export function PluginsList() {
  const { data: plugins, status: fetchStatus, error: fetchError, refetch } = usePluginsServiceGetPlugins();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pluginToDelete, setPluginToDelete] = useState<string | null>(null);
  const toast = useToastMessage();

  const loadingState = useReactQueryStatusToHeroUiTableLoadingState(fetchStatus);

  const { t } = useTranslations('plugins-list', {
    en,
    de,
  });

  const { mutate: deletePlugin, isPending: isDeleting } = usePluginsServiceDeletePlugin({
    onSuccess: () => {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      setDeleteModalOpen(false);
      setPluginToDelete(null);
      toast.success({
        title: t('success.delete.title'),
        description: t('success.delete.description'),
      });
    },
    onError: (error) => {
      console.error('Failed to delete plugin:', error);
      toast.error({
        title: t('error.delete.title'),
        description: t('error.delete.description'),
      });
    },
  });

  const handleDeleteClick = (pluginId: string) => {
    setPluginToDelete(pluginId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pluginToDelete) return;

    try {
      deletePlugin({ pluginId: pluginToDelete });
    } catch (error) {
      console.error('Failed to delete plugin:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPluginToDelete(null);
  };

  // Handle error state with inline display
  if (fetchError) {
    return (
      <>
        <Alert color="danger" className="mb-4" data-cy="plugins-list-work-in-progress-alert">
          {t('workInProgressAlert')}
        </Alert>
        <Card className="w-full" data-cy="plugins-list-card">
          <CardHeader className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{t('title')}</h1>
            <Button
              color="primary"
              startContent={<Upload size={18} />}
              onPress={() => setUploadModalOpen(true)}
              data-cy="plugins-list-upload-plugin-button"
            >
              {t('uploadButton')}
            </Button>
          </CardHeader>
          <CardBody>
            <ErrorDisplay error={fetchError} onRetry={() => refetch()} message={t('error.description')} />
          </CardBody>
        </Card>
        <UploadPluginModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Alert color="danger" className="mb-4" data-cy="plugins-list-work-in-progress-alert">
        {t('workInProgressAlert')}
      </Alert>
      <Card className="w-full" data-cy="plugins-list-card">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{t('title')}</h1>
          <Button
            color="primary"
            startContent={<Upload size={18} />}
            onPress={() => setUploadModalOpen(true)}
            data-cy="plugins-list-upload-plugin-button"
          >
            {t('uploadButton')}
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Plugins table" data-cy="plugins-list-table">
            <TableHeader>
              <TableColumn>{t('columns.name')}</TableColumn>
              <TableColumn>{t('columns.version')}</TableColumn>
              <TableColumn>{t('columns.directory')}</TableColumn>
              <TableColumn>{t('columns.actions')}</TableColumn>
            </TableHeader>
            <TableBody
              items={plugins}
              loadingState={loadingState}
              loadingContent={<TableDataLoadingIndicator />}
              emptyContent={<TableEmptyState />}
            >
              {(plugin) => (
                <TableRow key={plugin.name}>
                  <TableCell>{plugin.name}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="primary">
                      {plugin.version}
                    </Chip>
                  </TableCell>
                  <TableCell>{plugin.pluginDirectory || '-'}</TableCell>
                  <TableCell>
                    <Tooltip content={t('deleteTooltip')}>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => handleDeleteClick(plugin.id)}
                        data-cy={`plugins-list-delete-plugin-button-${plugin.id}`}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Delete confirmation modal */}
      <Modal isOpen={deleteModalOpen} onClose={handleDeleteCancel} data-cy="plugins-list-delete-modal">
        <ModalContent>
          <ModalHeader>{t('deleteModal.title')}</ModalHeader>
          <ModalBody>
            <p>{t('deleteModal.description', { pluginName: pluginToDelete })}</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleDeleteCancel} data-cy="plugins-list-delete-modal-cancel-button">
              {t('deleteModal.cancel')}
            </Button>
            <Button
              color="danger"
              isLoading={isDeleting}
              onPress={handleDeleteConfirm}
              data-cy="plugins-list-delete-modal-confirm-button"
            >
              {t('deleteModal.confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UploadPluginModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </>
  );
}
