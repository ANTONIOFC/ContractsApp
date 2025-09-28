export type Contract = {
  id: number
  title: string
  value: number
  status: string
  due_date: string
  category: string
  supplier: string
  user: string
}

export type EditableContract = {
  title: string
  value: number
  status: string
  due_date: string
  category: string
  supplier: string
}

export class ContractParams {
  value_1?:number;
  value_2?:number;
  date_1?:string;
  date_2?:string;
  status?: string;
  category?:string;
  supplier?:string;
  pageNumber = 1;
  pageSize = 10;
}