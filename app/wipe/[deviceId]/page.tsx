"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/page-header"
import { HardDrive, Zap, Settings, Shield, AlertTriangle, Clock, ArrowRight, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

interface WipeMethod {
  id: string
  name: string
  description: string
  passes: number
  estimatedTime: string
  compliance: string[]
}

const wipeMethods: WipeMethod[] = [
  {
    id: "dod-3pass",
    name: "DoD 5220.22-M (3-pass)",
    description: "Standard 3-pass overwrite method",
    passes: 3,
    estimatedTime: "2-4 hours",
    compliance: ["DoD 5220.22-M", "NIST SP 800-88"],
  },
  {
    id: "dod-7pass",
    name: "DoD 5220.22-M (7-pass)",
    description: "Enhanced 7-pass overwrite method",
    passes: 7,
    estimatedTime: "4-8 hours",
    compliance: ["DoD 5220.22-M", "NIST SP 800-88"],
  },
  {
    id: "gutmann",
    name: "Gutmann (35-pass)",
    description: "Most thorough overwrite method",
    passes: 35,
    estimatedTime: "12-24 hours",
    compliance: ["Gutmann", "NIST SP 800-88"],
  },
  {
    id: "random",
    name: "Random Data",
    description: "Single pass with cryptographically secure random data",
    passes: 1,
    estimatedTime: "30min-2 hours",
    compliance: ["NIST SP 800-88"],
  },
]

// Mock device data
const mockDevice = {
  id: "dev-001",
  name: "Primary System Drive",
  model: "Samsung SSD 980 PRO",
  type: "SSD" as const,
  capacity: "1TB",
  serialNumber: "S6XNNU0R123456",
  interface: "NVMe PCIe 4.0",
}

export default function WipeConfigPage() {
  const params = useParams()
  const router = useRouter()
  const [wipeMode, setWipeMode] = useState<"quick" | "advanced">("quick")
  const [selectedMethod, setSelectedMethod] = useState("dod-3pass")
  const [ssdSanitize, setSsdSanitize] = useState(true)
  const [hpaReset, setHpaReset] = useState(false)
  const [dcoReset, setDcoReset] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const selectedWipeMethod = wipeMethods.find((m) => m.id === selectedMethod)

  const handleProceed = () => {
    if (confirmationText === "DELETE") {
      router.push(`/wipe/${params.deviceId}/progress`)
    }
  }

  const canProceed = confirmationText === "DELETE"

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <PageHeader
            title="Wipe Configuration"
            description="Configure the secure wiping process for your selected device. Choose between quick and advanced options."
          >
            <div className="flex items-center gap-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/devices">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Devices
                </Link>
              </Button>
            </div>
          </PageHeader>

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
                <Badge variant="secondary" className="ml-auto">
                  {mockDevice.type}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Wipe Mode Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Wipe Mode
              </CardTitle>
              <CardDescription>Choose between quick setup or advanced configuration options.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={wipeMode} onValueChange={(value: "quick" | "advanced") => setWipeMode(value)}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Label
                    htmlFor="quick"
                    className={`flex flex-col gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                      wipeMode === "quick" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="quick" id="quick" />
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Quick Wipe</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      One-click secure wiping with safe defaults. Perfect for most users.
                    </p>
                  </Label>

                  <Label
                    htmlFor="advanced"
                    className={`flex flex-col gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                      wipeMode === "advanced" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Advanced Wipe</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Full control over wiping methods, passes, and additional options.
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          {wipeMode === "advanced" && (
            <div className="space-y-6 mb-6">
              {/* Wipe Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Sanitization Method</CardTitle>
                  <CardDescription>
                    Select the overwrite pattern and number of passes for the wiping process.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wipeMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{method.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {method.passes} passes • {method.estimatedTime}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedWipeMethod && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{selectedWipeMethod.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {selectedWipeMethod.passes} passes
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {selectedWipeMethod.estimatedTime}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedWipeMethod.compliance.map((standard) => (
                              <Badge key={standard} variant="outline" className="text-xs">
                                {standard}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Options</CardTitle>
                  <CardDescription>Configure additional sanitization features for enhanced security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockDevice.type === "SSD" && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ssd-sanitize"
                        checked={ssdSanitize}
                        onCheckedChange={(checked) => setSsdSanitize(checked as boolean)}
                      />
                      <Label htmlFor="ssd-sanitize" className="text-sm font-medium">
                        SSD Secure Erase (ATA SANITIZE)
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        Recommended
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hpa-reset"
                      checked={hpaReset}
                      onCheckedChange={(checked) => setHpaReset(checked as boolean)}
                    />
                    <Label htmlFor="hpa-reset" className="text-sm font-medium">
                      Reset Host Protected Area (HPA)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dco-reset"
                      checked={dcoReset}
                      onCheckedChange={(checked) => setDcoReset(checked as boolean)}
                    />
                    <Label htmlFor="dco-reset" className="text-sm font-medium">
                      Reset Device Configuration Overlay (DCO)
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Summary */}
          <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Wipe Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device:</span>
                  <span className="font-medium">{mockDevice.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode:</span>
                  <span className="font-medium capitalize">{wipeMode} Wipe</span>
                </div>
                {wipeMode === "advanced" && selectedWipeMethod && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-medium">{selectedWipeMethod.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Time:</span>
                      <span className="font-medium">{selectedWipeMethod.estimatedTime}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Confirmation */}
          {!showConfirmation ? (
            <div className="flex justify-center">
              <Button onClick={() => setShowConfirmation(true)} size="lg" className="text-lg px-8">
                Continue to Confirmation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Card className="border-2 border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Final Confirmation Required
                </CardTitle>
                <CardDescription>
                  This action will permanently erase all data on the selected device. This cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>WARNING:</strong> All data on "{mockDevice.name}" will be permanently destroyed. Make sure
                    you have backed up any important files.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="confirmation">
                    Type <strong>DELETE</strong> to confirm:
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleProceed} disabled={!canProceed} variant="destructive" className="flex-1">
                    Start Secure Wipe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
