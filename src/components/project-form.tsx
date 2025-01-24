"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { disciplines, getDisciplineRole } from "../../utils/discipline"
import { env } from "../../config/env"

const formSchema = z.object({
  projectcode: z.string().min(1, "Project code is required"),
  projectname: z.string().min(1, "Project name is required"),
  discipline: z.enum(["Civil", "Electrical", "Piping", "Instrument", "Mechanical", "Logistic"]),
  projectrole: z.string(),
})

export function ProjectForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectcode: "",
      projectname: "",
      discipline: "Civil",
      projectrole: "Civil Engineer",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(`${env.BACKEND_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectrole: getDisciplineRole(values.discipline),
        }),
      })

      console.log("Request body:", JSON.stringify({
        ...values,
      }))

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create project")
      }
      toast({
        title: "Success",
        description: "Project created successfully",
      })


      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: (error instanceof Error ? error.message : "Failed to create project. Please try again."),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discipline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {disciplines.map((discipline) => (
                          <SelectItem key={discipline} value={discipline}>
                            {discipline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectrole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Role</FormLabel>
                    <FormControl>
                      <Input {...field} value={getDisciplineRole(form.watch("discipline"))} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

