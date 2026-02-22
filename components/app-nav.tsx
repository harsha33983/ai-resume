"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  Upload,
  LayoutDashboard,
  Palette,
  BarChart3,
  Target,
  BookOpen,
  Brain,
  Briefcase,
  Menu,
  X,
  LogOut,
  User,
  Mic,
  GraduationCap,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Resume", icon: Upload },
  { href: "/builder", label: "Resume Builder", icon: FileText },
  { href: "/templates", label: "Templates", icon: Palette },
  { href: "/analysis", label: "Analysis", icon: BarChart3 },
  { href: "/skill-gap", label: "Skill Gap", icon: Target },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/mock-test", label: "Mock Test", icon: Brain },
  { href: "/interview-prep", label: "Interview Prep", icon: Mic },
  { href: "/placement-prep", label: "Placement Hub", icon: GraduationCap },
  { href: "/jobs", label: "Job Board", icon: Briefcase },
]

export function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              AI Resume Studio
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">{user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !loading ? (
              <Link href="/auth/login">
                <Button size="sm">Sign In</Button>
              </Link>
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={`mobile-${item.href}-${index}`}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>
    </>
  )
}
