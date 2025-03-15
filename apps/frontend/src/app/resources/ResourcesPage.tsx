import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResourceList, ViewMode } from './list';

export function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get parameters from URL
  const groupIdParam = searchParams.get('groupId') || undefined;
  const groupId = groupIdParam ? groupIdParam : undefined;
  const viewMode = (searchParams.get('viewMode') as ViewMode) || undefined;

  // Update URL when viewMode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('viewMode', mode);
      return newParams;
    });
  };

  // Sync URL with component state
  useEffect(() => {
    // If we have a groupId parameter, ensure viewMode is set to 'list'
    if (groupId && (!viewMode || viewMode !== 'list')) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('viewMode', 'list');
        return newParams;
      });
    }
  }, [groupId, viewMode, setSearchParams]);

  return (
    <ResourceList
      groupId={groupId}
      initialViewMode={viewMode}
      onViewModeChange={handleViewModeChange}
    />
  );
}
