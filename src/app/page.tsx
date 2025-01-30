import { ProjectForm } from "@/components/project-form"
import { ProjectTable } from "@/components/project-table"
import { env } from "../../config/env"
import type { Project } from "../../types"
import { Breadcrumb } from "@/components/breadcrumb"

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${env.BACKEND_URL}/api/projects`, { 
      method: "GET",
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    })
    
    if (!res.ok) {
      console.error(`Failed to fetch projects: ${res.status}`)
      return []
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
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