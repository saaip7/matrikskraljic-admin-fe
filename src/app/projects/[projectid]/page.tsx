import { notFound } from "next/navigation";
import { env } from "../../../../config/env";
import { RequisitionForm } from "@/components/requisition-form";
import { RequisitionTable } from "@/components/requisition-table";
import type { Project } from "../../../../types/index";
import { Breadcrumb } from "@/components/breadcrumb";

interface RequisitionsPageProps {
  params: Promise<{ projectid: string }>; // ✅ params adalah Promise
}

export default async function RequisitionsPage({ params }: RequisitionsPageProps) {
  const { projectid } = await params; 
  
  const projectIdNumber = Number(projectid);
  if (isNaN(projectIdNumber)) notFound();

  const res = await fetch(`${env.BACKEND_URL}/api/projects/${projectIdNumber}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const project: Project = await res.json();

  return (
    <div className="container mx-auto py-6 px-[5vw] space-y-8">
      <Breadcrumb
        items={[
          { label: "Projects", href: "/" },
          { label: project.projectname, href: `/projects/${project.projectid}` },
        ]}
      />
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Requisitions</h1>
        <p className="text-muted-foreground">
          Manage requisitions for <span className="font-bold">project </span> {project.projectname}{" "}
          <span className="font-bold">as </span> {project.projectrole}
        </p>
      </div>
      <RequisitionForm project={project} />
      <RequisitionTable project={project} />
    </div>
  );
}