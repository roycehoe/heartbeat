import "@fontsource/ibm-plex-mono"; // Optional import for code font
import "inter-ui/inter.css"; // Import the font
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Extend the Chakra UI theme to force light mode
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
