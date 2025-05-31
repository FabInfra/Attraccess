import React from 'react';
import { useEmailTemplatesServiceEmailTemplateControllerFindAll } from '@attraccess/react-query-client';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Card,
  CardHeader,
  CardBody,
} from '@heroui/react';
import { Edit3, Mail } from 'lucide-react'; // Mail for PageHeader icon
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { PageHeader } from '../../components/pageHeader'; // Assuming PageHeader exists
import { Link } from 'react-router-dom'; // For edit button link

import * as en from './emailTemplates.en.json';
import * as de from './emailTemplates.de.json';

export function EmailTemplatesPage() {
  const { t } = useTranslations('emailTemplates', { en, de });
  const { data: emailTemplates, isLoading } = useEmailTemplatesServiceEmailTemplateControllerFindAll();

  // TODO: Add navigation to an edit page, e.g., /admin/email-templates/${template.id}/edit

  return (
    <div className="w-full mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-7xl">
      <PageHeader title={t('title')} subtitle={t('subtitle')} icon={<Mail className="w-6 h-6" />} />

      <Card className="mt-5 sm:mt-8">
        <CardHeader>
          {/* Optional: Add a create button if needed in the future */}
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
              <p className="ml-4">{t('loading')}</p>
            </div>
          ) : emailTemplates && emailTemplates.length > 0 ? (
            <Table aria-label="Email templates table">
              <TableHeader>
                <TableColumn>{t('columns.name')}</TableColumn>
                <TableColumn>{t('columns.description')}</TableColumn>
                <TableColumn>{t('columns.subject')}</TableColumn>
                <TableColumn>{t('columns.actions')}</TableColumn>
              </TableHeader>
              <TableBody items={emailTemplates}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>
                      <Button
                        as={Link}
                        to={`/admin/email-templates/${item.id}/edit`} // Placeholder for edit route
                        variant="light"
                        color="primary"
                        isIconOnly
                        aria-label={t('editButton')}
                      >
                        <Edit3 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">{t('noTemplates')}</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
