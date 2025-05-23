import { useTranslations } from '@attraccess/plugins-frontend-ui';
import de from './fabreader-editor.de.json';
import en from './fabreader-editor.en.json';
import { Button, Form, ModalBody, Modal, ModalContent, ModalHeader, ModalFooter } from '@heroui/react';
import { Input } from '@heroui/input';
import { useCallback, useState, useEffect } from 'react';
import { ResourceSelector } from '@attraccess/plugins-frontend-ui';
import { useQueryClient } from '@tanstack/react-query';
import {
  useFabReaderReadersServiceGetReaderById,
  useFabReaderReadersServiceGetReadersKey,
  useFabReaderReadersServiceUpdateReader,
} from '@attraccess/react-query-client';
import { useToastMessage } from '../../../components/toastProvider';

interface Props {
  readerId: number;
  isOpen: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function FabreaderEditor(props: Props) {
  const { t } = useTranslations('fabreader-editor', {
    de,
    en,
  });

  const queryClient = useQueryClient();

  const { data: reader } = useFabReaderReadersServiceGetReaderById({ readerId: props.readerId });

  const toast = useToastMessage();

  const [name, setName] = useState('');
  const [connectedResources, setConnectedResources] = useState<number[]>([]);
  const updateReaderMutation = useFabReaderReadersServiceUpdateReader({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [useFabReaderReadersServiceGetReadersKey] });
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
    setName(reader?.name || '');
    setConnectedResources(reader?.hasAccessToResourceIds || []);
  }, [reader]);

  const save = useCallback(async () => {
    await updateReaderMutation.mutateAsync({
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

  return (
    <Form onSubmit={onSubmit}>
      <Modal isOpen={props.isOpen} placement="top-center" onOpenChange={props.onCancel} scrollBehavior="inside">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t('title')}</ModalHeader>
              <ModalBody>
                <Input
                  label={t('readerName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterReaderName')}
                  className="w-full"
                />
                <ResourceSelector
                  selection={connectedResources}
                  onSelectionChange={(selection) => setConnectedResources(selection)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="secondary"
                  onPress={() => {
                    props.onCancel();
                  }}
                  disabled={updateReaderMutation.isPending}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" isLoading={updateReaderMutation.isPending} onPress={save}>
                  {t('save')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Form>
  );
}
