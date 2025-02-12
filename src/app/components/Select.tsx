"use client";
import { Currency } from "../types/currency";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setCurrencies(options);
  }, [options]);
  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <label className="label dark:text-white text-dark">{label}</label>
      <select
        defaultValue={selected ?? ""}
        onChange={(e) => {
          setSelected(e.target.value ? e.target.value : null);
        }}
        className="select select-bordered w-full max-w-xs"
        required
      >
        <option value="" disabled>
          Choose a currency
        </option>
        {currencies.map((currency, index) => (
          <option key={index} value={currency.code}>
            {currency.name} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
