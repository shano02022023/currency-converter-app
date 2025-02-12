"use client";

import { useState, useEffect, } from "react";
import SelectInput from "./components/Select";
import axios from "axios";
import { Currency } from "./types/currency";
import NumInput from "./components/NumInput";
import DisplayResult from "./components/Result";

export default function Home() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);
  const [targetCurrency, setTargetCurrency] = useState<string | null>(null);
  const [valueToConvert, setValueToConvert] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get(
          `https://api.freecurrencyapi.com/v1/currencies?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}`
        );
        setCurrencies(Object.values(res.data.data));

        // console.log("Currencies:", res.data.data);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  const convertAmount = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}&base_currency=${baseCurrency}&currencies=${targetCurrency}`
      );
      const rate = res.data.data[targetCurrency??""];
      // setResult(valueToConvert ? valueToConvert * rate : null);
      setResult(rate ? valueToConvert ? valueToConvert * rate : null : null);
      console.log(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error converting amount:", error);
    }
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen w-full">
      <h1 className="font-bold text-xl dark:text-white text-dark">
        Currency Converter
      </h1>
      <form
        className="flex flex-col gap-3 items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          convertAmount();
        }}
      >
        <div className="flex sm:flex-row flex-col gap-2">
          <div className="flex flex-col gap-2">
            <SelectInput
              selected={baseCurrency}
              setSelected={setBaseCurrency}
              options={currencies}
              label="Base Currency:"
            />
            <NumInput
              inputValue={valueToConvert}
              setInputValue={setValueToConvert}
              placeholder="Enter amount to convert"
            />
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              selected={targetCurrency}
              setSelected={setTargetCurrency}
              options={currencies}
              label="Target Currency:"
            />
            <DisplayResult result={result} />
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          <button type="submit" className="btn btn-info w-auto">
            {
              isLoading ? "Converting..." : "Convert"
            }
          </button>
        </div>
      </form>
      {/* <div className="flex flex-col items-start justify-start">
        <label htmlFor="result">Result:</label>
        <p className="dark:text-white text-dark">1 USD = 0.85 EUR</p>
        <p className="dark:text-white text-dark">1 USD = 0.73 GBP</p>
      </div> */}
    </div>
  );
}
