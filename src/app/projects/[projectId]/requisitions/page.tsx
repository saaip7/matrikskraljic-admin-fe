import { notFound } from "next/navigation"
import { env } from "@/config/env"
import { RequisitionForm } from "@/components/requisition-form"
import { RequisitionTable } from "@/components/requisition-table"
import type { Project } from "@/types"

async function getProject(projectId: string): Promise<Project> {
  const res = await fetch(`${env.BACKEND_URL}/projects/${projectId}`)
  if (!res.ok) notFound()
  return res.json()
}

export default async function RequisitionsPage({ params }: { params: { projectId: string } }) {
  const project = await getProject(params.projectId)

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Requisitions</h1>
        <p className="text-muted-foreground">Manage requisitions for project: {project.projectName}</p>
      </div>
      <RequisitionForm project={project} />
      <RequisitionTable projectId={project.id} />
    </div>
  )
}

