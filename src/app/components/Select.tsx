"use client";
import { Currency } from "../types/currency";
import { useEffect, useState, useRef } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface SelectInputProps {
  label: string;
  options: Currency[];
  selected: string | null;
  setSelected: (value: string | null) => void;
}

const SelectInput = ({
  options,
  label,
  selected,
  setSelected,
}: SelectInputProps) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrencies(options);
  }, [options]);

  const filterCurrencies = () => {
    if (searchTerm === "") {
      setCurrencies(options);
    } else {
      const filteredCurrencies = options.filter((currency) =>
        currency.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCurrencies(filteredCurrencies);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCollapsed(true);
      }
    };

    // Add event listener when dropdown is open
    if (!isCollapsed) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener when dropdown is closed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed]);

  return (
    <div ref={dropdownRef} className="relative w-full max-w-xs">
      <label className="block text-sm font-medium dark:text-white text-dark mb-1">
        {label}
      </label>

      <div
        className="flex items-center justify-between w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-gray-700 dark:text-gray-200">
          {selected ?? "Select currency"}
        </span>
        {isCollapsed ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        ) : (
          <ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        )}
      </div>

      {!isCollapsed && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform scale-100 opacity-100">
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                filterCurrencies();
              }}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            />
          </div>
              
          {/* Currency List */}
          <ul className="max-h-40 overflow-y-auto">
            {currencies.length > 0 ? (
              currencies.map((currency, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => {
                    setSelected(currency.code);
                    setIsCollapsed(true);
                  }}
                >
                  {currency.name} ({currency.symbol})
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectInput;
