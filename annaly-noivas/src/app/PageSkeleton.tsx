import { Skeleton } from "@/shared/ui/Skeleton";

/** Fallback do Suspense: esqueleto de página inteira enquanto o chunk da rota baixa. */
export function PageSkeleton() {
  return (
    <main className="container page-skeleton" role="status" aria-label="Carregando página">
      <Skeleton height={14} width={120} />
      <Skeleton height={48} width="60%" radius={12} />
      <Skeleton height={16} width="45%" />
      <div className="grid">
        <Skeleton height={380} radius={18} />
        <Skeleton height={380} radius={18} />
        <Skeleton height={380} radius={18} />
      </div>
    </main>
  );
}
