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
    <div className="container px-4 py-8 lg:py-12 pt-20 lg:pt-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Wipe Configuration"
          description="Configure the secure wiping process for your selected device. Choose between quick and advanced options."
        >
          <div className="flex items-center gap-4 pt-6">
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent">
              <Link href="/devices">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Devices
              </Link>
            </Button>
          </div>
        </PageHeader>

        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200">
                <HardDrive className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl text-slate-800">{mockDevice.name}</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  {mockDevice.model} • {mockDevice.capacity}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {mockDevice.type}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              Wipe Mode
            </CardTitle>
            <CardDescription className="text-base">
              Choose between quick setup or advanced configuration options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={wipeMode} onValueChange={(value: "quick" | "advanced") => setWipeMode(value)}>
              <div className="grid gap-6 md:grid-cols-2">
                <Label
                  htmlFor="quick"
                  className={`flex flex-col gap-4 rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                    wipeMode === "quick"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="quick" id="quick" />
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-lg font-semibold text-slate-800">Quick Wipe</span>
                    </div>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${wipeMode === "quick" ? "text-slate-700" : "text-slate-600"}`}
                  >
                    One-click secure wiping with safe defaults. Perfect for most users.
                  </p>
                </Label>

                <Label
                  htmlFor="advanced"
                  className={`flex flex-col gap-4 rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                    wipeMode === "advanced"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Settings className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-lg font-semibold text-slate-800">Advanced Wipe</span>
                    </div>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${wipeMode === "advanced" ? "text-slate-700" : "text-slate-600"}`}
                  >
                    Full control over wiping methods, passes, and additional options.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        {wipeMode === "advanced" && (
          <div className="space-y-8 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-slate-800">Sanitization Method</CardTitle>
                <CardDescription className="text-base">
                  Select the overwrite pattern and number of passes for the wiping process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger className="h-12">
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
                  <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-800">{selectedWipeMethod.description}</p>
                        <div className="flex items-center gap-6 text-xs text-slate-600">
                          <span className="flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            {selectedWipeMethod.passes} passes
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {selectedWipeMethod.estimatedTime}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedWipeMethod.compliance.map((standard) => (
                            <Badge key={standard} variant="outline" className="text-xs bg-white">
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

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-slate-800">Additional Options</CardTitle>
                <CardDescription className="text-base">
                  Configure additional sanitization features for enhanced security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockDevice.type === "SSD" && (
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Checkbox
                      id="ssd-sanitize"
                      checked={ssdSanitize}
                      onCheckedChange={(checked) => setSsdSanitize(checked as boolean)}
                    />
                    <Label htmlFor="ssd-sanitize" className="text-sm font-medium text-slate-800">
                      SSD Secure Erase (ATA SANITIZE)
                    </Label>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                      Recommended
                    </Badge>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <Checkbox
                    id="hpa-reset"
                    checked={hpaReset}
                    onCheckedChange={(checked) => setHpaReset(checked as boolean)}
                  />
                  <Label htmlFor="hpa-reset" className="text-sm font-medium text-slate-800">
                    Reset Host Protected Area (HPA)
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <Checkbox
                    id="dco-reset"
                    checked={dcoReset}
                    onCheckedChange={(checked) => setDcoReset(checked as boolean)}
                  />
                  <Label htmlFor="dco-reset" className="text-sm font-medium text-slate-800">
                    Reset Device Configuration Overlay (DCO)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mb-8 border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              Wipe Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-slate-600 font-medium">Device:</span>
                <span className="font-semibold text-slate-800">{mockDevice.name}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-slate-600 font-medium">Mode:</span>
                <span className="font-semibold text-slate-800 capitalize">{wipeMode} Wipe</span>
              </div>
              {wipeMode === "advanced" && selectedWipeMethod && (
                <>
                  <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                    <span className="text-slate-600 font-medium">Method:</span>
                    <span className="font-semibold text-slate-800">{selectedWipeMethod.name}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                    <span className="text-slate-600 font-medium">Estimated Time:</span>
                    <span className="font-semibold text-slate-800">{selectedWipeMethod.estimatedTime}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation */}
        {!showConfirmation ? (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowConfirmation(true)}
              size="lg"
              className="text-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg text-white border-0"
            >
              Continue to Confirmation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Card className="border-2 border-red-200 shadow-xl bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-red-800">
                <AlertTriangle className="h-6 w-6" />
                Final Confirmation Required
              </CardTitle>
              <CardDescription className="text-base text-red-700">
                This action will permanently erase all data on the selected device. This cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>WARNING:</strong> All data on "{mockDevice.name}" will be permanently destroyed. Make sure you
                  have backed up any important files.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label htmlFor="confirmation" className="text-sm font-medium text-slate-800">
                  Type <strong>DELETE</strong> to confirm:
                </Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="font-mono h-12 text-center text-lg"
                />
              </div>

              <div className="flex gap-6 pt-4">
                <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1 h-12 border-2">
                  Cancel
                </Button>
                <Button
                  onClick={handleProceed}
                  disabled={!canProceed}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  Start Secure Wipe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
