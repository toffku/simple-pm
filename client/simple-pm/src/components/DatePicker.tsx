"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [localDate, setLocalDate] = React.useState<Date>();
  const isControlled = onChange !== undefined;
  const date = isControlled ? value : localDate;
  const handleSelect = isControlled ? onChange : setLocalDate;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
