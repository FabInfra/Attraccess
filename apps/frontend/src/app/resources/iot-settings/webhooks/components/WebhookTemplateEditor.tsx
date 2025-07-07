import React, { useCallback, useMemo } from 'react';
import { Textarea, Accordion, AccordionItem, Snippet } from '@heroui/react';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import { useWebhookForm } from '../context/WebhookFormContext';
import { templateVariables } from '../types';
import { useTemplatePreview } from '../hooks/useTemplatePreview';

// Translations for this component only
import * as enTemplate from '../translations/components/template-editor/en';
import * as deTemplate from '../translations/components/template-editor/de';

const TemplatePreview: React.FC<{
  template: string;
  resourceId: number;
  dataCy?: string;
}> = ({ template, dataCy, resourceId }) => {
  const { previewTemplate } = useTemplatePreview(resourceId);

  const previewTemplateJson = useCallback(
    (template: string) => {
      const preview = previewTemplate(template);
      const json = JSON.stringify(JSON.parse(preview), null, 4);
      return json;
    },
    [previewTemplate]
  );

  const previewLines = useMemo(() => previewTemplateJson(template).split('\n'), [template, previewTemplateJson]);

  return (
    <Snippet hideSymbol data-cy={dataCy}>
      {previewLines.map((line, index) => (
        <span key={index} className="whitespace-pre-wrap">
          {line}
        </span>
      ))}
    </Snippet>
  );
};

const WebhookTemplateEditor: React.FC = () => {
  const { values, setValues, resourceId } = useWebhookForm();
  const { t } = useTranslations('webhooks.templateEditor', {
    en: enTemplate,
    de: deTemplate,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Accordion>
      <AccordionItem key="in-use" title={t('inUseTab')} data-cy="webhook-form-in-use-template-accordion-item">
        <div className="space-y-2 p-2">
          <Textarea
            name="inUseTemplate"
            value={values.inUseTemplate}
            onChange={handleInputChange}
            label={t('inUseTemplateLabel')}
            minRows={5}
            maxRows={12}
            className="font-mono text-sm"
            data-cy="webhook-form-in-use-template-textarea"
          />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('previewLabel')}</p>
            <TemplatePreview
              template={values.inUseTemplate}
              resourceId={resourceId}
              dataCy="webhook-form-in-use-template-preview-snippet"
            />
          </div>
        </div>
      </AccordionItem>

      <AccordionItem
        key="not-in-use"
        title={t('notInUseTab')}
        data-cy="webhook-form-not-in-use-template-accordion-item"
      >
        <div className="space-y-2 p-2">
          <Textarea
            name="notInUseTemplate"
            value={values.notInUseTemplate}
            onChange={handleInputChange}
            label={t('notInUseTemplateLabel')}
            minRows={5}
            maxRows={12}
            className="font-mono text-sm"
            data-cy="webhook-form-not-in-use-template-textarea"
          />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('previewLabel')}</p>
            <TemplatePreview
              template={values.notInUseTemplate}
              resourceId={resourceId}
              dataCy="webhook-form-not-in-use-template-preview-snippet"
            />
          </div>
        </div>
      </AccordionItem>

      <AccordionItem key="takeover" title={t('takeoverTab')}>
        <div className="space-y-2 p-2">
          <Textarea
            name="takeoverTemplate"
            value={values.takeoverTemplate}
            onChange={handleInputChange}
            label={t('takeoverTemplateLabel')}
            minRows={5}
            maxRows={12}
            className="font-mono text-sm"
          />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('previewLabel')}</p>
            <TemplatePreview template={values.takeoverTemplate} resourceId={resourceId} />
          </div>
        </div>
      </AccordionItem>

      <AccordionItem key="variables" title={t('variablesTab')}>
        <div className="p-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('variablesHelp')}</p>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left dark:text-gray-300">{t('variableColumn')}</th>
                <th className="px-4 py-2 text-left dark:text-gray-300">{t('descriptionColumn')}</th>
                <th className="px-4 py-2 text-left dark:text-gray-300">{t('exampleColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {templateVariables.map((variable) => (
                <tr key={variable.name} className="dark:border-gray-700">
                  <td className="px-4 py-2 font-mono dark:text-gray-300">{`{{${variable.name}}}`}</td>
                  <td className="px-4 py-2 dark:text-gray-300">{variable.description}</td>
                  <td className="px-4 py-2 font-mono dark:text-gray-300">{variable.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default WebhookTemplateEditor;
