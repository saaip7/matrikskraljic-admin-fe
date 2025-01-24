import { ProjectForm } from "@/components/project-form"
import { ProjectTable } from "@/components/project-table"
import { env } from "../../config/env"
import type { Project } from "../../types"
import { Breadcrumb } from "@/components/breadcrumb"

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${env.BACKEND_URL}/api/projects`, { method: "GET" })
  if (!res.ok) throw new Error("Failed to fetch projects")
  return res.json()
}

export default async function Page() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto py-6 px-[5vw] space-y-8">
      <Breadcrumb items={[]} />
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage your projects and requisition lists</p>
      </div>
      <ProjectForm />
      <ProjectTable projects={projects} />
    </div>
  )
}

