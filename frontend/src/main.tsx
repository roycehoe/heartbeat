import { ClerkProvider } from "@clerk/clerk-react";
import "@fontsource/ibm-plex-mono";
import "inter-ui/inter.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { CLERK_PUBLISHABLE_KEY } from "./constants";


if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
