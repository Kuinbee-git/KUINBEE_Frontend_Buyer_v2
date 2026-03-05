export default function DatasetDetailLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header skeleton */}
            <div className="h-16 border-b border-border/50" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                    {/* Main content skeleton */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-3">
                            <div className="h-8 w-3/4 rounded bg-muted/50 animate-pulse" />
                            <div className="h-4 w-1/2 rounded bg-muted/30 animate-pulse" />
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-7 w-20 rounded-full bg-muted/40 animate-pulse"
                                />
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 pt-4">
                            <div className="h-4 w-full rounded bg-muted/30 animate-pulse" />
                            <div className="h-4 w-full rounded bg-muted/30 animate-pulse" />
                            <div className="h-4 w-4/5 rounded bg-muted/30 animate-pulse" />
                            <div className="h-4 w-3/4 rounded bg-muted/30 animate-pulse" />
                        </div>

                        {/* Table skeleton */}
                        <div className="rounded-2xl border border-border/50 p-5 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 w-28 rounded bg-muted/30 animate-pulse" />
                                    <div className="h-4 w-36 rounded bg-muted/40 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar skeleton */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border/50 p-6 space-y-4">
                            <div className="h-8 w-24 rounded bg-muted/50 animate-pulse" />
                            <div className="h-11 w-full rounded-xl bg-muted/50 animate-pulse" />
                            <div className="h-11 w-full rounded-xl bg-muted/30 animate-pulse" />
                            <div className="space-y-2 pt-2">
                                <div className="h-3 w-full rounded bg-muted/20 animate-pulse" />
                                <div className="h-3 w-3/4 rounded bg-muted/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
