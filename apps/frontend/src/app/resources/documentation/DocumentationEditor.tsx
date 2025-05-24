import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Tab,
  Tabs,
  Textarea,
} from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { ArrowLeft, Save } from 'lucide-react';
import { useToastMessage } from '../../../components/toastProvider';
import { PageHeader } from '../../../components/pageHeader';
import {
  useResourcesServiceGetOneResourceById,
  useResourcesServiceUpdateOneResource,
  UseResourcesServiceGetOneResourceByIdKeyFn,
  DocumentationType,
} from '@attraccess/react-query-client';
import ReactMarkdown from 'react-markdown';
import en from './documentationEditor.en.json';
import de from './documentationEditor.de.json';
import { useQueryClient } from '@tanstack/react-query';

function DocumentationEditorComponent() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '', 10);
  const navigate = useNavigate();
  const { success, error: showError } = useToastMessage();
  const queryClient = useQueryClient();

  const { t } = useTranslations('documentationEditor', {
    en,
    de,
  });

  const [documentationType, setDocumentationType] = useState<DocumentationType | ''>('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [selectedTab, setSelectedTab] = useState('edit');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Get resource query key for cache operations
  const resourceQueryKey = UseResourcesServiceGetOneResourceByIdKeyFn({ id: resourceId });

  const {
    data: resource,
    isLoading: isLoadingResource,
    isError: isResourceError,
    error: resourceError,
    refetch: refetchResource,
  } = useResourcesServiceGetOneResourceById({
    id: resourceId,
  });

  const updateResource = useResourcesServiceUpdateOneResource({
    // Invalidate queries after successful update
    onSuccess: () => {
      // Invalidate the specific resource query
      queryClient.invalidateQueries({ queryKey: resourceQueryKey });
      // Invalidate the resources list query if needed
      queryClient.invalidateQueries({ queryKey: ['ResourcesService', 'getAllResources'] });

      success({
        title: t('notifications.saveSuccess.title'),
        description: t('notifications.saveSuccess.description'),
      });

      navigate(`/resources/${resourceId}`);
    },
    // Handle errors
    onError: (error) => {
      showError({
        title: t('notifications.saveError.title'),
        description: t('notifications.saveError.description'),
      });
      console.error('Failed to save documentation:', error);
    },
  });

  // Initialize form with resource data
  useEffect(() => {
    if (resource) {
      // Set the documentation type directly from the resource
      if (resource.DocumentationType) {
        setDocumentationType(resource.DocumentationType as DocumentationType);
      } else {
        setDocumentationType('');
      }
      setMarkdownContent(resource.documentationMarkdown || '');
      setUrlContent(resource.documentationUrl || '');
    }
  }, [resource]);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (documentationType === DocumentationType.URL && !urlContent) {
      errors.url = t('validation.urlRequired');
    }

    if (documentationType === DocumentationType.URL && urlContent) {
      try {
        new URL(urlContent);
      } catch {
        errors.url = t('validation.invalidUrl');
      }
    }

    if (documentationType === DocumentationType.MARKDOWN && !markdownContent) {
      errors.markdown = t('validation.markdownRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [documentationType, markdownContent, urlContent, t]);

  const handleSave = useCallback(() => {
    if (!validateForm() || !resource) {
      return;
    }

    // Perform mutation
    updateResource.mutate({
      id: resourceId,
      formData: {
        documentationType: documentationType || undefined,
        documentationMarkdown: documentationType === DocumentationType.MARKDOWN ? markdownContent : undefined,
        documentationUrl: documentationType === DocumentationType.URL ? urlContent : undefined,
      },
    });
  }, [documentationType, markdownContent, resource, resourceId, updateResource, urlContent, validateForm]);

  // Handle loading state
  if (isLoadingResource) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" label={t('loading')} />
      </div>
    );
  }

  // Handle error state
  if (isResourceError) {
    return (
      <Card className="max-w-xl mx-auto my-8">
        <CardHeader>
          <h2 className="text-xl">{t('error.title')}</h2>
        </CardHeader>
        <CardBody>
          <p className="text-danger">{resourceError instanceof Error ? resourceError.message : t('error.unknown')}</p>
        </CardBody>
        <CardFooter className="flex justify-center gap-4">
          <Button onPress={() => refetchResource()} color="primary">
            {t('actions.retry')}
          </Button>
          <Button onPress={() => navigate('/resources')} variant="flat" startContent={<ArrowLeft size={16} />}>
            {t('actions.backToResources')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Handle not found state
  if (!resource) {
    return (
      <Card className="max-w-xl mx-auto my-8">
        <CardHeader>
          <h2 className="text-xl">{t('notFound.title')}</h2>
        </CardHeader>
        <CardBody>
          <p>{t('notFound.message')}</p>
        </CardBody>
        <CardFooter className="justify-center">
          <Button onPress={() => navigate('/resources')} variant="flat" startContent={<ArrowLeft size={16} />}>
            {t('actions.backToResources')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title={t('title')}
        subtitle={resource.name}
        backTo={`/resources/${resourceId}`}
        actions={
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={updateResource.isPending}
            startContent={<Save className="w-4 h-4" />}
          >
            {t('actions.save')}
          </Button>
        }
      />

      <Card className="mt-6">
        <CardHeader>
          <RadioGroup
            label={t('documentationType.label')}
            orientation="horizontal"
            value={documentationType}
            onValueChange={setDocumentationType as (value: string) => void}
            isDisabled={updateResource.isPending}
          >
            <Radio value={DocumentationType.MARKDOWN}>{t('documentationType.markdown')}</Radio>
            <Radio value={DocumentationType.URL}>{t('documentationType.url')}</Radio>
          </RadioGroup>
        </CardHeader>
        <CardBody>
          {documentationType === DocumentationType.MARKDOWN && (
            <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key.toString())}>
              <Tab key="edit" title={t('edit')}>
                <Textarea
                  label={t('markdownContent.label')}
                  placeholder={t('markdownContent.placeholder')}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  minRows={15}
                  isInvalid={!!validationErrors.markdown}
                  errorMessage={validationErrors.markdown}
                  isDisabled={updateResource.isPending}
                />
              </Tab>
              <Tab key="preview" title={t('preview')}>
                <div className="border rounded p-4 min-h-[300px] prose max-w-none">
                  {markdownContent ? (
                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                  ) : (
                    <p className="text-default-400 italic">{t('markdownContent.placeholder')}</p>
                  )}
                </div>
              </Tab>
            </Tabs>
          )}

          {documentationType === DocumentationType.URL && (
            <Input
              label={t('urlContent.label')}
              placeholder={t('urlContent.placeholder')}
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
              isInvalid={!!validationErrors.url}
              errorMessage={validationErrors.url}
              isDisabled={updateResource.isPending}
            />
          )}
        </CardBody>
        <CardFooter>
          <div className="flex justify-end space-x-2">
            <Button
              variant="light"
              onPress={() => navigate(`/resources/${resourceId}`)}
              isDisabled={updateResource.isPending}
            >
              {t('actions.cancel')}
            </Button>
            <Button color="primary" onPress={handleSave} isLoading={updateResource.isPending}>
              {t('actions.save')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const DocumentationEditor = memo(DocumentationEditorComponent);
