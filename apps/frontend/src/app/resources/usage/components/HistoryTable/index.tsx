
import { useCallback, useMemo, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, Pagination } from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { TableDataLoadingIndicator } from '../../../../../../components/TableDataLoadingIndicator';
import * as en from './utils/translations/en';
import * as de from './utils/translations/de';
import { generateHeaderColumns } from './utils/tableHeaders';
import { generateRowCells } from './utils/tableRows';
import { useResourcesServiceResourceUsageGetHistory, ResourceUsage } from '@attraccess/react-query-client';
import { useAuth } from '../../../../../hooks/useAuth';
import { Select } from '../../../../../components/select';

interface HistoryTableProps {
  resourceId: number;
  showAllUsers?: boolean;
  canManageResources: boolean;
  onSessionClick: (session: ResourceUsage) => void;
}

export const HistoryTable = ({
  resourceId,
  showAllUsers = false,
  canManageResources,
  onSessionClick,
}: HistoryTableProps) => {
  const { t } = useTranslations('historyTable', { en, de });
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  }, []);

  const handleSelectionChange = useCallback(
    (key: string) => {
      handleRowsPerPageChange(Number(key));
    },
    [handleRowsPerPageChange]
  );

  const {
    data: usageHistory,
    isLoading,
    error,
  } = useResourcesServiceResourceUsageGetHistory(
    {
      resourceId,
      page,
      limit: rowsPerPage,
      userId: showAllUsers ? undefined : user?.id,
    },
    undefined,
    {
      enabled: !!user,
    }
  );

  const headerColumns = useMemo(
    () => generateHeaderColumns(t, showAllUsers, canManageResources),
    [t, showAllUsers, canManageResources]
  );

  const loadingState = useMemo(() => {
    return isLoading ? 'loading' : 'idle';
  }, [isLoading]);

  if (error) {
    return <div className="text-center py-4 text-red-500">{t('errorLoadingHistory')}</div>;
  }

  return (
    <Table
      aria-label="Resource usage history"
      shadow="none"
      data-cy="resource-usage-history-table"
      bottomContent={
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Select
              selectedKey={rowsPerPage.toString()}
              onSelectionChange={handleSelectionChange}
              items={[5, 10, 25, 50].map((item) => ({
                key: item.toString(),
                label: item.toString(),
              }))}
              label="Rows per page"
            />
          </div>
          <Pagination total={usageHistory?.totalPages ?? 1} page={page} onChange={handlePageChange} />
        </div>
      }
    >
      <TableHeader>{headerColumns}</TableHeader>
      <TableBody
        loadingState={loadingState}
        emptyContent={t('noUsageHistory')}
        loadingContent={<TableDataLoadingIndicator />}
      >
        {(usageHistory?.data ?? []).map((session: ResourceUsage) => (
          <TableRow
            key={session.id}
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => onSessionClick(session)}
          >
            {generateRowCells(session, t, showAllUsers, canManageResources)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
