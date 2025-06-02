import React, { useCallback } from 'react';
import { Textarea, Accordion, AccordionItem, Snippet } from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { useWebhookForm } from '../context/WebhookFormContext';
import { templateVariables } from '../types';
import { useTemplatePreview } from '../hooks/useTemplatePreview';

// Translations for this component only
import * as enTemplate from '../translations/components/template-editor/en';
import * as deTemplate from '../translations/components/template-editor/de';

const WebhookTemplateEditor: React.FC = () => {
  const { values, setValues, resourceId } = useWebhookForm();
  const { t } = useTranslations('webhooks.templateEditor', {
    en: enTemplate,
    de: deTemplate,
  });
  const { previewTemplate } = useTemplatePreview(resourceId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const previewTemplateJson = useCallback(
    (template: string) => {
      const preview = previewTemplate(template);
      const json = JSON.stringify(JSON.parse(preview), null, 4);
      return json;
    },
    [previewTemplate]
  );

  return (
    <Accordion>
      <AccordionItem key="in-use" title={t('inUseTab')}>
        <div className="space-y-2 p-2">
          <Textarea
            name="inUseTemplate"
            value={values.inUseTemplate}
            onChange={handleInputChange}
            label={t('inUseTemplateLabel')}
            minRows={5}
            maxRows={12}
            className="font-mono text-sm"
          />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('previewLabel')}</p>
            <Snippet hideSymbol>
              {previewTemplateJson(values.inUseTemplate)
                .split('\n')
                .map((line, index) => (
                  <span key={index} className="whitespace-pre-wrap">
                    {line}
                  </span>
                ))}
            </Snippet>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem key="not-in-use" title={t('notInUseTab')}>
        <div className="space-y-2 p-2">
          <Textarea
            name="notInUseTemplate"
            value={values.notInUseTemplate}
            onChange={handleInputChange}
            label={t('notInUseTemplateLabel')}
            minRows={5}
            maxRows={12}
            className="font-mono text-sm"
          />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('previewLabel')}</p>
            <Snippet hideSymbol>
              {previewTemplateJson(values.notInUseTemplate)
                .split('\n')
                .map((line, index) => (
                  <span key={index} className="whitespace-pre-wrap">
                    {line}
                  </span>
                ))}
            </Snippet>
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
            <Snippet hideSymbol>
              {previewTemplateJson(values.takeoverTemplate)
                .split('\n')
                .map((line, index) => (
                  <span key={index} className="whitespace-pre-wrap">
                    {line}
                  </span>
                ))}
            </Snippet>
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
