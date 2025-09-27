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