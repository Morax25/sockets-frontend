import { useEffect, useRef, useState } from "react";
import "./index.css";

const App = () => {
  const length = 6;
  const [otp, setOTP] = useState(new Array(length).fill(""));
  const inputRef = useRef([]);
  useEffect(() => {}, [length]);

  const onChange = (e, i) => {
    const { value } = e.target;
    const cleanValue = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[i] = cleanValue;
    setOTP(newOtp);
    if (cleanValue) {
      inputRef.current[i + 1]?.focus();
    }
  };
  console.log(otp);

  const handleKeyChange = (e, i) => {
    if (e.key !== "Backspace") return;

    if (e.ctrlKey && e.key === "Backspace") {
      e.preventDefault();
      setOTP(new Array(length).fill(""));
      inputRef.current[0]?.focus();
      return;
    }

    const newOtp = [...otp];
    if (otp[i]) {
      newOtp[i] = "";
      setOTP(newOtp);
    } else if (i > 0) {
      inputRef.current[i - 1]?.focus();
      newOtp[i - 1] = "";
      setOTP(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text");
    const filteredValue = data.replace(/\D/g, "").slice(0, length);
    const newOtp = new Array(length).fill("");
    filteredValue.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOTP(newOtp);
    // move focus to last filled box
    const lastIndex = filteredValue.length - 1;
    if (lastIndex >= 0) {
      inputRef.current[lastIndex]?.focus();
    }
  };

  return (
    <>
      <h1 className="underline text-2xl font-monospace uppercase ml-1 mb-5">
        Interview techincal questions
      </h1>
      <div className="m-5 flex gap-3 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRef.current[index] = el;
            }}
            onChange={(e) => onChange(e, index)}
            value={otp[index]}
            maxLength={1}
            onKeyDown={(e) => handleKeyChange(e, index)}
            onPaste={handlePaste}
            className="
        w-14 h-14
        rounded-2xl
        text-center text-xl font-bold
        bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100
        border-2 border-transparent
        focus:border-transparent focus:ring-4 focus:ring-pink-400
        shadow-lg hover:scale-105 hover:shadow-xl
        transition-all duration-300 ease-in-out
        outline-none
      "
          />
        ))}
      </div>
    </>
  );
};

export default App;
