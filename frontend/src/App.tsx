import { Box } from "@chakra-ui/react";
import { ThemeProvider } from "@opengovsg/design-system-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
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
            <Route path="/admin" element={<Admin />}></Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
