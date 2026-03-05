export default function DatasetsLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header skeleton */}
            <div className="h-16 border-b border-border/50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search bar skeleton */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="h-11 flex-1 rounded-xl bg-muted/50 animate-pulse" />
                    <div className="h-11 w-32 rounded-xl bg-muted/50 animate-pulse" />
                </div>

                {/* Filters skeleton */}
                <div className="flex gap-3 mb-8 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-9 w-24 rounded-full bg-muted/50 animate-pulse shrink-0"
                        />
                    ))}
                </div>

                {/* Dataset grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/50 bg-card p-5 space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-muted/50 animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-muted/50 animate-pulse" />
                                    <div className="h-3 w-1/2 rounded bg-muted/30 animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded bg-muted/30 animate-pulse" />
                                <div className="h-3 w-5/6 rounded bg-muted/30 animate-pulse" />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div className="h-5 w-16 rounded bg-muted/50 animate-pulse" />
                                <div className="h-8 w-20 rounded-lg bg-muted/50 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
