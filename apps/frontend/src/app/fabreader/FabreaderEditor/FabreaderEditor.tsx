import { useTranslations, ResourceSelector } from '@attraccess/plugins-frontend-ui';
import de from './fabreader-editor.de.json';
import en from './fabreader-editor.en.json';
import { Button, Form, ModalBody, Modal, ModalContent, ModalHeader, ModalFooter, Spinner } from '@heroui/react';
import { Input } from '@heroui/input';
import { useCallback, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useFabReaderServiceGetReaderById,
  useFabReaderServiceGetReadersKey,
  useFabReaderServiceUpdateReader,
} from '@attraccess/react-query-client';
import { useToastMessage } from '../../../components/toastProvider';
import { ErrorDisplay } from '../../../components/errorDisplay/ErrorDisplay';

interface Props {
  readerId?: number;
  isOpen: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function FabreaderEditor(props: Readonly<Props>) {
  const { t } = useTranslations('fabreader-editor', {
    de,
    en,
  });

  const queryClient = useQueryClient();
  const toast = useToastMessage();

  const {
    data: reader,
    isLoading: isLoadingReader,
    error: readerError,
    refetch: refetchReader,
  } = useFabReaderServiceGetReaderById({ readerId: props.readerId as number }, undefined, {
    enabled: props.readerId !== undefined,
  });

  const [name, setName] = useState('');
  const [connectedResources, setConnectedResources] = useState<number[]>([]);

  const updateReaderMutation = useFabReaderServiceUpdateReader({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [useFabReaderServiceGetReadersKey] });
      toast.success({
        title: t('readerUpdated'),
        description: t('readerUpdatedDescription'),
      });
      props.onSave();
    },
    onError: (error: Error) => {
      console.error('Failed to update reader:', error);
      toast.error({
        title: t('errorUpdatingReader'),
        description: (error as Error).message,
      });
    },
  });

  useEffect(() => {
    setName(reader?.name ?? '');
    setConnectedResources(reader?.hasAccessToResourceIds ?? []);
  }, [reader]);

  const save = useCallback(async () => {
    if (props.readerId === undefined) {
      return;
    }

    updateReaderMutation.mutate({
      readerId: props.readerId,
      requestBody: {
        name,
        connectedResources,
      },
    });
  }, [name, connectedResources, props, updateReaderMutation]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await save();
    },
    [save]
  );

  // Render loading state
  const renderModalContent = () => {
    if (isLoadingReader) {
      return (
        <>
          <ModalHeader className="flex flex-col gap-1">{t('title')}</ModalHeader>
          <ModalBody>
            <div className="flex items-center justify-center p-8">
              <Spinner size="lg" color="primary" />
              <span className="ml-4">{t('loading')}</span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" onPress={props.onCancel} data-cy="fabreader-editor-cancel-button">
              {t('cancel')}
            </Button>
          </ModalFooter>
        </>
      );
    }

    // Render error state
    if (readerError) {
      return (
        <>
          <ModalHeader className="flex flex-col gap-1">{t('title')}</ModalHeader>
          <ModalBody>
            <ErrorDisplay error={readerError} onRetry={() => refetchReader()} message={t('error.fetchDescription')} />
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" onPress={props.onCancel} data-cy="fabreader-editor-cancel-button">
              {t('cancel')}
            </Button>
          </ModalFooter>
        </>
      );
    }

    // Render normal form content
    return (
      <>
        <ModalHeader className="flex flex-col gap-1">{t('title')}</ModalHeader>
        <ModalBody>
          <Input
            label={t('readerName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('enterReaderName')}
            className="w-full"
            data-cy="fabreader-editor-name-input"
          />
          <ResourceSelector
            selection={connectedResources}
            onSelectionChange={(selection) => setConnectedResources(selection)}
            data-cy="fabreader-editor-resource-selector"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="secondary"
            onPress={props.onCancel}
            disabled={updateReaderMutation.isPending}
            data-cy="fabreader-editor-cancel-button"
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            isLoading={updateReaderMutation.isPending}
            onPress={save}
            data-cy="fabreader-editor-save-button"
          >
            {t('save')}
          </Button>
        </ModalFooter>
      </>
    );
  };

  return (
    <Form onSubmit={onSubmit} data-cy="fabreader-editor-form">
      <Modal
        isOpen={props.isOpen}
        placement="top-center"
        onOpenChange={props.onCancel}
        scrollBehavior="inside"
        data-cy="fabreader-editor-modal"
      >
        <ModalContent>{() => renderModalContent()}</ModalContent>
      </Modal>
    </Form>
  );
}
