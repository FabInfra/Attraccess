import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Search, Plus, List, Grid, Settings } from 'lucide-react';
import { ResourceCreateModal } from './resourceCreateModal';
import { useAuth } from '../../hooks/useAuth';
import { useTranslations } from '../../i18n';
import * as en from './translations/toolbar.en';
import * as de from './translations/toolbar.de';
import { ButtonGroup } from '@heroui/react';
import { ViewMode } from './ResourceList';
import { useResourcesStore } from './resources.store';

interface ToolbarProps {
  onSearch: (value: string) => void;
  searchIsLoading?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showGroupId?: boolean;
}

export function Toolbar({
  onSearch,
  searchIsLoading,
  viewMode,
  onViewModeChange,
  showGroupId,
}: ToolbarProps) {
  const { hasPermission } = useAuth();
  const canManageResources = hasPermission('canManageResources');
  const [searchValue, setSearchValue] = useState('');

  const { isInEditMode, setIsInEditMode } = useResourcesStore();

  const { t } = useTranslations('toolbar', {
    en,
    de,
  });

  useEffect(() => {
    onSearch(searchValue);
  }, [searchValue, onSearch]);

  return (
    <div className="mb-6 flex flex-col md:flex-row w-full gap-2 items-center">
      <div className="relative w-full">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className={`w-full ${searchIsLoading ? 'animate-pulse' : ''}`}
          startContent={<Search />}
          size="sm"
        />
      </div>
      <div className="flex gap-2 items-center">
        {!showGroupId && !isInEditMode && (
          <ButtonGroup>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'solid' : 'bordered'}
              onPress={() => onViewModeChange('list')}
              startContent={<List className="w-4 h-4" />}
              aria-label={t('listView')}
            >
              {t('listView')}
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'group' ? 'solid' : 'bordered'}
              onPress={() => onViewModeChange('group')}
              startContent={<Grid className="w-4 h-4" />}
              aria-label={t('groupView')}
            >
              {t('groupView')}
            </Button>
          </ButtonGroup>
        )}
        {canManageResources && (
          <ButtonGroup>
            <Button
              size="sm"
              startContent={<Settings className="w-4 h-4" />}
              onPress={() => setIsInEditMode(!isInEditMode)}
            >
              {t('edit')}
            </Button>
            <ResourceCreateModal>
              {(onOpen) => (
                <Button
                  size="sm"
                  onPress={onOpen}
                  startContent={<Plus className="w-4 h-4" />}
                  color="primary"
                >
                  {t('addResource')}
                </Button>
              )}
            </ResourceCreateModal>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
}
