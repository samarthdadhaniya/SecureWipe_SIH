"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/page-header"
import { HardDrive, Usb, ScanLine, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Device {
  id: string
  name: string
  model: string
  type: "HDD" | "SSD" | "USB" | "SD"
  capacity: string
  serialNumber: string
  status: "connected" | "scanning" | "ready" | "error"
  interface: string
  health: "good" | "warning" | "critical"
}

// Mock device data - in a real app this would come from device detection API
const mockDevices: Device[] = [
  {
    id: "dev-001",
    name: "Primary System Drive",
    model: "Samsung SSD 980 PRO",
    type: "SSD",
    capacity: "1TB",
    serialNumber: "S6XNNU0R123456",
    status: "ready",
    interface: "NVMe PCIe 4.0",
    health: "good",
  },
  {
    id: "dev-002",
    name: "External Backup Drive",
    model: "WD My Passport",
    type: "HDD",
    capacity: "2TB",
    serialNumber: "WX12A8123456",
    status: "ready",
    interface: "USB 3.0",
    health: "good",
  },
  {
    id: "dev-003",
    name: "USB Flash Drive",
    model: "SanDisk Ultra",
    type: "USB",
    capacity: "64GB",
    serialNumber: "AA010123456789",
    status: "ready",
    interface: "USB 3.1",
    health: "warning",
  },
]

function DeviceIcon({ type }: { type: Device["type"] }) {
  switch (type) {
    case "SSD":
    case "HDD":
      return <HardDrive className="h-5 w-5" />
    case "USB":
    case "SD":
      return <Usb className="h-5 w-5" />
    default:
      return <HardDrive className="h-5 w-5" />
  }
}

function HealthBadge({ health }: { health: Device["health"] }) {
  const variants = {
    good: "bg-success/10 text-success-foreground border-success/20",
    warning: "bg-warning/10 text-warning-foreground border-warning/20",
    critical: "bg-destructive/10 text-destructive-foreground border-destructive/20",
  }

  const icons = {
    good: <CheckCircle className="h-3 w-3" />,
    warning: <AlertTriangle className="h-3 w-3" />,
    critical: <AlertTriangle className="h-3 w-3" />,
  }

  return (
    <Badge variant="outline" className={variants[health]}>
      {icons[health]}
      {health.charAt(0).toUpperCase() + health.slice(1)}
    </Badge>
  )
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isScanning, setIsScanning] = useState(true)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  useEffect(() => {
    // Simulate device scanning
    const timer = setTimeout(() => {
      setDevices(mockDevices)
      setIsScanning(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleRescan = () => {
    setIsScanning(true)
    setSelectedDevice(null)
    setTimeout(() => {
      setDevices(mockDevices)
      setIsScanning(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <PageHeader
            title="Device Detection"
            description="Select a storage device to begin the secure wiping process. All connected devices are automatically scanned and verified."
          >
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={handleRescan} variant="outline" disabled={isScanning}>
                <ScanLine className={`mr-2 h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
                {isScanning ? "Scanning..." : "Rescan Devices"}
              </Button>
            </div>
          </PageHeader>

          {isScanning ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ScanLine className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold mb-2">Scanning for devices...</h3>
                <p className="text-muted-foreground text-center">
                  Please wait while we detect all connected storage devices.
                </p>
              </CardContent>
            </Card>
          ) : devices.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-warning mb-4" />
                <h3 className="text-lg font-semibold mb-2">No devices detected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Please connect a storage device and try scanning again.
                </p>
                <Button onClick={handleRescan} variant="outline">
                  <ScanLine className="mr-2 h-4 w-4" />
                  Rescan Devices
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Connected Devices ({devices.length})</h2>
                {selectedDevice && (
                  <Button asChild>
                    <Link href={`/wipe/${selectedDevice}`}>
                      Continue to Wipe Options
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                {devices.map((device) => (
                  <Card
                    key={device.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDevice === device.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-2 hover:border-primary/20"
                    }`}
                    onClick={() => setSelectedDevice(device.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <DeviceIcon type={device.type} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{device.name}</CardTitle>
                            <CardDescription className="text-sm">{device.model}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{device.type}</Badge>
                          <HealthBadge health={device.health} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Capacity</p>
                          <p className="font-medium">{device.capacity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Interface</p>
                          <p className="font-medium">{device.interface}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Serial Number</p>
                          <p className="font-mono text-xs">{device.serialNumber}</p>
                        </div>
                      </div>
                      {selectedDevice === device.id && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-sm font-medium text-primary">
                            <CheckCircle className="inline h-4 w-4 mr-1" />
                            Device selected for secure wiping
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!selectedDevice && (
                <Card className="border-2 border-dashed bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground text-center">
                      Select a device above to continue with the secure wiping process.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
