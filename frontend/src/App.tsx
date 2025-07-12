import { Box } from "@chakra-ui/react";
import { ThemeProvider } from "@opengovsg/design-system-react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import ModalCreateUser from "./pages/Admin/CreateUser";
import { HowDoesItWork } from "./pages/Admin/HowDoesItWork";
import UserDetail from "./pages/Admin/UserDetail";
import UserSettings from "./pages/Admin/UserSettings";
import HomePage from "./pages/HomePage";
import LogIn from "./pages/LogIn";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
          >
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/:userId" element={<UserDetail />} />
              <Route
                path="/admin/:userId/settings"
                element={<UserSettings />}
              />
              <Route path="/admin/create-user" element={<ModalCreateUser />} />
              <Route path="/admin/about" element={<HowDoesItWork />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
