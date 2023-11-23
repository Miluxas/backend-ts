export interface IPagination {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  sort: any;
  filters: any;
  searchQuery: string;
}
