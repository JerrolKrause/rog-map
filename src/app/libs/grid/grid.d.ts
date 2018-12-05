declare interface GridState {
  columns?: ColumnState[];
  sorts?: { colId: string; sort: string }[];
  filters?: {
    [key: string]: {
      filter: string;
      filterType: string;
      type: string;
    };
  };
}
