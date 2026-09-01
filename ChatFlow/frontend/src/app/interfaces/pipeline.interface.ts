export interface PipelineTag {

  id: string;

  name: string;

  color: string;

}

export interface PipelineCustomer {

  id: number;

  name: string;

  phone: string;

  email?: string;

  status: string;

  created_at?: string;

  tags?: PipelineTag[];

}