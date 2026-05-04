import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton() {
  return (
    <div className="service-card p-6 text-center">
      <Skeleton className="mx-auto w-14 h-14 rounded-full mb-4" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-5/6 mx-auto mb-3" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-card">
      <Skeleton className="mx-auto w-28 h-28 rounded-full mb-4" />
      <Skeleton className="h-5 w-2/3 mx-auto mb-2" />
      <Skeleton className="h-3 w-1/2 mx-auto mb-3" />
      <Skeleton className="h-5 w-24 mx-auto rounded-full mb-3" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-4/5 mx-auto mb-4" />
      <Skeleton className="h-7 w-28 mx-auto rounded-full" />
    </div>
  );
}

export function TestimonialCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-3/4 mb-4" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
