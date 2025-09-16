"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navigation } from "@/components/navigation"
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
    estimatedTimeLeft: 7200, // 2 hours
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
          if (prev.phase === "initializing" && prev.elapsedTime > 5) {
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
            const progressIncrement = 0.5 // Adjust speed as needed
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
            const newPhaseProgress = Math.min(prev.phaseProgress + 2, 100)
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <PageHeader
            title="Secure Wipe in Progress"
            description="Monitor the real-time progress of your secure data wiping operation."
          />

          {/* Device Info */}
          <Card className="mb-6 border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <HardDrive className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{mockDevice.name}</CardTitle>
                  <CardDescription>
                    {mockDevice.model} • {mockDevice.capacity}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    progress.phase === "completed"
                      ? "default"
                      : progress.phase === "error"
                        ? "destructive"
                        : "secondary"
                  }
                  className="ml-auto"
                >
                  {progress.phase === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                  {progress.phase === "error" && <AlertTriangle className="mr-1 h-3 w-3" />}
                  {progress.phase.charAt(0).toUpperCase() + progress.phase.slice(1)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Progress Section */}
            <div className="space-y-6">
              {/* Overall Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Overall Progress
                  </CardTitle>
                  <CardDescription>{getPhaseDescription()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-mono">{progress.overallProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress.overallProgress} className="h-3" />
                  </div>

                  {progress.phase === "wiping" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Current Pass ({progress.currentPass}/{progress.totalPasses})
                        </span>
                        <span className="font-mono">{progress.phaseProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress.phaseProgress} className="h-2" />
                    </div>
                  )}

                  {progress.phase === "verifying" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Verification</span>
                        <span className="font-mono">{progress.phaseProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress.phaseProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Elapsed Time</p>
                      <p className="font-mono text-lg">{formatTime(progress.elapsedTime)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time Remaining</p>
                      <p className="font-mono text-lg">{formatTime(progress.estimatedTimeLeft)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data Processed</p>
                      <p className="font-mono">{formatBytes(progress.bytesProcessed)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Speed</p>
                      <p className="font-mono">{formatBytes(progress.currentSpeed)}/s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              {progress.phase !== "completed" && progress.phase !== "error" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
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
                <Card className="border-2 border-success/20 bg-success/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      Wipe Completed Successfully
                    </CardTitle>
                    <CardDescription>
                      Your device has been securely wiped and is ready for disposal or reuse.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleComplete} className="w-full" size="lg">
                      View Certificate & Report
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Live Logs */}
            <Card className="lg:row-span-3">
              <CardHeader>
                <CardTitle>Live Logs</CardTitle>
                <CardDescription>Real-time activity log of the wiping process</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-xs text-muted-foreground font-mono mt-0.5">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {getLogIcon(log.level)}
                        <span className="flex-1">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
