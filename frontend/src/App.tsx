import { Box } from "@chakra-ui/react";
import { ThemeProvider } from "@opengovsg/design-system-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Caregiver from "@/pages/Caregiver";
import ModalCreateCareReceipient from "@/pages/Caregiver/CreateCareReceipient";
import { HowDoesItWork } from "@/pages/Caregiver/HowDoesItWork";
import { Settings } from "@/pages/Caregiver/Settings";
import CareReceipientDetail from "@/pages/Caregiver/CareReceipientDetail";
import CareReceipientSettings from "@/pages/Caregiver/CareReceipientSettings";
import HomePage from "@/pages/HomePage";
import LogIn from "@/pages/Login.tsx/Index";
import MagicLinkVerify from "@/pages/MagicLinkVerify";
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
              <Route path="/" element={<HomePage />} />
              <Route path="/login/:token" element={<MagicLinkVerify />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/dashboard" element={<Caregiver />} />
              <Route path="/dashboard/care-receipient/:careReceipientId" element={<CareReceipientDetail />} />
              <Route
                path="/dashboard/care-receipient/:careReceipientId/settings"
                element={<CareReceipientSettings />}
              />
              <Route path="/dashboard/create-care-receipient" element={<ModalCreateCareReceipient />} />
              <Route path="/dashboard/about" element={<HowDoesItWork />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
