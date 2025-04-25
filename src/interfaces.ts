export type CustomNode = {
  id: string
  name: string
  description: string
  bg?: string
  numberOfCopies: number
  author_github?: string
  approved: boolean
}

export type CustomNodeCode = {
  code: string
  usage: string
  node_id: string
}