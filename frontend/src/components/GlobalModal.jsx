import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const GlobalModal = ({ timeout = 10, inactivityTime = 300 }) => {
  const { logout } = useAuth();
  const [count, setCount] = useState(timeout);
  const [show, setShow] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Reset inactivity timer on user activity
  useEffect(() => {
    const resetTimer = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  // Check inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      if (!show && Date.now() - lastActivity > inactivityTime * 1000) {
        setShow(true); // Show modal after inactivity
        setCount(timeout);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, show, inactivityTime, timeout]);

  // Countdown logic
  useEffect(() => {
    if (!show) return;
    if (count === 0) {
      logout();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, show, logout]);

  const handleStay = () => {
    setShow(false);
    setLastActivity(Date.now());
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Session Timeout</h2>
        <p className="mb-4">
          You will be logged out in <strong>{count}</strong> seconds due to inactivity.
        </p>
        <button
          onClick={handleStay}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
};

export default GlobalModal;
