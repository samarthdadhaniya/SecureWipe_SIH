import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <PageHeader
            title="Professional Data Wiping Solution"
            description="Securely erase sensitive data with military-grade sanitization methods and comprehensive compliance reporting."
          >
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/devices">
                  <Shield className="mr-2 h-5 w-5" />
                  Start Secure Wipe
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/help">Learn More</Link>
              </Button>
            </div>
          </PageHeader>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-2 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="mt-12 border-2 border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Secure Your Data?</CardTitle>
              <CardDescription className="text-lg">
                Start with our simple wizard or explore advanced options for complete control.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/devices">Quick Start</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/settings">Advanced Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
