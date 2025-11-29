"use client";

import * as React from "react";
import { Calendar as CalendarPrimitive } from "./calendar";
import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CalendarIcon, Check, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "./utils";
import { useIsMobile } from "./use-mobile";

interface MobileCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
  initialFocus?: boolean;
}

export function MobileCalendar({
  selected,
  onSelect,
  disabled,
  placeholder = "Select date",
  className,
  initialFocus = true
}: MobileCalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [tempSelected, setTempSelected] = React.useState<Date | undefined>(selected);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    setTempSelected(selected);
  }, [selected]);

  const handleSelect = (date: Date | undefined) => {
    if (isMobile) {
      setTempSelected(date);
    } else {
      onSelect?.(date);
      setOpen(false);
    }
  };

  const handleConfirm = () => {
    onSelect?.(tempSelected);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selected);
    setOpen(false);
  };

  const displayDate = selected ? format(selected, 'EEEE, MMMM do, yyyy') : placeholder;
  const isDisabled = disabled && selected ? disabled(selected) : false;

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start h-12 text-left border-2 border-gray-200 hover:border-gray-300 focus:border-purple-400 bg-white",
            isDisabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => !isDisabled && setOpen(true)}
          disabled={isDisabled}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
          <span className={selected ? "text-gray-900" : "text-gray-500"}>
            {displayDate}
          </span>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="h-[80vh] flex flex-col">
            <SheetHeader className="flex-shrink-0">
              <SheetTitle className="text-center text-lg">Select Date</SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-auto py-4">
              <div className="flex justify-center">
                <CalendarPrimitive
                  mode="single"
                  selected={tempSelected}
                  onSelect={handleSelect}
                  disabled={disabled}
                  initialFocus={initialFocus}
                  className="rounded-md border-0 p-0"
                  classNames={{
                    months: "flex flex-col sm:flex-row gap-4",
                    month: "flex flex-col gap-4 w-full",
                    caption: "flex justify-center pt-2 relative items-center w-full mb-4",
                    caption_label: "text-lg font-semibold text-gray-900",
                    nav: "flex items-center gap-1",
                    nav_button: cn(
                      "size-10 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 p-0 rounded-md border",
                    ),
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse table-fixed",
                    head_row: "flex w-full",
                    head_cell: "text-gray-600 font-medium text-base w-12 h-12 flex items-center justify-center uppercase tracking-wide",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-md transition-colors",
                    day: cn(
                      "w-12 h-12 p-0 font-normal text-base flex items-center justify-center rounded-md transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1",
                    ),
                    day_range_start: "aria-selected:bg-purple-600 aria-selected:text-white aria-selected:hover:bg-purple-700",
                    day_range_end: "aria-selected:bg-purple-600 aria-selected:text-white aria-selected:hover:bg-purple-700",
                    day_selected: "bg-purple-600 text-white hover:bg-purple-700 focus:bg-purple-700",
                    day_today: "bg-blue-50 text-blue-700 font-semibold border border-blue-200",
                    day_outside: "text-gray-400 opacity-50 hover:bg-gray-50",
                    day_disabled: "text-gray-300 opacity-30 cursor-not-allowed hover:bg-transparent",
                    day_range_middle: "aria-selected:bg-purple-100 aria-selected:text-purple-900",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </div>

            <div className="flex-shrink-0 flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-12 text-base"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 h-12 text-base bg-purple-600 hover:bg-purple-700"
                disabled={!tempSelected}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop version with Popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start h-12 text-left border-2 border-gray-200 hover:border-gray-300 focus:border-purple-400 bg-white",
            isDisabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={isDisabled}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
          <span className={selected ? "text-gray-900" : "text-gray-500"}>
            {displayDate}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarPrimitive
          mode="single"
          selected={selected}
          onSelect={(date: Date | undefined) => {
            onSelect?.(date);
            setOpen(false);
          }}
          disabled={disabled}
          initialFocus={initialFocus}
        />
      </PopoverContent>
    </Popover>
  );
}