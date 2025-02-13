"use client";

import { useState, useEffect } from "react";
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
  const [filterDate, setFilterDate] = useState<string | null>(
    new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [filterCurrency, setFilterCurrency] = useState<string | null>("PHP");
  const [commaSeperatedCurrencies, setCommaSeperateCurrencies] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get(
          `https://api.freecurrencyapi.com/v1/currencies?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}`
        );

        setCurrencies(Object.values(res.data.data));
        setCommaSeperateCurrencies(Object.values(res.data.data).join(","));

        const currenciesObject = res.data.data;

        // Convert the object to an array
        const currenciesArray = Object.keys(currenciesObject).map((key) => ({
          code: key,
          ...currenciesObject[key],
        }));

        console.log(currenciesArray);

        const codes = currenciesArray
          .slice(0, 3)
          .map((item: Currency) => item.code)
          .join(",");

        setCommaSeperateCurrencies(codes);

        console.log("Currencies:", commaSeperatedCurrencies);

        // console.log("Currencies:", res.data.data);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, [commaSeperatedCurrencies]);

  useEffect(() => {
    const fetchHistoricalRates = async () => {
      try {
        if(commaSeperatedCurrencies === null) return;

        const res = await axios.get(
          `https://api.freecurrencyapi.com/v1/historical?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}&date=${filterDate}&base_currency=${filterCurrency}`
        );
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching historical rates:", error);
      }
    };
    fetchHistoricalRates();
  }, [filterCurrency, filterDate, commaSeperatedCurrencies]);

  const convertAmount = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}&base_currency=${baseCurrency}&currencies=${targetCurrency}`
      );
      const rate = res.data.data[targetCurrency ?? ""];
      // setResult(valueToConvert ? valueToConvert * rate : null);
      setResult(rate ? (valueToConvert ? valueToConvert * rate : null) : null);
      console.log(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error converting amount:", error);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-start h-screen pt-10">
      <h1 className="font-bold text-xl dark:text-white text-dark">
        Currency Converter
      </h1>
      <div className="flex sm:flex-row flex-col items-between justify-between gap-10">
        <div className="w-full">
          <h1>Historical Exchange Rates</h1>
          <div className="flex lg:flex-row flex-col gap-2">
            <input
              type="date"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              max={
                new Date(new Date().setDate(new Date().getDate() - 1))
                  .toISOString()
                  .split("T")[0]
              }
              value={
                filterDate ??
                new Date(new Date().setDate(new Date().getDate() - 1))
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) => {
                setFilterDate(e.target.value);
              }}
            />
            <SelectInput
              selected={filterCurrency}
              setSelected={setFilterCurrency}
              options={currencies}
            />
          </div>
        </div>
        <div className="w-full">
          <form
            className="flex flex-col gap-3 items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              convertAmount();
            }}
          >
            <div className="flex lg:flex-row flex-col gap-2">
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
                {isLoading ? "Converting..." : "Convert"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <div className="flex flex-col items-start justify-start">
        <label htmlFor="result">Result:</label>
        <p className="dark:text-white text-dark">1 USD = 0.85 EUR</p>
        <p className="dark:text-white text-dark">1 USD = 0.73 GBP</p>
      </div> */}
    </div>
  );
}
