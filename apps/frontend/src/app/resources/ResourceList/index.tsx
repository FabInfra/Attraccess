import { useState, useEffect } from 'react';
import { Toolbar } from '../toolbar';
import { ResourceListView } from './components/ResourceListView';
import { ResourceGroupView } from './components/ResourceGroupView';

export type ViewMode = 'list' | 'group';

interface ResourceListProps {
  groupId?: string;
  initialViewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export function ResourceList({
  groupId,
  initialViewMode,
  onViewModeChange,
}: ResourceListProps) {
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode || 'list');

  // Sync with external viewMode changes
  useEffect(() => {
    if (initialViewMode && initialViewMode !== viewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode, viewMode]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    
    // Call external handler if provided
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  // Get the search params to check for ungroupedOnly
  const searchParams = new URLSearchParams(window.location.search);
  const ungroupedOnly = searchParams.get('ungroupedOnly') === 'true';

  return (
    <>
      <Toolbar
        onSearch={handleSearch}
        searchIsLoading={false}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showGroupId={!!groupId}
      />

      {viewMode === 'list' ? (
        <ResourceListView 
          searchInput={searchInput}
          groupId={groupId}
          ungroupedOnly={ungroupedOnly}
        />
      ) : (
        <ResourceGroupView 
          searchInput={searchInput}
        />
      )}
    </>
  );
} 