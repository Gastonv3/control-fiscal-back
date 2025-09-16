export interface IPaginationFilter {
  offset?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}
