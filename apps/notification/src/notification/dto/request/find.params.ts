export class FindParams {
  userId?: string | undefined;
  skip: number;
  take: number;
  orderBy: 'asc' | 'desc';
}
