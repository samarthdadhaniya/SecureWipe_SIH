"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import {
  CheckCircle,
  Download,
  FileText,
  QrCode,
  Shield,
  Clock,
  HardDrive,
  Copy,
  Check,
  Home,
  Award,
} from "lucide-react"
import Link from "next/link"

// Mock completion data
const completionData = {
  device: {
    name: "Primary System Drive",
    model: "ST3500312CS",
    capacity: "500 GB",
    serialNumber: "XXXXXXXXXXXXXXX",
  },
  wipe: {
    method: "PRNG Stream",
    startTime: "2023-11-01T20:48:21Z",
    endTime: "2023-11-02T03:15:45Z",
    duration: "06:27:24",
    passes: 1,
    bytesProcessed: "500,107,862,016",
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
    // Create a link to download the PDF from the public folder
    const link = document.createElement("a")
    link.href = "/report.pdf"
    link.download = `disk-erasure-report-${completionData.wipe.certificateId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container px-4 py-8 lg:py-12 ml-0 pt-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Secure Wipe Completed Successfully"
          description="Your device has been securely wiped according to industry standards. Download your compliance certificate below."
        />

        <Card className="mb-10 border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-xl">
          <CardContent className="flex items-center gap-8 pt-8 pb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 border-4 border-emerald-200 shadow-lg">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-emerald-800 mb-3">Data Permanently Erased</h3>
              <p className="text-lg text-emerald-700 leading-relaxed">
                All data has been securely wiped using industry-standard methods. Your compliance certificate is ready
                for download.
              </p>
            </div>
            <div className="text-right bg-white/60 rounded-xl p-4 border border-emerald-200">
              <p className="text-sm text-emerald-600 font-medium mb-1">Certificate ID</p>
              <code className="text-xl font-mono font-bold text-emerald-800">{completionData.wipe.certificateId}</code>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <HardDrive className="h-6 w-6 text-blue-600" />
                  </div>
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Device Name</span>
                    <p className="text-lg font-semibold text-slate-800">{completionData.device.name}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Model</span>
                    <p className="text-lg font-semibold text-slate-800">{completionData.device.model}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Capacity</span>
                    <p className="text-lg font-semibold text-slate-800">{completionData.device.capacity}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Serial Number</span>
                    <p className="font-mono text-base text-slate-800">{completionData.device.serialNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  Erasure Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Method</span>
                    <p className="text-lg font-semibold text-slate-800">{completionData.wipe.method}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Duration</span>
                    <p className="text-lg font-semibold text-slate-800">{completionData.wipe.duration}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Bytes Processed</span>
                    <p className="text-lg font-semibold text-slate-800">{completionData.wipe.bytesProcessed}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <p className="text-lg font-semibold text-emerald-600">ERASED</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  Compliance Standards
                </CardTitle>
                <CardDescription className="text-base">
                  This erasure operation meets the following industry standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {completionData.compliance.map((standard) => (
                    <Badge
                      key={standard}
                      variant="outline"
                      className="bg-green-50 border-green-200 text-green-700 px-4 py-2 text-sm font-medium"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      {standard}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <QrCode className="h-6 w-6 text-blue-600" />
                  Verification Code
                </CardTitle>
                <CardDescription className="text-base">
                  Use this code to verify the authenticity of this operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-blue-200">
                  <code className="flex-1 font-mono text-sm break-all text-slate-800">
                    {completionData.wipe.verificationCode}
                  </code>
                  <Button size="sm" variant="ghost" onClick={handleCopyCode} className="hover:bg-blue-100">
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-blue-600" />
                    )}
                  </Button>
                </div>

                {/* QR Code placeholder */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white rounded-xl border-2 border-dashed border-blue-300 flex items-center justify-center shadow-inner">
                    <QrCode className="h-16 w-16 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Download className="h-6 w-6 text-slate-700" />
                  Download Report
                </CardTitle>
                <CardDescription className="text-base">
                  Download your professional compliance certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full justify-start h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                  size="lg"
                >
                  <FileText className="mr-4 h-6 w-6" />
                  <div className="text-left">
                    <div className="text-lg font-semibold">Download PDF Report</div>
                    <div className="text-sm text-blue-100">Professional compliance certificate</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Certificate ID Card */}
            <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Certificate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm font-medium text-slate-500 mb-2">Certificate ID</p>
                  <code className="text-base font-mono font-bold text-slate-800">
                    {completionData.wipe.certificateId}
                  </code>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm font-medium text-slate-500 mb-2">Verification Code</p>
                  <code className="text-sm font-mono text-slate-700">{completionData.wipe.verificationCode}</code>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  These identifiers can be used for audit trails and compliance verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-16 pt-10 border-t border-slate-200">
          <Button
            asChild
            size="lg"
            className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Link href="/">
              <Home className="mr-3 h-5 w-5" />
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 h-14 border-2 hover:bg-slate-50 bg-transparent">
            <Link href="/devices">
              <HardDrive className="mr-3 h-5 w-5" />
              Wipe Another Device
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 h-14 border-2 hover:bg-slate-50 bg-transparent">
            <Link href="/history">
              <Clock className="mr-3 h-5 w-5" />
              View History
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
