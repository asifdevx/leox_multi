import { cn } from "@/utils/cn";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  onDurationChange: (seconds: number) => void;
};

export default function AuctionDurationPicker({ onDurationChange }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("12:00");

  // Handle date click
  const handleDateSelect = (date?: Date) => {
    console.log(selectedDate,selectedTime);
    
    setSelectedDate(date);
    if (date) calculateDuration(date, selectedTime);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setSelectedTime(time);
    if (selectedDate) calculateDuration(selectedDate, time);
  };

  // Calculate duration in seconds
  const calculateDuration = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes, 0, 0);
    const diffSeconds = Math.floor((selectedDateTime.getTime() - Date.now()) / 1000);
    onDurationChange(diffSeconds > 0 ? diffSeconds : 0);
  };

  // Deselect button handler
  const handleDeselect = () => {
    setSelectedDate(undefined);
    onDurationChange(0); // reset seconds
  };

  return (
    <div className="space-y-3 max-w-fit mx-auto">
    

      {/* Calendar */}
      <div className="w-full overflow-x-auto mx-auto">
        
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className={cn(
          "rounded-xl border border-transparent bg-[#1a1b2e] text-white "
        )}
        modifiers={{ selected: selectedDate ? selectedDate : undefined }}
        modifiersClassNames={{
          selected: "border-2 rounded-full border-transparent bg-purple-800",
          
        }}
        
      />

          </div>
      {/* Time picker */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
          className="bg-[#1f2847] border border-purple-600 rounded-md text-white p-2"
        />
        {selectedDate && (
          <p className="text-sm text-gray-400">
            Selected:{" "}
            <span className="text-purple-400">
              {selectedDate.toDateString()} {selectedTime}
            </span>
          </p>
        )}
      </div>

      {/* Deselect button */}
      {selectedDate && (
        <button
          onClick={handleDeselect}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Deselect Date
        </button>
      )}
    </div>
  );
}
