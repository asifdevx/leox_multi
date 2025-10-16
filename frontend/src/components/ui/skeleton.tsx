import { cn } from "@/utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };

export function SkeletonCom() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function SkeletonComRole() {
  return (
    <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow-md">
      <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />

      <div className="flex flex-col space-y-2 w-full">
        <Skeleton className="h-4 w-[120px] bg-gray-700" />
        <Skeleton className="h-3 w-[160px] bg-gray-700" />
        <Skeleton className="h-3 w-[100px] bg-gray-700" />
      </div>
    </div>
  );
}



export function TransactionSkeleton (){

    return (
      <div className="relative p-2 border border-white/40 rounded-lg overflow-hidden">
        {/* Image Skeleton */}
        <div className="relative w-full aspect-square">
          <Skeleton className="w-full h-full rounded-lg bg-white" />
        </div>
  
        {/* Text Skeletons */}
        <div className="mt-2 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-white rounded" />
  
          <div className="flex items-center justify-between mt-1">
            <Skeleton className="h-3 w-[60px] bg-white rounded" />
            <Skeleton className="h-3 w-[40px] bg-white rounded" />
          </div>
        </div>
      </div>
    );

}
export function NFTimage(){
  return(
    <Skeleton className="w-full h-full rounded-lg bg-white" />

  )
}