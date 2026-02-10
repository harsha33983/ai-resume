import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Nav Skeleton */}
            <div className="border-b border-border bg-card">
                <div className="flex h-14 items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="hidden items-center gap-1 md:flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-8 w-24" />
                        ))}
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
                {/* Hero Skeleton */}
                <div className="mb-10 flex flex-col items-center space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-16 w-full max-w-2xl" />
                    <Skeleton className="h-6 w-full max-w-xl" />
                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="mb-10">
                    <Skeleton className="mb-4 h-6 w-32" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
