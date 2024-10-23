import { Box, Text } from "@chakra-ui/react";
import {
  Banner,
  RestrictedGovtMasthead,
  ThemeProvider,
} from "@opengovsg/design-system-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OgpFooter from "./components/OgpFooter";
import HomePage from "./pages/HomePage";
import LogIn from "./pages/LogIn";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Box width="100vw" height="100vh" display="flex" flexDirection="column">
          <Routes>
            <Route index element={<HomePage />}></Route>
            <Route path="/login" element={<LogIn />}></Route>
          </Routes>
          <OgpFooter></OgpFooter>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
