"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PageHeader } from "@/components/page-header"
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Shield,
  HardDrive,
  Settings,
  FileText,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: "getting-started" | "security" | "troubleshooting" | "compliance" | "advanced"
  tags: string[]
}

const faqData: FAQItem[] = [
  {
    id: "what-is-secure-wipe",
    question: "What is secure data wiping and why is it important?",
    answer:
      "Secure data wiping is the process of permanently erasing data from storage devices using specialized algorithms that overwrite the original data multiple times. Unlike simple deletion, which only removes file references, secure wiping ensures that data cannot be recovered using forensic tools. This is crucial for protecting sensitive information when disposing of or repurposing storage devices.",
    category: "getting-started",
    tags: ["basics", "security", "data protection"],
  },
  {
    id: "supported-devices",
    question: "What types of storage devices are supported?",
    answer:
      "SecureWipe Pro supports a wide range of storage devices including HDDs (Hard Disk Drives), SSDs (Solid State Drives), USB flash drives, SD cards, and other removable storage media. The tool automatically detects device types and applies appropriate wiping methods for optimal security and performance.",
    category: "getting-started",
    tags: ["devices", "compatibility", "hardware"],
  },
  {
    id: "wipe-methods",
    question: "What wiping methods are available and which should I choose?",
    answer:
      "SecureWipe Pro offers several industry-standard wiping methods: DoD 5220.22-M (3-pass and 7-pass), Gutmann (35-pass), and Random Data (1-pass). For most users, DoD 5220.22-M 3-pass provides excellent security. Use 7-pass or Gutmann for highly sensitive data. SSDs benefit from built-in secure erase commands when available.",
    category: "security",
    tags: ["methods", "algorithms", "standards"],
  },
  {
    id: "compliance-standards",
    question: "Which compliance standards does SecureWipe Pro meet?",
    answer:
      "SecureWipe Pro is designed to meet major compliance standards including NIST SP 800-88, DoD 5220.22-M, ISO 27001, and BSI-2011-01. The tool generates detailed certificates and reports that document the wiping process for audit purposes. Digital signatures can be applied to certificates for enhanced authenticity.",
    category: "compliance",
    tags: ["standards", "certification", "audit"],
  },
  {
    id: "how-long-wipe",
    question: "How long does a secure wipe take?",
    answer:
      "Wipe duration depends on device size, type, and selected method. Typical times: 1TB HDD with 3-pass method takes 2-4 hours, while SSDs are generally faster. 7-pass methods take 2-3x longer, and Gutmann (35-pass) can take 12-24 hours. The tool provides real-time progress updates and time estimates.",
    category: "getting-started",
    tags: ["time", "performance", "duration"],
  },
  {
    id: "ssd-secure-erase",
    question: "What is SSD Secure Erase and when should I use it?",
    answer:
      "SSD Secure Erase is a built-in command that instructs the SSD controller to cryptographically erase all data instantly. It's faster and more effective than traditional overwriting methods for SSDs. SecureWipe Pro automatically detects SSD support and recommends this method when available. It's compliant with NIST SP 800-88 guidelines.",
    category: "advanced",
    tags: ["SSD", "secure erase", "encryption"],
  },
  {
    id: "device-not-detected",
    question: "My device is not being detected. What should I do?",
    answer:
      "First, ensure the device is properly connected and powered on. Try different USB ports or cables. Some devices may require administrator privileges to access. If the device appears in your system's disk management but not in SecureWipe Pro, try refreshing the device list. For encrypted or BitLocker-protected drives, you may need to unlock them first.",
    category: "troubleshooting",
    tags: ["detection", "connection", "permissions"],
  },
  {
    id: "wipe-failed",
    question: "What should I do if a wipe operation fails?",
    answer:
      "Wipe failures can occur due to hardware issues, bad sectors, or device disconnection. Check the live logs for specific error messages. Ensure the device remains connected throughout the process. For drives with bad sectors, the tool will skip damaged areas and note them in the report. You can retry the operation or contact support for assistance.",
    category: "troubleshooting",
    tags: ["errors", "failure", "recovery"],
  },
  {
    id: "certificate-verification",
    question: "How do I verify the authenticity of a wipe certificate?",
    answer:
      "Each successful wipe generates a unique verification code and certificate ID. You can verify certificates by checking the digital signature (if enabled), comparing the verification code with your records, and reviewing the detailed metadata in the JSON report. The QR code provides quick access to verification details.",
    category: "compliance",
    tags: ["verification", "certificates", "authenticity"],
  },
  {
    id: "pause-resume",
    question: "Can I pause and resume a wipe operation?",
    answer:
      "Yes, SecureWipe Pro allows you to pause and resume wipe operations. This is useful for long-running operations or when you need to use your computer for other tasks. The tool maintains progress state and can resume from where it left off. Note that some SSD secure erase operations cannot be paused once started.",
    category: "advanced",
    tags: ["pause", "resume", "control"],
  },
  {
    id: "multiple-devices",
    question: "Can I wipe multiple devices simultaneously?",
    answer:
      "Currently, SecureWipe Pro processes one device at a time to ensure optimal performance and reliability. This approach allows for better monitoring, error handling, and resource management. You can queue multiple operations by completing one device before starting the next.",
    category: "advanced",
    tags: ["multiple", "simultaneous", "queue"],
  },
  {
    id: "data-recovery",
    question: "Can data be recovered after a secure wipe?",
    answer:
      "When performed correctly with appropriate methods, secure wiping makes data recovery extremely difficult or impossible. Modern wiping standards like NIST SP 800-88 are designed to prevent recovery even with advanced forensic tools. However, the effectiveness depends on the device type, wiping method, and number of passes used.",
    category: "security",
    tags: ["recovery", "forensics", "effectiveness"],
  },
]

const categories = [
  { id: "getting-started", name: "Getting Started", icon: Zap, color: "bg-primary/10 text-primary" },
  { id: "security", name: "Security", icon: Shield, color: "bg-success/10 text-success" },
  { id: "troubleshooting", name: "Troubleshooting", icon: AlertTriangle, color: "bg-warning/10 text-warning" },
  { id: "compliance", name: "Compliance", icon: FileText, color: "bg-accent/10 text-accent-foreground" },
  { id: "advanced", name: "Advanced", icon: Settings, color: "bg-secondary/10 text-secondary-foreground" },
]

const quickStartSteps = [
  {
    step: 1,
    title: "Connect Your Device",
    description: "Connect the storage device you want to securely wipe to your computer.",
    icon: HardDrive,
  },
  {
    step: 2,
    title: "Detect & Select",
    description: "Navigate to the Devices page and select your device from the detected list.",
    icon: Search,
  },
  {
    step: 3,
    title: "Choose Wipe Mode",
    description: "Select Quick Wipe for default settings or Advanced for custom configuration.",
    icon: Settings,
  },
  {
    step: 4,
    title: "Confirm & Start",
    description: "Review your settings, type 'DELETE' to confirm, and start the secure wipe.",
    icon: CheckCircle,
  },
  {
    step: 5,
    title: "Monitor Progress",
    description: "Watch real-time progress and download your compliance certificate when complete.",
    icon: Clock,
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = !selectedCategory || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen w-full max-w-none ml-0">
      <div className="container px-4 py-8 lg:py-12 max-w-6xl mx-auto">
        <PageHeader
          title="Help & Documentation"
          description="Find answers to common questions and learn how to use SecureWipe Pro effectively."
        />

        {/* Quick Start Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>Get started with SecureWipe Pro in 5 simple steps.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {quickStartSteps.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.step}
                    className="flex flex-col items-center text-center p-4 rounded-lg border bg-card/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm font-medium mb-1">Step {step.step}</div>
                    <div className="text-sm font-semibold mb-2">{step.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{step.description}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    !selectedCategory ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">All Topics</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {faqData.length}
                  </Badge>
                </button>
                {categories.map((category) => {
                  const Icon = category.icon
                  const count = faqData.filter((faq) => faq.category === category.id).length
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id ? category.color : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {count}
                      </Badge>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search help topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              {filteredFAQs.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground text-center">
                      Try adjusting your search terms or browse by category.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {filteredFAQs.length} {filteredFAQs.length === 1 ? "result" : "results"} found
                    </p>
                    {selectedCategory && (
                      <Badge variant="outline" className="text-xs">
                        {categories.find((c) => c.id === selectedCategory)?.name}
                      </Badge>
                    )}
                  </div>

                  {filteredFAQs.map((faq) => {
                    const isOpen = openItems.includes(faq.id)
                    const category = categories.find((c) => c.id === faq.category)

                    return (
                      <Card key={faq.id} className="border-2 hover:border-primary/20 transition-colors">
                        <Collapsible open={isOpen} onOpenChange={() => toggleItem(faq.id)}>
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg text-left text-balance">{faq.question}</CardTitle>
                                  <div className="flex items-center gap-2 mt-2">
                                    {category && (
                                      <Badge variant="outline" className="text-xs">
                                        {category.name}
                                      </Badge>
                                    )}
                                    <div className="flex flex-wrap gap-1">
                                      {faq.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {isOpen ? (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground mt-1" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                                )}
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="prose prose-sm max-w-none">
                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
