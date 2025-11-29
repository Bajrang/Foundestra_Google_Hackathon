"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4 w-full",
        caption: "flex justify-center pt-1 relative items-center w-full mb-2",
        caption_label: "text-base font-semibold",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-accent",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "grid grid-cols-7 gap-1 w-full",
        head_cell: "text-muted-foreground font-medium text-xs uppercase tracking-wide w-10 h-10 flex items-center justify-center rounded-md",
        row: "grid grid-cols-7 gap-1 w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm w-10 h-10 rounded-md",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent/50",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-10 h-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/50 flex items-center justify-center rounded-md transition-colors",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-semibold border-2 border-primary/20",
        day_outside:
          "day-outside text-muted-foreground opacity-40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-20 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={( {
        IconLeft: ({ className, ...props }: any) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }: any) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      } as any)}
      {...props}
    />
  );
}

export { EnhancedCalendar };