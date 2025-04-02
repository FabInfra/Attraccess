import { Pagination } from '@heroui/react';

interface ResourceListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ResourceListPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ResourceListPaginationProps) {
  return (
    <div className="mt-8 flex justify-center">
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        onChange={onPageChange}
      />
    </div>
  );
} 