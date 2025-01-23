export type Discipline = "Civil" | "Electrical" | "Piping" | "Instrument" | "Mechanical" | "Logistic"

export type ProjectRole =
  | "Civil Engineer"
  | "Electrical Engineer"
  | "Piping Engineer"
  | "Instrument Engineer"
  | "Mechanical Engineer"
  | "Logistic Engineer"

export type Project = {
  id: string
  projectCode: string
  projectName: string
  discipline: Discipline
  projectRole: ProjectRole
}

export type Requisition = {
  id: string
  projectId: string
  requisitionNo: string
  sowDesc: string
  discipline: Discipline
  procurement: "Procurement" | "Subcontracting"
}

