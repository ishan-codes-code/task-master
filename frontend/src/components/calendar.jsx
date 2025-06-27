import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useState } from "react";

export default function Calendar({ selectDate, setSelectDate }) {
  // const [selectDate, setSelectDate] = useState(new Date());

  return (
    <div className="w-fit bg-white p-4 border rounded-lg shadow-lg border-gray-200 flex items-center justify-center border">
      <DayPicker
        animate
        mode="single"
        selected={selectDate}
        onSelect={setSelectDate}
        classNames={{
          day: "rounded-md transition-all duration-200 ease-in-out hover:bg-purple-100 hover:text-purple-700 font-semibold text-sm",
          today: `text-[#7C3AED]`, // Add a border to today's date
          selected: `bg-[#7C3AED]  text-white `, // Highlight the selected day
          day_outside: "text-gray-400",
        }}
      />
    </div>
  );
}
