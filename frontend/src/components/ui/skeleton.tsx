import { cn } from "@/utils/cn";
import React from "react";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-neutral-600/20" />
    </div>
  );
}




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
    <div className="flex items-center gap-3 p-4 rounded-lg shadow-md">
      <Skeleton className="h-10 w-10 rounded-full" />

      <div className="flex flex-col space-y-2 w-full">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-3 w-[160px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </div>
  );
}



export function TransactionSkeleton (){

    return (
      <div className="relative p-2 border border-white/40 rounded-lg overflow-hidden">
        {/* Image Skeleton */}
        <div className="relative w-full aspect-square">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
  
        {/* Text Skeletons */}
        <div className="mt-2 space-y-2">
        <Skeleton className="h-3 w-[35%] rounded" />

          <Skeleton className="h-5 w-3/4 rounded" />
  
          <div className=" w-full h-8 flex items-center justify-between mt-1 p-2 ">
            <Skeleton className="h-3 w-[60px] rounded" />
            <Skeleton className="h-3 w-[40px] rounded" />
          </div>
        </div>
      </div>
    );

}
export function NFTimage(){
  return(
    <Skeleton className="w-full h-full rounded-lg" />

  )
}