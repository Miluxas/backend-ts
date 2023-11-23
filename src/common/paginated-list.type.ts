export type PaginatedList<T> = {
  items: T;
  pagination: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    search?:string;
  };
};
