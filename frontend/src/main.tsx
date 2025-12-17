import { ClerkProvider } from "@clerk/clerk-react";
import "@fontsource/ibm-plex-mono"; // Optional import for code font
import "inter-ui/inter.css"; // Import the font
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const PUBLISHABLE_KEY = "pk_test_cHJvbW90ZWQtdGVycmFwaW4tNDkuY2xlcmsuYWNjb3VudHMuZGV2JA"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Extend the Chakra UI theme to force light mode
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
