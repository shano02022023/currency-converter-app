interface NumInputProps {
  label?: string;
  placeholder: string;
  isDisabled?: boolean;
  inputValue: number | null;
  setInputValue: (value: number | null) => void;
}

const NumInput = ({
  label,
  placeholder,
  isDisabled,
  inputValue,
  setInputValue,
}: NumInputProps) => {
  return (
    <div className="flex flex-col items-start justify-start gap-2">
      {label && (
        <label className="label dark:text-white text-dark">{label}</label>
      )}

      <input
        type="number"
        step={0.01}
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs"
        disabled={isDisabled}
        value={inputValue ?? ""}
        min={1}
        onChange={(e) => {
          setInputValue(e.target.value === "" ? null : parseFloat(e.target.value));
        }}
        required
      />
    </div>
  );
};

export default NumInput;
