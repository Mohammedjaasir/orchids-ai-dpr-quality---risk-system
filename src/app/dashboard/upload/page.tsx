"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, FileText, X, Loader2, CheckCircle } from "lucide-react"

export default function UploadPage() {
  const [title, setTitle] = useState("")
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
      }
    }
  }, [])

  const validateFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document")
      return false
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB")
      return false
    }
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in to upload")
        router.push("/login")
        return
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("dprs")
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from("dprs")
        .getPublicUrl(fileName)

      const { data: dprData, error: dprError } = await supabase
        .from("dprs")
        .insert({
          title,
          project_name: projectName,
          description,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          uploaded_by: user.id,
          status: "pending",
        })
        .select()
        .single()

      if (dprError) {
        throw dprError
      }

      toast.success("DPR uploaded successfully! Starting AI analysis...")

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dprId: dprData.id }),
      })

      if (!response.ok) {
        console.error("Analysis failed but DPR was uploaded")
      }

      router.push(`/dashboard/dprs/${dprData.id}`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload DPR. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload DPR</h1>
          <p className="text-muted-foreground">
            Upload a Detailed Project Report for AI-powered quality assessment
          </p>
        </div>

        <Card className="gradient-card border-white/5">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">DPR Title</Label>
                <Input
                  id="title"
                  placeholder="Enter DPR title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-secondary/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="bg-secondary/50 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the project"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-secondary/50 border-white/10 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>DPR Document</Label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : file
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFile(null)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <p className="font-medium mb-1">
                        Drag and drop your DPR file here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse files
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PDF, DOCX (Max 50MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={uploading || !file || !title || !projectName}
                className="w-full h-12 gradient-accent hover:opacity-90 transition-opacity font-semibold"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading & Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Analyze DPR
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <h3 className="font-medium text-blue-400 mb-2">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-blue-400">
                1
              </span>
              AI extracts and analyzes text content from your DPR
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-blue-400">
                2
              </span>
              NLP identifies missing or weak sections
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-blue-400">
                3
              </span>
              ML predicts delay, cost, and implementation risks
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-blue-400">
                4
              </span>
              Quality score and recommendation generated
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
