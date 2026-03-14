export default function DatasetsLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Nav skeleton */}
            <div className="h-16 border-b border-border/50 sticky top-0 z-50 bg-background" />

            <section className="pt-20 md:pt-32 pb-12">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    {/* Page header skeleton */}
                    <div className="mb-8 space-y-3">
                        <div className="h-9 w-72 rounded-lg bg-muted/50 animate-pulse" />
                        <div className="h-4 w-full max-w-xl rounded bg-muted/30 animate-pulse" />
                        <div className="h-3 w-32 rounded bg-muted/20 animate-pulse" />
                    </div>

                    {/* 2-column layout matching the actual page: 280px sidebar + card list */}
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
                        {/* Sidebar skeleton */}
                        <div className="hidden lg:flex flex-col gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="rounded-xl border border-border/40 bg-card overflow-hidden">
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="h-3 w-16 rounded bg-muted/50 animate-pulse" />
                                        <div className="h-4 w-4 rounded bg-muted/30 animate-pulse" />
                                    </div>
                                    {i < 2 && (
                                        <div className="px-5 pb-5 space-y-2">
                                            {Array.from({ length: 4 }).map((_, j) => (
                                                <div key={j} className="h-8 rounded-lg bg-muted/30 animate-pulse" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Card list skeleton — matches DatasetCardSkeleton layout */}
                        <div className="space-y-4">
                            {/* Tabs + search bar container */}
                            <div className="rounded-xl border border-border/40 bg-card p-4 flex gap-4">
                                <div className="flex gap-2">
                                    <div className="h-9 w-24 rounded-lg bg-muted/50 animate-pulse" />
                                    <div className="h-9 w-24 rounded-lg bg-muted/30 animate-pulse" />
                                </div>
                                <div className="flex-1 h-10 rounded-lg bg-muted/30 animate-pulse" />
                            </div>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="rounded-xl border border-border/40 bg-card p-5 space-y-4 animate-pulse">
                                    <div className="flex gap-2">
                                        <div className="h-5 w-16 rounded-full bg-muted/50" />
                                        <div className="h-5 w-12 rounded-full bg-muted/30" />
                                    </div>
                                    <div className="h-5 w-3/4 rounded bg-muted/50" />
                                    <div className="h-3 w-1/3 rounded bg-muted/30" />
                                    <div className="flex gap-4">
                                        <div className="h-3 w-20 rounded bg-muted/20" />
                                        <div className="h-3 w-20 rounded bg-muted/20" />
                                        <div className="h-3 w-20 rounded bg-muted/20" />
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex gap-2">
                                            <div className="h-6 w-14 rounded-full bg-muted/30" />
                                            <div className="h-6 w-14 rounded-full bg-muted/20" />
                                        </div>
                                        <div className="h-9 w-28 rounded-lg bg-muted/40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
