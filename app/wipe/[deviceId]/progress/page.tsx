"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PageHeader } from "@/components/page-header"
import { HardDrive, Clock, Activity, CheckCircle, AlertTriangle, Pause, Play, Square } from "lucide-react"

interface LogEntry {
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  message: string
}

interface WipeProgress {
  phase: "initializing" | "wiping" | "verifying" | "completed" | "error"
  currentPass: number
  totalPasses: number
  overallProgress: number
  phaseProgress: number
  startTime: Date
  elapsedTime: number
  estimatedTimeLeft: number
  bytesProcessed: number
  totalBytes: number
  currentSpeed: number
}

// Mock device data
const mockDevice = {
  id: "dev-001",
  name: "Primary System Drive",
  model: "Samsung SSD 980 PRO",
  type: "SSD" as const,
  capacity: "1TB",
  serialNumber: "S6XNNU0R123456",
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

const formatBytes = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export default function WipeProgressPage() {
  const params = useParams()
  const router = useRouter()
  const [progress, setProgress] = useState<WipeProgress>({
    phase: "initializing",
    currentPass: 0,
    totalPasses: 3,
    overallProgress: 0,
    phaseProgress: 0,
    startTime: new Date(),
    elapsedTime: 0,
    estimatedTimeLeft: Math.floor(Math.random() * 50) + 10, // 10-60 seconds
    bytesProcessed: 0,
    totalBytes: 1000000000000, // 1TB
    currentSpeed: 0,
  })

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Initializing secure wipe process...",
    },
  ])

  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && progress.phase !== "completed" && progress.phase !== "error") {
        setProgress((prev) => {
          const newElapsedTime = prev.elapsedTime + 1
          let newProgress = { ...prev, elapsedTime: newElapsedTime }

          // Simulate progress
          if (prev.phase === "initializing" && prev.elapsedTime > Math.floor(Math.random() * 6) + 2) {
            newProgress = {
              ...newProgress,
              phase: "wiping",
              currentPass: 1,
              phaseProgress: 0,
            }
            setLogs((prevLogs) => [
              ...prevLogs,
              {
                timestamp: new Date().toISOString(),
                level: "info",
                message: "Starting pass 1 of 3 - DoD 5220.22-M pattern",
              },
            ])
          } else if (prev.phase === "wiping") {
            const progressIncrement = 12 // Much faster progress to complete within 1 minute
            const newPhaseProgress = Math.min(prev.phaseProgress + progressIncrement, 100)
            const newOverallProgress = ((prev.currentPass - 1) * 100 + newPhaseProgress) / prev.totalPasses

            newProgress = {
              ...newProgress,
              phaseProgress: newPhaseProgress,
              overallProgress: newOverallProgress,
              bytesProcessed: (newOverallProgress / 100) * prev.totalBytes,
              currentSpeed: 50000000 + Math.random() * 20000000, // 50-70 MB/s
              estimatedTimeLeft: Math.max(0, prev.estimatedTimeLeft - 1),
            }

            // Move to next pass
            if (newPhaseProgress >= 100 && prev.currentPass < prev.totalPasses) {
              newProgress = {
                ...newProgress,
                currentPass: prev.currentPass + 1,
                phaseProgress: 0,
              }
              setLogs((prevLogs) => [
                ...prevLogs,
                {
                  timestamp: new Date().toISOString(),
                  level: "success",
                  message: `Pass ${prev.currentPass} completed successfully`,
                },
                {
                  timestamp: new Date().toISOString(),
                  level: "info",
                  message: `Starting pass ${prev.currentPass + 1} of ${prev.totalPasses}`,
                },
              ])
            }

            // Move to verification
            if (newPhaseProgress >= 100 && prev.currentPass >= prev.totalPasses) {
              newProgress = {
                ...newProgress,
                phase: "verifying",
                phaseProgress: 0,
              }
              setLogs((prevLogs) => [
                ...prevLogs,
                {
                  timestamp: new Date().toISOString(),
                  level: "success",
                  message: "All wipe passes completed successfully",
                },
                {
                  timestamp: new Date().toISOString(),
                  level: "info",
                  message: "Starting verification process...",
                },
              ])
            }
          } else if (prev.phase === "verifying") {
            const newPhaseProgress = Math.min(prev.phaseProgress + 15, 100)
            newProgress = {
              ...newProgress,
              phaseProgress: newPhaseProgress,
              overallProgress: 95 + (newPhaseProgress / 100) * 5,
            }

            if (newPhaseProgress >= 100) {
              newProgress = {
                ...newProgress,
                phase: "completed",
                overallProgress: 100,
                phaseProgress: 100,
              }
              setLogs((prevLogs) => [
                ...prevLogs,
                {
                  timestamp: new Date().toISOString(),
                  level: "success",
                  message: "Verification completed successfully",
                },
                {
                  timestamp: new Date().toISOString(),
                  level: "success",
                  message: "Secure wipe process completed successfully!",
                },
              ])
            }
          }

          return newProgress
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, progress.phase])

  const handlePause = () => {
    setIsPaused(!isPaused)
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        level: "warning",
        message: isPaused ? "Wipe process resumed" : "Wipe process paused",
      },
    ])
  }

  const handleStop = () => {
    setProgress((prev) => ({ ...prev, phase: "error" }))
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Wipe process stopped by user",
      },
    ])
  }

  const handleComplete = () => {
    const scanData = {
      id: `scan-${Date.now()}`,
      deviceName: mockDevice.name,
      deviceModel: mockDevice.model,
      deviceType: mockDevice.type,
      capacity: mockDevice.capacity,
      serialNumber: mockDevice.serialNumber,
      method: "DoD 5220.22-M (3-pass)",
      status: "completed" as const,
      startTime: progress.startTime.toISOString(),
      endTime: new Date().toISOString(),
      duration: formatTime(progress.elapsedTime),
      certificateId: `CERT-${Date.now().toString(36).toUpperCase()}`,
      verificationCode: `VER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      compliance: ["DoD 5220.22-M", "NIST SP 800-88", "ISO 27001"],
    }

    const existingHistory = JSON.parse(localStorage.getItem("wipeHistory") || "[]")
    existingHistory.unshift(scanData)
    localStorage.setItem("wipeHistory", JSON.stringify(existingHistory))

    router.push(`/wipe/${params.deviceId}/complete`)
  }

  const getPhaseDescription = () => {
    switch (progress.phase) {
      case "initializing":
        return "Preparing device for secure wiping..."
      case "wiping":
        return `Pass ${progress.currentPass} of ${progress.totalPasses} - Overwriting data`
      case "verifying":
        return "Verifying wipe completion..."
      case "completed":
        return "Secure wipe completed successfully"
      case "error":
        return "Wipe process encountered an error"
      default:
        return "Processing..."
    }
  }

  const getLogIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <Activity className="h-4 w-4 text-primary" />
    }
  }

  return (
    <div className="min-h-screen w-full max-w-none ml-0">
      <div className="container px-4 py-8 lg:py-12 max-w-7xl mx-auto">
        <PageHeader
          title="Secure Wipe in Progress"
          description="Monitor the real-time progress of your secure data wiping operation."
        />

        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200">
                <HardDrive className="h-7 w-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl text-slate-800">{mockDevice.name}</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  {mockDevice.model} • {mockDevice.capacity} • S/N: {mockDevice.serialNumber}
                </CardDescription>
              </div>
              <Badge
                variant={
                  progress.phase === "completed" ? "default" : progress.phase === "error" ? "destructive" : "secondary"
                }
                className="text-sm px-4 py-2"
              >
                {progress.phase === "completed" && <CheckCircle className="mr-2 h-4 w-4" />}
                {progress.phase === "error" && <AlertTriangle className="mr-2 h-4 w-4" />}
                {progress.phase.charAt(0).toUpperCase() + progress.phase.slice(1)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Progress Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  Overall Progress
                </CardTitle>
                <CardDescription className="text-base text-slate-600">{getPhaseDescription()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">Progress</span>
                    <span className="font-mono text-2xl font-bold text-slate-800">
                      {progress.overallProgress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={progress.overallProgress} className="h-6" />
                </div>

                {progress.phase === "wiping" && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        Current Pass ({progress.currentPass}/{progress.totalPasses})
                      </span>
                      <span className="font-mono text-lg text-slate-800">{progress.phaseProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress.phaseProgress} className="h-3" />
                  </div>
                )}

                {progress.phase === "verifying" && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">Verification</span>
                      <span className="font-mono text-lg text-slate-800">{progress.phaseProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress.phaseProgress} className="h-3" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Elapsed Time</p>
                    <p className="font-mono text-2xl font-bold">{formatTime(progress.elapsedTime)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Time Remaining</p>
                    <p className="font-mono text-2xl font-bold">{formatTime(progress.estimatedTimeLeft)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data Processed</p>
                    <p className="font-mono text-lg">{formatBytes(progress.bytesProcessed)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Speed</p>
                    <p className="font-mono text-lg">{formatBytes(progress.currentSpeed)}/s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            {progress.phase !== "completed" && progress.phase !== "error" && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button onClick={handlePause} variant="outline" className="flex-1 bg-transparent">
                      {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button onClick={handleStop} variant="destructive" className="flex-1">
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completion Actions */}
            {progress.phase === "completed" && (
              <Card className="border-2 border-emerald-200 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-emerald-800">
                    <CheckCircle className="h-6 w-6" />
                    Wipe Completed Successfully
                  </CardTitle>
                  <CardDescription className="text-base text-emerald-700">
                    Your device has been securely wiped and is ready for disposal or reuse.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleComplete}
                    className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    size="lg"
                  >
                    View Certificate & Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-slate-800">Live Logs</CardTitle>
              <CardDescription className="text-base">Real-time activity log of the wiping process</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full">
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-sm p-3 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <span className="text-xs text-slate-500 font-mono mt-0.5 min-w-[60px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {getLogIcon(log.level)}
                      <span className="flex-1 leading-relaxed text-slate-700">{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
