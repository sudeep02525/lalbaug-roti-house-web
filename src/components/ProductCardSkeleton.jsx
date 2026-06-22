import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE5D9] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col h-full w-full">
      {/* Image Skeleton */}
      <div className="relative h-48 sm:h-52 w-full shrink-0 border-b border-[#EAE5D9] bg-[#FAF8F5]">
        <Skeleton className="w-full h-full rounded-none opacity-50" />
        {/* Fake Pure Veg Tag */}
        <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full border border-[#E6DCCF] flex items-center gap-1 shadow-sm z-10 w-20 h-6">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-10 h-2" />
        </div>
      </div>
      
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="mb-3">
          {/* Title Skeleton */}
          <Skeleton className="h-5 w-[65%] mb-3 rounded-lg" />
          {/* Description Skeleton */}
          <Skeleton className="h-2.5 w-[90%] mb-2" />
          <Skeleton className="h-2.5 w-[75%] mb-4" />
        </div>
        
        <div className="mt-auto pt-3 border-t border-[#EAE5D9]/50 flex items-center justify-between">
          <div className="flex flex-col gap-1.5 w-1/2">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-2.5 w-10" />
          </div>
          {/* Fake ADD Button */}
          <div className="w-[72px] h-[38px] rounded-lg border border-[#16A34A]/20 bg-[#16A34A]/5 flex items-center justify-center">
            <Skeleton className="h-3 w-8 bg-[#16A34A]/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
