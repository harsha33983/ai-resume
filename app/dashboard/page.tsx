import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Hero } from "@/components/ui/animated-hero"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        {/* Hero Section */}
        <section className="mb-10">
          <Hero />
        </section>

        <AuthWrapper>
          <DashboardContent />
        </AuthWrapper>
      </main>
    </div>
  )
}
