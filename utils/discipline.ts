import type { Discipline, ProjectRole } from "@/types"

export const disciplines: Discipline[] = ["Civil", "Electrical", "Piping", "Instrument", "Mechanical", "Logistic"]

export function getDisciplineRole(discipline: Discipline): ProjectRole {
  const roleMap: Record<Discipline, ProjectRole> = {
    Civil: "Civil Engineer",
    Electrical: "Electrical Engineer",
    Piping: "Piping Engineer",
    Instrument: "Instrument Engineer",
    Mechanical: "Mechanical Engineer",
    Logistic: "Logistic Engineer",
  }
  return roleMap[discipline]
}

