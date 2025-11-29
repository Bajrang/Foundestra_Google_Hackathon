"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white rounded-lg border shadow-lg", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4 w-full",
        caption: "flex justify-center pt-2 relative items-center w-full mb-4",
        caption_label: "text-base font-semibold text-gray-900",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 p-0",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse table-fixed",
        head_row: "flex w-full",
        head_cell: "text-gray-600 font-medium text-sm w-10 h-10 flex items-center justify-center uppercase tracking-wide",
        row: "flex w-full mt-1",
        cell: "relative p-0 text-center w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-md transition-colors",
        day: cn(
          "w-10 h-10 p-0 font-normal text-sm flex items-center justify-center rounded-md transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1",
        ),
        day_range_start: "aria-selected:bg-purple-600 aria-selected:text-white aria-selected:hover:bg-purple-700",
        day_range_end: "aria-selected:bg-purple-600 aria-selected:text-white aria-selected:hover:bg-purple-700",
        day_selected: "bg-purple-600 text-white hover:bg-purple-700 focus:bg-purple-700",
        day_today: "bg-blue-50 text-blue-700 font-semibold border border-blue-200",
        day_outside: "text-gray-400 opacity-50 hover:bg-gray-50",
        day_disabled: "text-gray-300 opacity-30 cursor-not-allowed hover:bg-transparent",
        day_range_middle: "aria-selected:bg-purple-100 aria-selected:text-purple-900",
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

export { Calendar };