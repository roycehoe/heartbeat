import { Box, Image } from "@chakra-ui/react";

import { useClerk } from "@clerk/clerk-react";
import { useRef, useState } from "react";
import ModalLogOut from "@/components/ModalLogout";

function Brand() {
  const [_, setClickCount] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { signOut } = useClerk();

  const handleClick = () => {
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        setClickCount(0);
        timerRef.current = null;
      }, 10000);
    }

    setClickCount((prev) => {
      const newCount = prev + 1;

      if (newCount === 10) {
        setIsLogoutModalOpen(true);
        setClickCount(0);
        clearTimeout(timerRef.current ?? undefined);
        timerRef.current = null;
        return 0;
      }

      return newCount;
    });
  };
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("clerk_token");
    signOut({ redirectUrl: "/login" });
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      alignItems="center"
      gap={1}
    >
      <Image
        onClick={handleClick}
        src="/assets/logo-heartbeat.svg"
        width="128px"
      ></Image>
      <ModalLogOut
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logoutUser}
      ></ModalLogOut>
    </Box>
  );
}

export default Brand;
