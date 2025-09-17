"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { Globe, Shield, Key, FileText, Save, Upload, Download, Info, CheckCircle } from "lucide-react"

interface SettingsState {
  language: string
  compliancePreset: string
  autoGenerateReports: boolean
  enableLogging: boolean
  logLevel: string
  digitalSignature: boolean
  signatureKey: string
  customCertificateTemplate: string
  defaultWipeMethod: string
  confirmationRequired: boolean
  pauseOnError: boolean
}

const initialSettings: SettingsState = {
  language: "en",
  compliancePreset: "nist-sp-800-88",
  autoGenerateReports: true,
  enableLogging: true,
  logLevel: "info",
  digitalSignature: false,
  signatureKey: "",
  customCertificateTemplate: "",
  defaultWipeMethod: "dod-3pass",
  confirmationRequired: true,
  pauseOnError: true,
}

const compliancePresets = [
  { value: "nist-sp-800-88", label: "NIST SP 800-88", description: "US National Institute of Standards" },
  { value: "dod-5220-22-m", label: "DoD 5220.22-M", description: "US Department of Defense" },
  { value: "iso-27001", label: "ISO 27001", description: "International Organization for Standardization" },
  { value: "bsi-2011-01", label: "BSI-2011-01", description: "German Federal Office for Information Security" },
  { value: "custom", label: "Custom Configuration", description: "Define your own compliance requirements" },
]

const wipeMethodOptions = [
  { value: "dod-3pass", label: "DoD 5220.22-M (3-pass)" },
  { value: "dod-7pass", label: "DoD 5220.22-M (7-pass)" },
  { value: "gutmann", label: "Gutmann (35-pass)" },
  { value: "random", label: "Random Data (1-pass)" },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(initialSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
    setSaveStatus("idle")
  }

  const handleSave = async () => {
    setSaveStatus("saving")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaveStatus("saved")
    setHasChanges(false)
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  const handleImportSettings = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string)
            setSettings({ ...settings, ...importedSettings })
            setHasChanges(true)
          } catch (error) {
            console.error("Failed to import settings:", error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleExportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "securewipe-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen w-full max-w-none ml-0">
      <div className="container px-4 py-8 lg:py-12 max-w-4xl mx-auto">
        <PageHeader
          title="Settings"
          description="Configure SecureWipe Pro to meet your organization's compliance and security requirements."
        >
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === "saving"}
              className="flex items-center gap-2"
            >
              {saveStatus === "saving" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : saveStatus === "saved" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Changes"}
            </Button>
            <Button onClick={handleImportSettings} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Settings
            </Button>
            <Button onClick={handleExportSettings} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Settings
            </Button>
          </div>
        </PageHeader>

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic application preferences and behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultWipeMethod">Default Wipe Method</Label>
                  <Select
                    value={settings.defaultWipeMethod}
                    onValueChange={(value) => updateSetting("defaultWipeMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wipeMethodOptions.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirmation Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Require typing "DELETE" before starting wipe operations
                    </p>
                  </div>
                  <Switch
                    checked={settings.confirmationRequired}
                    onCheckedChange={(checked) => updateSetting("confirmationRequired", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pause on Error</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically pause wipe operations when errors occur
                    </p>
                  </div>
                  <Switch
                    checked={settings.pauseOnError}
                    onCheckedChange={(checked) => updateSetting("pauseOnError", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Presets
              </CardTitle>
              <CardDescription>
                Select compliance standards that match your organization's requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="compliancePreset">Compliance Standard</Label>
                <Select
                  value={settings.compliancePreset}
                  onValueChange={(value) => updateSetting("compliancePreset", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {compliancePresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{preset.label}</span>
                          <span className="text-xs text-muted-foreground">{preset.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {settings.compliancePreset !== "custom" && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Using {compliancePresets.find((p) => p.value === settings.compliancePreset)?.label} compliance
                    preset. This will automatically configure wipe methods and reporting requirements.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Digital Signature Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Digital Signature
              </CardTitle>
              <CardDescription>Configure digital signatures for compliance certificates and reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Digital Signatures</Label>
                  <p className="text-sm text-muted-foreground">
                    Digitally sign all certificates and reports for enhanced authenticity
                  </p>
                </div>
                <Switch
                  checked={settings.digitalSignature}
                  onCheckedChange={(checked) => updateSetting("digitalSignature", checked)}
                />
              </div>

              {settings.digitalSignature && (
                <div className="space-y-2">
                  <Label htmlFor="signatureKey">Private Key Path</Label>
                  <Input
                    id="signatureKey"
                    value={settings.signatureKey}
                    onChange={(e) => updateSetting("signatureKey", e.target.value)}
                    placeholder="/path/to/private-key.pem"
                  />
                  <p className="text-xs text-muted-foreground">
                    Path to your RSA private key file for signing certificates
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reporting Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reporting & Logging
              </CardTitle>
              <CardDescription>Configure automatic report generation and system logging.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Generate Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate PDF and JSON reports after successful wipes
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoGenerateReports}
                    onCheckedChange={(checked) => updateSetting("autoGenerateReports", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable System Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all wipe operations and system events for audit purposes
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableLogging}
                    onCheckedChange={(checked) => updateSetting("enableLogging", checked)}
                  />
                </div>
              </div>

              {settings.enableLogging && (
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select value={settings.logLevel} onValueChange={(value) => updateSetting("logLevel", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="customTemplate">Custom Certificate Template</Label>
                <Textarea
                  id="customTemplate"
                  value={settings.customCertificateTemplate}
                  onChange={(e) => updateSetting("customCertificateTemplate", e.target.value)}
                  placeholder="Enter custom certificate template (HTML/Markdown)..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Customize the certificate template with your organization's branding
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
