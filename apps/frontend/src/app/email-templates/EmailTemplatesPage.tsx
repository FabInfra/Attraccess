import { useEmailTemplatesServiceEmailTemplateControllerFindAll } from '@attraccess/react-query-client';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip } from '@heroui/react';
import { Edit3, Mail } from 'lucide-react'; // Mail for PageHeader icon
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { PageHeader } from '../../components/pageHeader'; // Assuming PageHeader exists
import { ErrorDisplay } from '../../components/errorDisplay/ErrorDisplay';
import { Link } from 'react-router-dom'; // For edit button link
import { TableDataLoadingIndicator, TableEmptyState } from '../../components/tableComponents';
import { useReactQueryStatusToHeroUiTableLoadingState } from '../../hooks/useReactQueryStatusToHeroUiTableLoadingState';

import * as en from './emailTemplates.en.json';
import * as de from './emailTemplates.de.json';

export function EmailTemplatesPage() {
  const { t } = useTranslations('emailTemplates', { en, de });
  const {
    data: emailTemplates,
    status: fetchStatus,
    error,
    refetch,
  } = useEmailTemplatesServiceEmailTemplateControllerFindAll();

  const loadingState = useReactQueryStatusToHeroUiTableLoadingState(fetchStatus);

  // Handle error state with inline display
  if (error) {
    return (
      <>
        <PageHeader title={t('title')} subtitle={t('subtitle')} icon={<Mail className="w-6 h-6" />} />
        <ErrorDisplay error={error} onRetry={() => refetch()} message={t('error.fetchDescription')} />
      </>
    );
  }

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} icon={<Mail className="w-6 h-6" />} />

      <Table aria-label="Email templates table">
        <TableHeader>
          <TableColumn>{t('columns.type')}</TableColumn>
          <TableColumn>{t('columns.subject')}</TableColumn>
          <TableColumn>{t('columns.actions')}</TableColumn>
        </TableHeader>
        <TableBody
          items={emailTemplates ?? []}
          loadingState={loadingState}
          loadingContent={<TableDataLoadingIndicator />}
          emptyContent={<TableEmptyState />}
        >
          {(item) => (
            <TableRow key={item.type}>
              <TableCell>
                <Chip color="primary" variant="flat">
                  {item.type}
                </Chip>
              </TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>
                <Button
                  as={Link}
                  to={`/email-templates/${item.type}`}
                  variant="light"
                  color="primary"
                  isIconOnly
                  aria-label={t('editButton')}
                  startContent={<Edit3 size={18} />}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
