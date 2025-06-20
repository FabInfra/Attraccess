
import { ProgressSpinner } from '@hero-ui/react';

export const TableDataLoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <ProgressSpinner size="lg" />
    </div>
  );
};
