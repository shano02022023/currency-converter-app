interface DisplayResultProps {
    result: number|null;
    
}

const DisplayResult = ({result}: DisplayResultProps) => {
  return (
    <div>
      <input
        type="number"
        placeholder={"Result"}
        className="input input-bordered w-full max-w-xs"
        disabled={true}
        value={result??""}
      />
    </div>
  );
};

export default DisplayResult;
