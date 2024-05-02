export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

export class Page<T> {
  data: T[];
  meta: {
    page: {
      current: number;
      total: number;
      items: number;
      itemsPerPage: number;
    };
    sort: SortOption[];
  };
}
