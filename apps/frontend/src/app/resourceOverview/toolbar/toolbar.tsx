import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { SearchIcon, PlusIcon, ScanQrCodeIcon, ListFilterIcon } from 'lucide-react';
import { ResourceGroupUpsertModal } from '../../resource-groups/upsertModal/resourceGroupUpsertModal';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import { ResourceEditModal } from '../../resources/editModal/resourceEditModal';
import { useNavigate } from 'react-router-dom';

import * as en from './toolbar.en.json';
import * as de from './toolbar.de.json';
import { ResourceScanner } from './scanner';
import { ResourceFilter } from './filter';
import { FilterProps } from '../filterProps';

interface ToolbarProps {
  searchIsLoading?: boolean;
}

export function Toolbar({ searchIsLoading, ...filterProps }: Readonly<ToolbarProps & FilterProps>) {
  const { hasPermission } = useAuth();
  const canManageResources = hasPermission('canManageResources');
  const navigate = useNavigate();

  const { t } = useTranslations('toolbar', {
    en,
    de,
  });

  return (
    <div>
      <div className="mb-6 flex flex-row w-full items-center justify-between gap-4 rounded-full bg-white p-2 shadow-sm dark:bg-zinc-800">
        <div className="relative flex-grow">
          <Input
            radius="full"
            value={filterProps.search}
            onChange={(e) => filterProps.onSearchChanged(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className={` ${searchIsLoading ? 'animate-pulse' : ''}`}
            startContent={
              <>
                <ResourceFilter
                  onlyInUseByMe={filterProps.onlyInUseByMe}
                  onOnlyInUseByMeChanged={filterProps.onOnlyInUseByMeChanged}
                  onlyWithPermissions={filterProps.onlyWithPermissions}
                  onOnlyWithPermissionsChanged={filterProps.onOnlyWithPermissionsChanged}
                >
                  {({ onOpen }) => (
                    <Button
                      size="sm"
                      variant="light"
                      startContent={<ListFilterIcon size={18} />}
                      isIconOnly
                      onPress={onOpen}
                    />
                  )}
                </ResourceFilter>
                <SearchIcon size={18} />
              </>
            }
            classNames={{
              inputWrapper: 'bg-transparent border-none shadow-none focus-within:ring-0 pl-2',
              input: 'text-sm',
            }}
            data-cy="resource-search-input"
          />
        </div>

        <ResourceScanner>
          {(onOpen: () => void) => (
            <Button variant="light" radius="full" onPress={onOpen} startContent={<ScanQrCodeIcon />} isIconOnly />
          )}
        </ResourceScanner>
      </div>

      <div className="flex flex-row gap-2 justify-end mb-6">
        {canManageResources && (
          <div className="flex items-center gap-2 mr-1 hidden md:flex">
            <ResourceGroupUpsertModal>
              {(onOpen: () => void) => (
                <Button
                  radius="full"
                  onPress={onOpen}
                  startContent={<PlusIcon size={18} />}
                  color="secondary"
                  size="sm"
                  data-cy="toolbar-open-create-resource-group-modal-button"
                >
                  {t('addGroup')}
                </Button>
              )}
            </ResourceGroupUpsertModal>

            <ResourceEditModal onUpdated={(resource) => navigate(`/resources/${resource.id}`)} closeOnSuccess>
              {(onOpen: () => void) => (
                <Button
                  radius="full"
                  onPress={onOpen}
                  startContent={<PlusIcon size={18} />}
                  color="primary"
                  size="sm"
                  data-cy="toolbar-open-create-resource-modal-button"
                >
                  {t('addResource')}
                </Button>
              )}
            </ResourceEditModal>
          </div>
        )}
      </div>
    </div>
  );
}
