import { notFound } from "next/navigation"
import { env } from "../../../config/env"
import { RequisitionForm } from "@/components/requisition-form"
import { RequisitionTable } from "@/components/requisition-table"
import type { Project } from "../../../types/index"
import { Breadcrumb } from "@/components/breadcrumb"

async function getProject(projectid: number): Promise<Project> {
  const res = await fetch(`${env.BACKEND_URL}/api/projects/${projectid}`, { method: "GET" })
  if (!res.ok) notFound()
  return res.json()
}

export default async function RequisitionsPage({ params }: { params: { projectid: number } }) {
  const { projectid } = await params
  const project = await getProject(projectid)

  return (
    <div className="container mx-auto py-6 px-[5vw] space-y-8">
      <Breadcrumb
        items={[
          { label: "Projects", href: "/" },
          { label: project.projectname, href: `${project.projectid}` },
        ]}
      />
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Requisitions</h1>
        <p className="text-muted-foreground">Manage requisitions for <span className="font-bold">project </span> {project.projectname} <span className="font-bold">as </span> {project.projectrole}</p>
      </div>
      <RequisitionForm project={project} />
      <RequisitionTable project={project} />
    </div>
  )
}