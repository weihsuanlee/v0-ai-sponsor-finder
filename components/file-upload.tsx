"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import type { FileUploadResponse, ParsedMemberData } from "@/lib/types"

interface FileUploadProps {
  onDataParsed: (data: ParsedMemberData) => void
  onError?: (error: string) => void
  onClear?: () => void
}

export default function FileUpload({ onDataParsed, onError, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState<FileUploadResponse["preview"] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Reset states
    setError(null)
    setSuccess(false)
    setPreview(null)

    // Validate file type
    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith(".csv") && !fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      const errorMsg = "Please upload a CSV or Excel file (.csv, .xlsx, .xls)"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.`
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setUploadedFile(file)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-members", {
        method: "POST",
        body: formData,
      })

      const result: FileUploadResponse = await response.json()

      if (!result.success || !result.data) {
        const errorMsg = result.error || "Failed to parse file"
        setError(errorMsg)
        onError?.(errorMsg)
        if (result.preview) {
          setPreview(result.preview)
        }
        return
      }

      // Success!
      setSuccess(true)
      setPreview(result.preview || null)
      onDataParsed(result.data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred while uploading the file"
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    setError(null)
    setSuccess(false)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClear?.()
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!uploadedFile && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Upload member data file</p>
              <p className="text-xs text-muted-foreground">CSV or Excel (.csv, .xlsx, .xls)</p>
              <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded">
              <p>
                Your file should have columns like: <span className="font-medium">Age</span>,{" "}
                <span className="font-medium">Gender</span>, or <span className="font-medium">Date of Birth</span>
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <Button type="button" variant="outline" size="sm" onClick={handleChooseFile} className="bg-transparent">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <span className="text-xs text-muted-foreground">or drag and drop</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Uploaded File Card */}
      {uploadedFile && (
        <Card className={success ? "border-green-500" : error ? "border-red-500" : undefined}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded ${success ? "bg-green-100" : error ? "bg-red-100" : "bg-muted"}`}>
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : error ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                    {preview && ` • ${preview.rowCount} rows`}
                  </p>

                  {isUploading && <p className="text-xs text-muted-foreground mt-1">Processing file...</p>}

                  {success && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Successfully parsed member data
                    </p>
                  )}
                </div>
              </div>

              {!isUploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFile}
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <p className="text-sm font-medium">Upload Error</p>
            <p className="text-xs mt-1">{error}</p>
            {preview && preview.columnsDetected && (
              <div className="mt-2 text-xs">
                <p className="font-medium">Detected columns:</p>
                <p className="text-muted-foreground">{preview.columnsDetected.join(", ")}</p>
              </div>
            )}
          </div>
        </Alert>
      )}

      {/* Preview Info */}
      {success && preview && (
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded">
          <p>
            <span className="font-medium">Rows processed:</span> {preview.rowCount}
          </p>
          <p>
            <span className="font-medium">Columns detected:</span> {preview.columnsDetected.join(", ")}
          </p>
        </div>
      )}
    </div>
  )
}
