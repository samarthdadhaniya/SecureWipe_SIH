"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/page-header"
import {
  CheckCircle,
  Download,
  FileText,
  Code,
  QrCode,
  Shield,
  Clock,
  HardDrive,
  Copy,
  Check,
  Home,
} from "lucide-react"
import Link from "next/link"

// Mock completion data
const completionData = {
  device: {
    name: "Primary System Drive",
    model: "Samsung SSD 980 PRO",
    capacity: "1TB",
    serialNumber: "S6XNNU0R123456",
  },
  wipe: {
    method: "DoD 5220.22-M (3-pass)",
    startTime: "2024-01-15T10:30:00Z",
    endTime: "2024-01-15T13:45:00Z",
    duration: "3h 15m",
    passes: 3,
    bytesProcessed: "1,000,000,000,000",
    verificationCode: "WP-2024-0115-A7B9C2D4E6F8",
    certificateId: "CERT-SW-20240115-001",
  },
  compliance: ["NIST SP 800-88", "DoD 5220.22-M", "ISO 27001"],
}

export default function WipeCompletePage() {
  const params = useParams()
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(completionData.wipe.verificationCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF report
    console.log("Downloading PDF report...")
  }

  const handleDownloadJSON = () => {
    // In a real app, this would generate and download a JSON report
    const jsonData = {
      certificate: completionData,
      timestamp: new Date().toISOString(),
      signature: "SHA256:a1b2c3d4e5f6...",
    }
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wipe-report-${completionData.wipe.certificateId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <PageHeader
            title="Wipe Completed Successfully"
            description="Your device has been securely wiped. Download your compliance certificate and verification report."
          />

          {/* Success Banner */}
          <Card className="mb-6 border-2 border-success/20 bg-success/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success">Secure Wipe Completed</h3>
                <p className="text-sm text-muted-foreground">
                  All data has been permanently erased and verified according to industry standards.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Device & Wipe Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Device Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device Name</span>
                    <span className="font-medium">{completionData.device.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium">{completionData.device.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{completionData.device.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serial Number</span>
                    <span className="font-mono text-sm">{completionData.device.serialNumber}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Wipe Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="font-medium">{completionData.wipe.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passes</span>
                    <span className="font-medium">{completionData.wipe.passes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{completionData.wipe.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Processed</span>
                    <span className="font-medium">{completionData.wipe.bytesProcessed} bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Time</span>
                    <span className="font-mono text-sm">
                      {new Date(completionData.wipe.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Time</span>
                    <span className="font-mono text-sm">{new Date(completionData.wipe.endTime).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Compliance Standards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {completionData.compliance.map((standard) => (
                      <Badge key={standard} variant="outline" className="bg-success/10 border-success/20">
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certificate & Downloads */}
            <div className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Verification Code
                  </CardTitle>
                  <CardDescription>Use this code to verify the authenticity of this wipe operation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                    <code className="flex-1 font-mono text-sm">{completionData.wipe.verificationCode}</code>
                    <Button size="sm" variant="ghost" onClick={handleCopyCode}>
                      {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* QR Code placeholder */}
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-muted/50 rounded-lg border-2 border-dashed flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Reports
                  </CardTitle>
                  <CardDescription>Download detailed compliance reports in multiple formats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleDownloadPDF} className="w-full justify-start bg-transparent" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </Button>
                  <Button
                    onClick={handleDownloadJSON}
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Download JSON Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Certificate ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm font-mono">{completionData.wipe.certificateId}</code>
                  <p className="text-xs text-muted-foreground mt-2">
                    This certificate ID can be used for audit trails and compliance verification.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
            <Button asChild size="lg" className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
              <Link href="/devices">
                <HardDrive className="mr-2 h-4 w-4" />
                Wipe Another Device
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
              <Link href="/history">
                <Clock className="mr-2 h-4 w-4" />
                View History
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
