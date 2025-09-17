"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    const scanTime = Math.random() * (5000 - 2000) + 2000; // 2s to 5seconds
    const timer = setTimeout(() => {
      setDevices(mockDevices)
      setIsScanning(false)
    }, scanTime)

    return () => clearTimeout(timer)
  }, [])

  const handleRescan = () => {
    setIsScanning(true)
    setSelectedDevice(null)
    const scanTime = Math.random() * (5000 - 2000) + 2000;
    setTimeout(() => {
      setDevices(mockDevices)
      setIsScanning(false)
    }, scanTime)
  }

  return (
    <div className="container px-4 py-8 lg:py-12 pt-20 lg:pt-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Device Detection"
          description="Select a storage device to begin the secure wiping process. All connected devices are automatically scanned and verified."
        >
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={handleRescan}
              variant="outline"
              disabled={isScanning}
              size="lg"
              className="border-2 bg-transparent"
            >
              <ScanLine className={`mr-2 h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Scanning..." : "Rescan Devices"}
            </Button>
          </div>
        </PageHeader>

        {isScanning ? (
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50/30 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ScanLine className="h-16 w-16 text-blue-600 animate-spin mb-6" />
              <h3 className="text-2xl font-semibold mb-3 text-slate-800">Scanning for devices...</h3>
              <p className="text-slate-600 text-center text-lg">
                Please wait while we detect all connected storage devices.
              </p>
            </CardContent>
          </Card>
        ) : devices.length === 0 ? (
          <Card className="border-2 border-dashed border-orange-300 bg-orange-50/30 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertTriangle className="h-16 w-16 text-orange-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-3 text-slate-800">No devices detected</h3>
              <p className="text-slate-600 text-center mb-6 text-lg">
                Please connect a storage device and try scanning again.
              </p>
              <Button onClick={handleRescan} variant="outline" size="lg" className="border-2 bg-transparent">
                <ScanLine className="mr-2 h-4 w-4" />
                Rescan Devices
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800">Connected Devices ({devices.length})</h2>
              {selectedDevice && (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Link href={`/wipe/${selectedDevice}`}>
                    Continue to Wipe Options
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              {devices.map((device) => (
                <Card
                  key={device.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedDevice === device.id
                      ? "border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl"
                      : "border-0 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-slate-50"
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
                        <p className={selectedDevice === device.id ? "text-foreground/70" : "text-muted-foreground"}>
                          Capacity
                        </p>
                        <p className="font-medium">{device.capacity}</p>
                      </div>
                      <div>
                        <p className={selectedDevice === device.id ? "text-foreground/70" : "text-muted-foreground"}>
                          Interface
                        </p>
                        <p className="font-medium">{device.interface}</p>
                      </div>
                      <div className="col-span-2">
                        <p className={selectedDevice === device.id ? "text-foreground/70" : "text-muted-foreground"}>
                          Serial Number
                        </p>
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
              <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-600 text-center text-lg">
                    Select a device above to continue with the secure wiping process.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
