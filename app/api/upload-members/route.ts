import { type NextRequest, NextResponse } from "next/server"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { parseMemberData, detectColumns } from "@/lib/member-data-parser"
import type { FileUploadResponse, MemberDataRow } from "@/lib/types"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain", // Sometimes CSV files are sent as text/plain
]

const ALLOWED_EXTENSIONS = [".csv", ".xlsx", ".xls"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json<FileUploadResponse>(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<FileUploadResponse>(
        {
          success: false,
          error: `File size exceeds maximum limit of 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 400 }
      )
    }

    // Validate file type
    const fileName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext))

    if (!hasValidExtension && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json<FileUploadResponse>(
        {
          success: false,
          error: `Invalid file type. Please upload a CSV or Excel file (.csv, .xlsx, .xls). Received: ${file.type}`,
        },
        { status: 400 }
      )
    }

    // Read file content
    const buffer = await file.arrayBuffer()
    let rows: MemberDataRow[] = []

    // Parse based on file type
    if (fileName.endsWith(".csv") || file.type === "text/csv" || file.type === "text/plain") {
      // Parse CSV
      const text = new TextDecoder().decode(buffer)

      const parseResult = Papa.parse<MemberDataRow>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        dynamicTyping: true, // Automatically convert numbers
      })

      if (parseResult.errors.length > 0) {
        console.error("[Upload] CSV parsing errors:", parseResult.errors)
        return NextResponse.json<FileUploadResponse>(
          {
            success: false,
            error: `Failed to parse CSV file: ${parseResult.errors[0]?.message || "Unknown error"}`,
          },
          { status: 400 }
        )
      }

      rows = parseResult.data
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      // Parse Excel
      try {
        const workbook = XLSX.read(buffer, { type: "array" })

        // Get first sheet
        const sheetName = workbook.SheetNames[0]
        if (!sheetName) {
          return NextResponse.json<FileUploadResponse>(
            {
              success: false,
              error: "Excel file has no sheets",
            },
            { status: 400 }
          )
        }

        const worksheet = workbook.Sheets[sheetName]
        rows = XLSX.utils.sheet_to_json<MemberDataRow>(worksheet, {
          defval: null,
          raw: false,
        })
      } catch (error) {
        console.error("[Upload] Excel parsing error:", error)
        return NextResponse.json<FileUploadResponse>(
          {
            success: false,
            error: `Failed to parse Excel file: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json<FileUploadResponse>(
        {
          success: false,
          error: "Unsupported file format",
        },
        { status: 400 }
      )
    }

    // Validate that we have data
    if (!rows || rows.length === 0) {
      return NextResponse.json<FileUploadResponse>(
        {
          success: false,
          error: "File is empty or contains no valid data",
        },
        { status: 400 }
      )
    }

    // Detect columns
    const columnsDetected = detectColumns(rows)

    // Validate that we have at least some demographic data
    const hasAgeColumn = columnsDetected.some((col) =>
      /age|dob|dateofbirth|birthdate/i.test(col.replace(/[_\s-]/g, ""))
    )

    if (!hasAgeColumn) {
      return NextResponse.json<FileUploadResponse>(
        {
          success: false,
          error:
            'Could not find age or date of birth column. Please ensure your file has a column named "age", "Age", "date_of_birth", "DOB", or similar.',
          preview: {
            rowCount: rows.length,
            sampleRows: rows.slice(0, 3),
            columnsDetected,
          },
        },
        { status: 400 }
      )
    }

    // Parse member data
    const parsedData = parseMemberData(rows)

    console.log("[Upload] Successfully parsed member data:", {
      totalMembers: parsedData.totalMembers,
      dominantAgeGroup: parsedData.dominantAgeGroup,
      dominantGender: parsedData.dominantGender,
    })

    // Return success with parsed data
    return NextResponse.json<FileUploadResponse>({
      success: true,
      data: parsedData,
      preview: {
        rowCount: rows.length,
        sampleRows: rows.slice(0, 5), // Show first 5 rows as preview
        columnsDetected,
      },
    })
  } catch (error) {
    console.error("[Upload] Unexpected error:", error)
    return NextResponse.json<FileUploadResponse>(
      {
        success: false,
        error: `Failed to process file: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    )
  }
}
