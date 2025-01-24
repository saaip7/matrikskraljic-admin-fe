"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { env } from "../../config/env"
import type { Requisition } from "../../types"
import type { Project } from "../../types/index"

export function RequisitionTable({ project }: { project: Project }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [requisitionToDelete, setRequisitionToDelete] = useState<Requisition | null>(null)
  const [requisitions, setRequisitions] = useState<Requisition[]>([])

  useEffect(() => {
    async function fetchRequisitions() {
      try {
        const response = await fetch(`${env.BACKEND_URL}/api/task/${project.projectid}`)
        if (!response.ok) throw new Error("Failed to fetch requisitions")
        const data = await response.json()
        setRequisitions(data)
      } catch (error) {
        console.error("Error fetching requisitions:", error)
      }
    }

    fetchRequisitions()
  }, [project.projectid])

  async function deleteRequisition(requisition: Requisition) {
    try {
      setIsDeleting(true)
      const response = await fetch(`${env.BACKEND_URL}/requisitions/${requisition.projectid}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete requisition")

      setRequisitions((prev) => prev.filter((r) => r.taskid !== requisition.taskid))
      router.refresh()
    } catch (error) {
      console.error("Error deleting requisition:", error)
    } finally {
      setIsDeleting(false)
      setRequisitionToDelete(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requisition No</TableHead>
              <TableHead>SOW Description</TableHead>
              <TableHead>Discipline</TableHead>
              <TableHead>Procurement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No requisitions found. Create your first requisition above.
                </TableCell>
              </TableRow>
            ) : (
              requisitions.map((requisition) => (
                <TableRow key={requisition.taskid}>
                  <TableCell>{requisition.requisitionno}</TableCell>
                  <TableCell>{requisition.sowdesc}</TableCell>
                  <TableCell>{requisition.discipline}</TableCell>
                  <TableCell>{requisition.procurement}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      onClick={() => setRequisitionToDelete(requisition)}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!requisitionToDelete} onOpenChange={() => setRequisitionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the requisition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => requisitionToDelete && deleteRequisition(requisitionToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}