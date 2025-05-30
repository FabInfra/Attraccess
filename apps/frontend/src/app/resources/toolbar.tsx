import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Search, Plus } from 'lucide-react';
import { ResourceGroupUpsertModal } from './resourceGroupUpsertModal';
import { useAuth } from '../../hooks/useAuth';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './toolbar.en.json';
import * as de from './toolbar.de.json';
import { ResourceEditModal } from './resourceEditModal';
import { useNavigate } from 'react-router-dom';

interface ToolbarProps {
  onSearch: (value: string) => void;
  searchIsLoading?: boolean;
}

export function Toolbar({ onSearch, searchIsLoading }: ToolbarProps) {
  const { hasPermission } = useAuth();
  const canManageResources = hasPermission('canManageResources');
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const { t } = useTranslations('toolbar', {
    en,
    de,
  });

  useEffect(() => {
    onSearch(searchValue);
  }, [searchValue, onSearch]);

  return (
    <div className="mb-6 flex flex-row w-full items-center justify-between gap-4 rounded-full bg-white p-2 shadow-sm dark:bg-zinc-800">
      <div className="relative flex-grow">
        <Input
          radius="full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className={` ${searchIsLoading ? 'animate-pulse' : ''}`}
          startContent={<Search size={18} />}
          classNames={{
            inputWrapper: 'bg-transparent border-none shadow-none focus-within:ring-0 pl-2',
            input: 'text-sm',
          }}
          data-cy="resource-search-input"
        />
      </div>
      {canManageResources && (
        <div className="flex items-center gap-2 mr-1 hidden md:flex">
          <ResourceGroupUpsertModal>
            {(onOpen: () => void) => (
              <Button
                radius="full"
                onPress={onOpen}
                startContent={<Plus size={18} />}
                color="secondary"
                size="sm"
                data-cy="add-resource-group-button"
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
                startContent={<Plus size={18} />}
                color="primary"
                size="sm"
                data-cy="add-resource-button"
              >
                {t('addResource')}
              </Button>
            )}
          </ResourceEditModal>
        </div>
      )}
    </div>
  );
}
