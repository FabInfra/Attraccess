import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useEmailTemplatesServiceEmailTemplateControllerFindOne as useFindOneEmailTemplate,
  useEmailTemplatesServiceEmailTemplateControllerUpdate as useUpdateEmailTemplate,
} from '@attraccess/react-query-client';
import { EmailTemplate } from '@attraccess/react-query-client';
import { UpdateEmailTemplateDto } from '@attraccess/react-query-client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
  Input, // Changed from TextInput
  Textarea,
} from '@heroui/react';
import { toast } from 'react-toastify';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { PageHeader } from '../../components/pageHeader';
import { UseQueryOptions } from '@tanstack/react-query'; // For react-query options type
import { ArrowLeft, Save } from 'lucide-react';

import * as enTranslationsFile from './editEmailTemplate.en.json';
import * as deTranslationsFile from './editEmailTemplate.de.json';

// Debounce utility
function debounce<T extends unknown[], R>(func: (...args: T) => R, waitFor: number): (...args: T) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: T) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

const emailTemplateFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().nullable().optional(), // Allow null from DB
  mjmlContent: z.string().min(1, 'MJML content is required'),
});
type EmailTemplateFormData = z.infer<typeof emailTemplateFormSchema>;

export function EditEmailTemplatePage() {
  // Hooks are declared at the top, before any conditional returns.
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslations('editEmailTemplate', { en: enTranslationsFile, de: deTranslationsFile });
  
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);

  const queryOptions: Omit<UseQueryOptions<EmailTemplate, Error>, "queryKey" | "queryFn"> = { 
    enabled: !!routeId // Query is enabled only if routeId is present
  };

  const { data: template, isLoading: isLoadingTemplate, error: fetchError } = useFindOneEmailTemplate(
    // Pass routeId directly; if it's undefined, query will be disabled by `enabled` flag.
    // The hook or its underlying fetcher should handle id potentially being undefined when disabled.
    { id: routeId! }, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    undefined, 
    queryOptions
  );

  const mutation = useUpdateEmailTemplate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmailTemplateFormData>({
    resolver: zodResolver(emailTemplateFormSchema),
    defaultValues: {
      subject: '',
      description: '',
      mjmlContent: '',
    }
  });

  const mjmlContentValue = useWatch({ control, name: 'mjmlContent' });

  // Effect to handle navigation if routeId is missing from URL
  useEffect(() => {
    if (!routeId) {
      // Using t() here assumes useTranslations is already initialized.
      // Add a generic message if t is not ready or use a static string.
      toast.error(t ? t('notifications.missingIdError') : "Email template ID is missing in URL.");
      navigate('/admin/email-templates', { replace: true });
    }
  }, [routeId, navigate, t]);

  // Effect to reset form fields when template data loads or changes
  useEffect(() => {
    if (template) {
      reset({
        subject: template.subject,
        description: template.description || '',
        mjmlContent: template.mjmlContent || '',
      });
    }
  }, [template, reset]);

  // Callback to fetch MJML preview
  const fetchPreview = useCallback(async (mjml: string) => {
    if (!mjml.trim()) {
      setPreviewHtml('<p style="text-align:center; color: #555; padding-top: 20px;">Start typing MJML to see a preview.</p>');
      setIsPreviewLoading(false);
      return;
    }
    setIsPreviewLoading(true);
    try {
      const response = await fetch('/api/email-templates/preview-mjml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mjmlContent: mjml }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorData}`);
      }
      const data = await response.json();
      setPreviewHtml(data.html);
    } catch (error) {
      console.error('Failed to fetch MJML preview:', error);
      setPreviewHtml(`<p style="color: red; padding: 10px;">Error loading preview: ${error instanceof Error ? error.message : 'Unknown error'}</p>`);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [setPreviewHtml, setIsPreviewLoading]); // Added dependencies

  // Debounced version of fetchPreview
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchPreview = useCallback(debounce(fetchPreview, 750), [fetchPreview]);

  // Effect to trigger preview when MJML content changes
  useEffect(() => {
    if (mjmlContentValue !== undefined) {
        debouncedFetchPreview(mjmlContentValue);
    } else if (template?.mjmlContent) { // Initial load from template if mjmlContentValue is not yet set by watch
        debouncedFetchPreview(template.mjmlContent);
    }
  }, [mjmlContentValue, template?.mjmlContent, debouncedFetchPreview]);

  // Handle API fetch error for the template
  // This useEffect is for side-effects like toasts. The rendering logic is separate.
  useEffect(() => {
    if (fetchError && !isLoadingTemplate) {
      toast.error(t('notifications.fetchError'));
    }
  }, [fetchError, isLoadingTemplate, t]);


  // Conditional return if routeId is missing (after all hooks are declared)
  if (!routeId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <p className="ml-4">{t ? t('loadingOrRedirecting') : 'Loading or redirecting...'}</p>
      </div>
    );
  }
  

  // Form submission handler
  const onSubmit = async (formData: EmailTemplateFormData) => {
    // routeId is guaranteed non-null here due to the check above.
    try {
      const updateDto: UpdateEmailTemplateDto = {
        subject: formData.subject,
        description: formData.description || undefined,
        mjmlContent: formData.mjmlContent,
      };
      await mutation.mutateAsync({ id: routeId!, requestBody: updateDto }); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      toast.success(t('notifications.updateSuccess'));
      navigate('/admin/email-templates');
    } catch (error) {
      toast.error(t('notifications.updateError'));
      console.error('Update error:', error);
    }
  };
  
  // Loading state for the main template data
  if (isLoadingTemplate && !template) { 
    return (
      <div className="w-full mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-7xl">
        <PageHeader
          title={t('title')}
          subtitle={t('subtitle')}
          icon={<ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => navigate('/admin/email-templates')} />}
        />
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
          <p className="ml-4">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // If after loading, template is still not found
  if (!template && !isLoadingTemplate) {
     return (
      <div className="w-full mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-7xl">
        <PageHeader
          title={t('title')}
          subtitle={t('subtitle')}
          icon={<ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => navigate('/admin/email-templates')} />}
        />
        <div className="text-center py-8 text-gray-500">{t('notifications.fetchError')} (Template not found)</div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="w-full mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-7xl">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => navigate('/admin/email-templates')} />}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-5 sm:mt-8">
          <CardHeader>
            {/* template should be defined here due to checks above */}
            {template && (
              <h3 className="text-lg font-medium">
                {template.name} ({template.id})
              </h3>
            )}
          </CardHeader>
          <CardBody className="space-y-6">
            <div>
              <Input
                label={t('form.subject')}
                {...register('subject')}
                placeholder={t('form.subjectPlaceholder')}
                errorMessage={errors.subject?.message}
                className="w-full"
              />
            </div>
            <div>
              <Input
                label={t('form.description')}
                {...register('description')}
                placeholder={t('form.descriptionPlaceholder')}
                errorMessage={errors.description?.message}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Textarea
                  label={t('form.mjmlContent')}
                  {...register('mjmlContent')}
                  placeholder={t('form.mjmlContentPlaceholder')}
                  errorMessage={errors.mjmlContent?.message}
                  className="w-full font-mono"
                  rows={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                  {isPreviewLoading && <Spinner size="sm" className="ml-2 inline" />}
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <iframe
                    srcDoc={previewHtml || '<p style="text-align:center; color: #555; padding-top: 20px;">Enter MJML to see a preview.</p>'}
                    title="MJML Preview"
                    style={{ width: '100%', height: '435px', border: 'none' }}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="bordered"
              onClick={() => navigate('/admin/email-templates')}
              disabled={isSubmitting}
            >
              {t('form.cancelButton')}
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting || isLoadingTemplate || isPreviewLoading} isLoading={isSubmitting}>
              <Save size={18} className="mr-2" />
              {isSubmitting ? t('form.saving') : t('form.saveButton')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

