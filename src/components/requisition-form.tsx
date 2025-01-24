"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { env } from "../../config/env"
import type { Project } from "../../types"

const formSchema = z.object({
  requisitionNo: z.string().min(1, "Requisition number is required"),
  sowDesc: z.string().min(1, "SOW description is required"),
  procurement: z.enum(["Procurement", "Subcontracting"]),
  discipline: z.string(),
})

export function RequisitionForm({ project }: { project: Project }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requisitionNo: "",
      sowDesc: "",
      procurement: "Procurement",
      discipline: project.discipline,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(`${env.BACKEND_URL}/requisitions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectId: project.projectid,
        }),
      })

      if (!response.ok) throw new Error("Failed to create requisition")

      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Error creating requisition:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Requisition</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requisitionNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisition Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter requisition number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sowDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SOW Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SOW description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discipline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discipline</FormLabel>
                    <FormControl>
                      <Input {...field} value={project.discipline} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="procurement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procurement Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                        <SelectItem value="Subcontracting">Subcontracting</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Requisition"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

