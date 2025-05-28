import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Switch,
} from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './resourceCreateModal.en.json';
import * as de from './resourceCreateModal.de.json';
import {
  useResourcesServiceCreateOneResource,
  CreateResourceDto,
  UseResourcesServiceGetAllResourcesKeyFn,
  Resource,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../../components/fileUpload';
import { useToastMessage } from '../../components/toastProvider';

interface ResourceCreateModalProps {
  children: (onOpen: () => void) => React.ReactNode;
  onCreated?: (resource: Resource) => void;
}

type PostCreateAction = 'close' | 'open' | 'clear';

export function ResourceCreateModal(props: ResourceCreateModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { t } = useTranslations('resourceCreateModal', {
    en,
    de,
  });

  const [formData, setFormData] = useState<CreateResourceDto>({
    name: '',
    description: '',
    allowTakeOver: false,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { success, error } = useToastMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postCreateAction, setPostCreateAction] = useState<PostCreateAction>('close');
  const modalCloseFn = useRef<(() => void) | null>(null);

  const createResource = useResourcesServiceCreateOneResource();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const clearForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      allowTakeOver: false,
    });
    setSelectedImage(null);
  }, []);

  useEffect(() => {
    if (createResource.isSuccess && isSubmitting) {
      const createdResource = createResource.data;
      success({
        title: t('successTitle'),
        description: t('successDescription', { name: formData.name }),
      });

      if (typeof props.onCreated === 'function') {
        if (createdResource) {
          props.onCreated(createdResource);
        } else {
          console.error('Resource data is missing after successful creation.');
        }
      }

      clearForm();

      if (postCreateAction === 'close') {
        if (modalCloseFn.current) {
          modalCloseFn.current();
        }
      } else if (postCreateAction === 'open') {
        if (createdResource?.id) {
          navigate(`/resources/${createdResource.id}`);
          if (modalCloseFn.current) {
            modalCloseFn.current();
          }
        } else {
          console.error('Created resource ID not found, cannot navigate.');
          if (modalCloseFn.current) {
            modalCloseFn.current();
          }
        }
      } else if (postCreateAction === 'clear') {
        // Do nothing extra, form is cleared, modal stays open
        // This block is intentionally empty.
      }

      setIsSubmitting(false);
      setPostCreateAction('close');

      queryClient.invalidateQueries({
        queryKey: [UseResourcesServiceGetAllResourcesKeyFn()[0]],
      });
    }
  }, [
    isSubmitting,
    createResource.isSuccess,
    createResource.data,
    formData.name,
    props,
    success,
    t,
    queryClient,
    postCreateAction,
    clearForm,
    navigate,
  ]);

  useEffect(() => {
    if (isSubmitting && createResource.isError) {
      error({
        title: t('errorTitle'),
        description: t('errorDescription'),
      });
      console.error('Failed to create resource:', createResource.error);

      setIsSubmitting(false);
    }
  }, [createResource.isError, createResource.error, error, isSubmitting, t]);

  const handleCreate = useCallback(
    async (action: PostCreateAction, closeFn: () => void) => {
      if (!formData.name) {
        error({
          title: t('validationErrorTitle', 'Validation Error'),
          description: t('nameRequiredError', 'Name is required.'),
        });
        return;
      }

      modalCloseFn.current = closeFn;
      setPostCreateAction(action);
      setIsSubmitting(true);

      createResource.mutate({
        formData: {
          name: formData.name,
          description: formData.description,
          allowTakeOver: formData.allowTakeOver,
          image: selectedImage ?? undefined,
        },
      });
    },
    [createResource, formData, selectedImage, setIsSubmitting, setPostCreateAction, error, t]
  );

  return (
    <>
      {props.children(onOpen)}
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <ModalHeader>{t('modalTitle')}</ModalHeader>

              <ModalBody className="w-full space-y-4">
                <Input
                  isRequired
                  label={t('nameLabel')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  isDisabled={isSubmitting}
                  isInvalid={!formData.name}
                  errorMessage={!formData.name ? t('nameRequiredError', 'Name is required.') : ''}
                />
                <Input
                  label={t('descriptionLabel')}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  isDisabled={isSubmitting}
                />

                <Switch
                  isSelected={formData.allowTakeOver}
                  onValueChange={(value) => setFormData({ ...formData, allowTakeOver: value })}
                  isDisabled={isSubmitting}
                >
                  <div className="flex flex-col">
                    <span className="text-small">{t('allowTakeOverLabel')}</span>
                    <span className="text-tiny text-default-400">{t('allowTakeOverDescription')}</span>
                  </div>
                </Switch>

                <FileUpload
                  label={t('imageLabel')}
                  id="image"
                  onChange={setSelectedImage}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </ModalBody>

              <ModalFooter className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full">
                <Button
                  color="primary"
                  variant="ghost"
                  className="w-full sm:w-auto min-w-full sm:min-w-fit"
                  onPress={() => handleCreate('close', onClose)}
                  isLoading={isSubmitting && postCreateAction === 'close'}
                  isDisabled={isSubmitting || !formData.name}
                >
                  {t('createCloseButton', 'Create')}
                </Button>
                <Button
                  color="primary"
                  variant="ghost"
                  className="w-full sm:w-auto min-w-full sm:min-w-fit"
                  onPress={() => handleCreate('clear', onClose)}
                  isLoading={isSubmitting && postCreateAction === 'clear'}
                  isDisabled={isSubmitting || !formData.name}
                >
                  {t('createClearButton', 'Create and New')}
                </Button>
                <Button
                  color="primary"
                  className="w-full sm:w-auto min-w-full sm:min-w-fit"
                  onPress={() => handleCreate('open', onClose)}
                  isLoading={isSubmitting && postCreateAction === 'open'}
                  isDisabled={isSubmitting || !formData.name}
                >
                  {t('createOpenButton', 'Create and Open')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
