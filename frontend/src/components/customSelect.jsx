import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({
  options,
  placeholder = "Select an option",
  sortFunctions,
  className,
}) => {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSelect = (option, index) => {
    setSelected(option);
    setOpen(false);
    sortFunctions.forEach((fn, i) => {
      if (i === index) {
        fn();
      }
    });
  };
  useEffect(() => {
    if (options[1] === "Pending") {
      setSelected(options[1]);
    } else {
      setSelected(options[0]);
      sortFunctions[0]();
    }
  }, []);
  return (
    <div className="relative max-w-64 min-w-[120px]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={
          className ||
          "w-full rounded-md text-left text-gray-700 flex justify-end items-center gap-2 hover:border-purple-500 focus:outline-none"
        }
      >
        {selected || <span className="text-gray-400">{placeholder}</span>}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-400 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <ul
          className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto  ${
            open && "fade-enter"
          }`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option, index)}
              className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-gray-700 text-center whitespace-nowrap"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
