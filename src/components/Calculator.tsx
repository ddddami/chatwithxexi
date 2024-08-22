import { useState } from "react";

const Calculator = () => {
  const [input, setInput] = useState<string>("");

  const handleButtonClick = (value: string) => {
    console.log(value);
    setInput((prev) => prev + value);
  };

  const calculateResult = () => {
    try {
      setInput(eval(input));
    } catch {
      setInput("Error");
    }
  };

  const clearInput = () => setInput("");

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <div className="mb-4 p-2 border rounded-lg text-right text-2xl">
        {input || "0"}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {["7", "8", "9", "/"].map((val) => (
          <button
            key={val}
            onClick={() => handleButtonClick(val)}
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            {val}
          </button>
        ))}
        {["4", "5", "6", "*"].map((val) => (
          <button
            key={val}
            onClick={() => handleButtonClick(val)}
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            {val}
          </button>
        ))}
        {["1", "2", "3", "-"].map((val) => (
          <button
            key={val}
            onClick={() => handleButtonClick(val)}
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            {val}
          </button>
        ))}
        {["0", ".", "=", "+"].map((val) => (
          <button
            key={val}
            onClick={() =>
              val === "=" ? calculateResult() : handleButtonClick(val)
            }
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            {val}
          </button>
        ))}
        <button
          onClick={clearInput}
          className="col-span-4 bg-red-400 text-white p-4 rounded-lg hover:bg-red-500 cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Calculator;
