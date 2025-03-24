
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  onChange: (value: DateRange) => void;
  placeholder?: string;
  align?: "center" | "start" | "end";
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = "Select date range",
  align = "start",
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  // Update internal state when the value prop changes
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  // Update the parent component's state
  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      onChange(selectedDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const nextWeek = addDays(today, 7);
                const newRange = { from: today, to: nextWeek };
                setDate(newRange);
                onChange(newRange);
              }}
            >
              Next 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const nextMonth = new Date(today);
                nextMonth.setMonth(today.getMonth() + 1);
                const newRange = { from: today, to: nextMonth };
                setDate(newRange);
                onChange(newRange);
              }}
            >
              Next month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDate(undefined);
                onChange({});
              }}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
