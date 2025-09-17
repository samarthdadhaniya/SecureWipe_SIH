"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { CheckCircle, Search, Filter, Calendar, HardDrive, FileText, Code, AlertTriangle } from "lucide-react"

interface WipeRecord {
  id: string
  deviceName: string
  deviceModel: string
  deviceType: "HDD" | "SSD" | "USB" | "SD"
  capacity: string
  serialNumber: string
  method: string
  status: "completed" | "failed" | "cancelled"
  startTime: string
  endTime: string
  duration: string
  certificateId: string
  verificationCode: string
  compliance: string[]
}

function StatusBadge({ status }: { status: WipeRecord["status"] }) {
  const variants = {
    completed: "bg-success/10 text-success-foreground border-success/20",
    failed: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    cancelled: "bg-warning/10 text-warning-foreground border-warning/20",
  }

  const icons = {
    completed: <CheckCircle className="h-3 w-3" />,
    failed: <AlertTriangle className="h-3 w-3" />,
    cancelled: <AlertTriangle className="h-3 w-3" />,
  }

  return (
    <Badge variant="outline" className={variants[status]}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function DeviceIcon({ type }: { type: WipeRecord["deviceType"] }) {
  return <HardDrive className="h-4 w-4" />
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [wipeHistory, setWipeHistory] = useState<WipeRecord[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem("wipeHistory")
    if (savedHistory) {
      setWipeHistory(JSON.parse(savedHistory))
    }
  }, [])

  const filteredHistory = wipeHistory.filter((record) => {
    const matchesSearch =
      record.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.deviceType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleDownloadPDF = (record: WipeRecord) => {
    const link = document.createElement("a")
    link.href = "/reports/disk-erasure-report.pdf"
    link.download = `wipe-report-${record.certificateId}.pdf`
    link.click()
  }

  const handleDownloadJSON = (record: WipeRecord) => {
    const jsonData = {
      certificate: record,
      timestamp: new Date().toISOString(),
      signature: "SHA256:a1b2c3d4e5f6...",
    }
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wipe-report-${record.certificateId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen w-full max-w-none ml-0">
      <div className="container px-4 py-8 lg:py-12 max-w-6xl mx-auto">
        <PageHeader
          title="Wipe History"
          description="View and manage your complete secure data wiping history with downloadable compliance certificates."
        />

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by device name, model, or serial number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SSD">SSD</SelectItem>
                  <SelectItem value="HDD">HDD</SelectItem>
                  <SelectItem value="USB">USB</SelectItem>
                  <SelectItem value="SD">SD Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredHistory.length} of {wipeHistory.length} wipe operations
          </p>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No wipe operations found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You haven't performed any secure wipe operations yet. Start your first secure wipe to see records here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((record) => (
              <Card key={record.id} className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DeviceIcon type={record.deviceType} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{record.deviceName}</CardTitle>
                        <CardDescription>
                          {record.deviceModel} • {record.capacity}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{record.deviceType}</Badge>
                      <StatusBadge status={record.status} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Method</p>
                      <p className="font-medium">{record.method}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{record.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Time</p>
                      <p className="font-mono text-xs">{new Date(record.startTime).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Serial Number</p>
                      <p className="font-mono text-xs">{record.serialNumber}</p>
                    </div>
                  </div>

                  {record.status === "completed" && (
                    <>
                      <div className="flex flex-wrap gap-1">
                        {record.compliance.map((standard) => (
                          <Badge key={standard} variant="outline" className="text-xs bg-success/10 border-success/20">
                            {standard}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Certificate ID</p>
                          <code className="text-xs font-mono">{record.certificateId}</code>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(record)}>
                            <FileText className="mr-1 h-3 w-3" />
                            PDF
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadJSON(record)}>
                            <Code className="mr-1 h-3 w-3" />
                            JSON
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {record.status === "failed" && (
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="text-sm text-destructive font-medium">
                        <AlertTriangle className="inline h-4 w-4 mr-1" />
                        Wipe operation failed
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The device may have been disconnected or encountered a hardware error.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
