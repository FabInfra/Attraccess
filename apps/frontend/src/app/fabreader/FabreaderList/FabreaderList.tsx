import { useEffect, useState } from 'react';
import { Alert, Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { Cloud, CloudOff, CpuIcon } from 'lucide-react';
import { TableDataLoadingIndicator } from '../../../components/tableComponents';
import { EmptyState } from '../../../components/emptyState';
import { useDateTimeFormatter, useTranslations } from '@fabaccess/plugins-frontend-ui';
import { FabreaderEditor } from '../FabreaderEditor/FabreaderEditor';
import { useFabReaderServiceGetReaders } from '@fabaccess/react-query-client';
import { useToastMessage } from '../../../components/toastProvider';
import { PageHeader } from '../../../components/pageHeader';
import { FabreaderFlasher } from '../FabreaderFlasher/FabreaderFlasher';
import { useReactQueryStatusToHeroUiTableLoadingState } from '../../../hooks/useReactQueryStatusToHeroUiTableLoadingState';

import de from './FabreaderList.de.json';
import en from './FabreaderList.en.json';

export const FabreaderList = () => {
  const { t } = useTranslations('fabreader-list', {
    de,
    en,
  });

  const {
    data: readers,
    error: readersError,
    status: fetchStatus,
  } = useFabReaderServiceGetReaders(undefined, {
    refetchInterval: 5000,
  });

  const loadingState = useReactQueryStatusToHeroUiTableLoadingState(fetchStatus);

  const toast = useToastMessage();

  const [openedReaderEditor, setOpenedReaderEditor] = useState<number | null>(null);

  useEffect(() => {
    if (readersError) {
      toast.error({
        title: t('error.fetchReaders'),
        description: (readersError as Error).message,
      });
    }
  }, [readersError, t, toast]);

  const formatDateTime = useDateTimeFormatter();

  return (
    <>
      <PageHeader
        title={t('page.title')}
        actions={
          <FabreaderFlasher>
            {(onOpen) => (
              <Button
                variant="light"
                startContent={<CpuIcon className="w-4 h-4" />}
                onPress={onOpen}
                data-cy="fabreader-list-open-flasher-button"
              >
                {t('page.actions.openFlasher')}
              </Button>
            )}
          </FabreaderFlasher>
        }
      />

      <Alert color="danger" className="mb-4">
        {t('workInProgress')}
      </Alert>

      <FabreaderEditor
        readerId={openedReaderEditor ?? undefined}
        isOpen={openedReaderEditor !== null}
        onCancel={() => setOpenedReaderEditor(null)}
        onSave={() => setOpenedReaderEditor(null)}
      />

      <Table aria-label="Fabreaders" data-cy="fabreader-list-table">
        <TableHeader>
          <TableColumn>{t('table.columns.name')}</TableColumn>
          <TableColumn>{t('table.columns.lastConnection')}</TableColumn>
          <TableColumn>{t('table.columns.connected')}</TableColumn>
          <TableColumn>{t('table.columns.actions')}</TableColumn>
        </TableHeader>
        <TableBody
          items={readers ?? []}
          loadingState={loadingState}
          loadingContent={<TableDataLoadingIndicator />}
          emptyContent={<EmptyState />}
        >
          {(reader) => (
            <TableRow key={reader.id}>
              <TableCell>{reader.name}</TableCell>
              <TableCell>{formatDateTime(reader.lastConnection)}</TableCell>
              <TableCell>
                <Chip color={reader.connected ? 'success' : 'danger'}>
                  {reader.connected ? <Cloud /> : <CloudOff />}
                </Chip>
              </TableCell>
              <TableCell>
                <Button
                  onPress={() => setOpenedReaderEditor(reader.id)}
                  data-cy={`fabreader-list-edit-reader-button-${reader.id}`}
                >
                  {t('table.actions.editReader')}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
