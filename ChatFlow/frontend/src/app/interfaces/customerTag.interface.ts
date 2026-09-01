export interface CustomerTag {
  id: number;
  customerId: number;
  tagId: number;
  tag: {
    name: string;
    color: string;
  };
}