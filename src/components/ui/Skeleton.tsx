interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-zinc-200 rounded ${className}`} />
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="w-10 h-10 rounded-xl" />
                            <Skeleton className="h-5 w-12" />
                        </div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Velocity chart skeleton */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                    <Skeleton className="h-[300px] w-full" />
                </div>

                <div className="space-y-8">
                    {/* Health card skeleton */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-8 h-8 rounded-lg" />
                                        <div>
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-5 w-12" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-zinc-100">
                            <Skeleton className="h-9 w-full" />
                        </div>
                    </div>

                    {/* Activity card skeleton */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                    <div className="flex-1">
                                        <Skeleton className="h-3 w-full mb-1" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function KanbanBoardSkeleton() {
    return (
        <div className="h-full flex gap-6 overflow-x-auto pb-6">
            {[1, 2, 3, 4].map((col) => (
                <div key={col} className="flex-shrink-0 w-80">
                    <div className="bg-zinc-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-6 w-8 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((card) => (
                                <div key={card} className="bg-white p-4 rounded-xl border border-zinc-200">
                                    <Skeleton className="h-4 w-16 mb-2" />
                                    <Skeleton className="h-5 w-full mb-3" />
                                    <Skeleton className="h-3 w-3/4 mb-4" />
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TasksTableSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <div className="p-6 border-b border-zinc-200">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
            <div className="divide-y divide-zinc-100">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                    <div key={row} className="p-4 flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 flex-1" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TeamPageSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>

            {/* Team grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((card) => (
                    <div key={card} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TaskDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-full max-w-2xl" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200">
                        <Skeleton className="h-6 w-24 mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-10/12" />
                            <Skeleton className="h-4 w-9/12" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-200">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            {[1, 2].map((comment) => (
                                <div key={comment} className="flex gap-3">
                                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-32 mb-2" />
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200">
                        <Skeleton className="h-6 w-24 mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((field) => (
                                <div key={field}>
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
