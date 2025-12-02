"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

import "react-day-picker/dist/style.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        button_previous: "h-6 w-6 opacity-50 hover:opacity-100 transition",
        button_next: "h-6 w-6 opacity-50 hover:opacity-100 transition",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 text-[0.8rem] font-normal",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center",
        day: "h-9 w-9 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
        day_today: "bg-accent text-accent-foreground",
        ...classNames,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
