import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Shield, Zap, FileCheck, Lock, HardDrive, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Quick & Advanced Modes",
    description: "Simple one-click wiping or advanced multi-pass sanitization methods",
  },
  {
    icon: FileCheck,
    title: "Compliance Reporting",
    description: "Generate PDF/JSON reports with verification codes for audit trails",
  },
  {
    icon: Lock,
    title: "Military-Grade Security",
    description: "NIST SP 800-88 compliant with multiple sanitization standards",
  },
  {
    icon: HardDrive,
    title: "Multi-Device Support",
    description: "Works with HDDs, SSDs, USB drives, and other storage devices",
  },
  {
    icon: Clock,
    title: "Real-Time Progress",
    description: "Live progress tracking with detailed logs and time estimates",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Professional-grade tool trusted by IT professionals worldwide",
  },
]

export default function HomePage() {
  return (
    <div className="container px-4 py-8 lg:py-12 pt-20 lg:pt-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Professional Data Wiping Solution"
          description="Securely erase sensitive data with military-grade sanitization methods and comprehensive compliance reporting."
        >
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link
              href="/devices"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg text-white"
            >
              <Shield className="mr-3 h-5 w-5" />
              Start Secure Wipe
            </Link>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 h-14 border-2 hover:bg-slate-50 bg-transparent"
            >
              <Link href="/help">Learn More</Link>
            </Button>
          </div>
        </PageHeader>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-16 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-slate-800">Ready to Secure Your Data?</CardTitle>
            <CardDescription className="text-lg text-slate-600 mt-3">
              Start with our simple wizard or explore advanced options for complete control.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Link
              href="/devices"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Quick Start
            </Link>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 h-14 border-2 hover:bg-white bg-transparent"
            >
              <Link href="/settings">Advanced Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
