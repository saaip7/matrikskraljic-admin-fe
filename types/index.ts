export type Discipline = "Civil" | "Electrical" | "Piping" | "Instrument" | "Mechanical" | "Logistic"

export type ProjectRole =
  | "Civil Engineer"
  | "Electrical Engineer"
  | "Piping Engineer"
  | "Instrument Engineer"
  | "Mechanical Engineer"
  | "Logistic Engineer"

export type Project = {
  projectid: number
  projectcode: string
  projectname: string
  discipline: Discipline
  projectrole: ProjectRole
}

export type Requisition = {
  taskid: number
  projectid: number
  requisitionno: string
  sowdesc: string
  discipline: Discipline
  procurement: "Procurement" | "Subcontracting"
}

