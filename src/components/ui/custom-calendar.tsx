"use client";

import * as React from "react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CalendarIcon, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { cn } from "./utils";
import { useIsMobile } from "./use-mobile";

interface CustomCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
  // whether the calendar should open initially / receive focus on mount
  initialFocus?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function CalendarGrid({ 
  currentDate, 
  selected, 
  onSelect, 
  disabled, 
  isMobile 
}: { 
  currentDate: Date;
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  isMobile: boolean;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selected ? isSameDay(day, selected) : false;
      const isDayToday = isToday(day);
      const isDisabled = disabled ? disabled(day) : false;

      days.push(
        <div
          key={day.getTime()}
          className={cn(
            "relative cursor-pointer select-none transition-all duration-200",
            isMobile ? "h-12 w-full" : "h-10 w-10",
            "flex items-center justify-center rounded-lg border border-transparent",
            isCurrentMonth ? "text-gray-900" : "text-gray-400",
            isSelected && "bg-purple-600 text-white border-purple-600 shadow-lg scale-105",
            !isSelected && !isDisabled && "hover:bg-gray-100 hover:border-gray-200",
            isDayToday && !isSelected && "bg-blue-50 text-blue-700 border border-blue-200 font-medium",
            isDisabled && "opacity-30 cursor-not-allowed bg-gray-50"
          )}
          onClick={() => {
            if (!isDisabled && isCurrentMonth) {
              onSelect?.(cloneDay);
            }
          }}
        >
          <span className={cn(
            "transition-all duration-200",
            isMobile ? "text-base" : "text-sm",
            isSelected && "font-medium"
          )}>
            {formattedDate}
          </span>
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute inset-0 rounded-lg bg-purple-600/10 border-2 border-purple-600"></div>
          )}
          
          {/* Today indicator */}
          {isDayToday && !isSelected && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    
    rows.push(
      <div 
        key={day.getTime()} 
        className={cn(
          "grid grid-cols-7",
          isMobile ? "gap-2 mb-2" : "gap-1 mb-1"
        )}
      >
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className={cn(
        "grid grid-cols-7 mb-4",
        isMobile ? "gap-2" : "gap-1"
      )}>
        {WEEKDAYS.map((day) => (
          <div 
            key={day} 
            className={cn(
              "text-center text-gray-600 font-medium uppercase tracking-wide",
              isMobile ? "text-sm py-2" : "text-xs py-1"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div>
        {rows}
      </div>
    </div>
  );
}

export function CustomCalendar({
  selected,
  onSelect,
  disabled,
  placeholder = "Select date",
  className,
  initialFocus,
}: CustomCalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [tempSelected, setTempSelected] = React.useState<Date | undefined>(selected);
  const [currentDate, setCurrentDate] = React.useState(selected || new Date());
  const isMobile = useIsMobile();

  React.useEffect(() => {
    setTempSelected(selected);
  }, [selected]);

  const handleSelect = (date: Date) => {
    if (isMobile) {
      setTempSelected(date);
    } else {
      onSelect?.(date);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (initialFocus) setOpen(true);
  }, [initialFocus]);

  const handleConfirm = () => {
    onSelect?.(tempSelected);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selected);
    setOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const displayDate = selected ? format(selected, 'EEEE, MMMM do, yyyy') : placeholder;
  const shouldDisableButton = !selected && disabled && tempSelected ? disabled(tempSelected) : false;

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start h-12 text-left border-2 border-gray-200 hover:border-gray-300 focus:border-purple-400 bg-white transition-all",
            shouldDisableButton && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => !shouldDisableButton && setOpen(true)}
          disabled={shouldDisableButton}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
          <span className={selected ? "text-gray-900" : "text-gray-500"}>
            {displayDate}
          </span>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
            <SheetHeader className="flex-shrink-0 p-6 pb-4 border-b">
              <SheetTitle className="text-center text-xl">Select Date</SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-auto p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousMonth}
                  className="h-10 w-10 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <h2 className="text-lg font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                  className="h-10 w-10 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <CalendarGrid
                currentDate={currentDate}
                selected={tempSelected}
                onSelect={handleSelect}
                disabled={disabled}
                isMobile={true}
              />
            </div>

            <div className="flex-shrink-0 flex gap-3 p-6 pt-4 border-t bg-white">
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
            "w-full justify-start h-12 text-left border-2 border-gray-200 hover:border-gray-300 focus:border-purple-400 bg-white transition-all",
            shouldDisableButton && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={shouldDisableButton}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
          <span className={selected ? "text-gray-900" : "text-gray-500"}>
            {displayDate}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border shadow-xl" align="start">
        <div className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-base font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <CalendarGrid
            currentDate={currentDate}
            selected={selected}
            onSelect={(date) => {
              onSelect?.(date);
              setOpen(false);
            }}
            disabled={disabled}
            isMobile={false}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}