import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <span className="head">
            <img src="team.png" id="icon" alt="Icon" />
            <h1>
              <span className="livelink">LIVELINK</span>-Realtime Chat
            </h1>
          </span>
          <Chat />
          <h2>
            Share the link to get connected!
          </h2>
        </div>
      )}
    </>
  );
}

export default App;
