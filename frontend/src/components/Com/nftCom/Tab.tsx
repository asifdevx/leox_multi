import { cn } from "@/utils/cn";
import React from "react";

export const Tabs = React.memo(({ tabs, active, onChange }: { tabs: string[]; active: number; onChange: (idx:number)=>void }) => (
    <div className="flex items-start gap-2 md:gap-6">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => onChange(idx)}
          className={cn(
            'text-white/70 text-sm md:text-base pb-1 transition-colors',
            idx === active && 'text-white border-b-2 border-white pb-[6px] font-semibold',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  ))