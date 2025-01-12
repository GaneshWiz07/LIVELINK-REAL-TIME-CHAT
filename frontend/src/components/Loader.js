import React, { useEffect } from "react";

const Loader = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/ldrs/dist/auto/waveform.js";
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <l-waveform size="35" stroke="3.5" speed="1" color="black"></l-waveform>
    </div>
  );
};

export default Loader;
