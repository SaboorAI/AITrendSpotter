import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Configure fonts
document.documentElement.style.setProperty('--font-sans', '"Inter", "SF Pro Display", sans-serif');

createRoot(document.getElementById("root")!).render(<App />);
