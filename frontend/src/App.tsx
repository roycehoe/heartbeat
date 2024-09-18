import { ThemeProvider } from "@opengovsg/design-system-react";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <ThemeProvider>
      <HomePage></HomePage>
    </ThemeProvider>
  );
};

export default App;
