import { Box, Image } from "@chakra-ui/react";

import { useClerk } from "@clerk/clerk-react";
import { useRef, useState } from "react";
import ModalLogOut from "./ModalLogout";

function Brand(props: { goToNextUser: () => void }) {
  const [_, setClickCount] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { signOut } = useClerk();

  const handleClick = () => {
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        setClickCount(0); // reset count after 10s
        timerRef.current = null; // clear timer reference
      }, 10000);
    }

    setClickCount((prev) => {
      const newCount = prev + 1;

      if (newCount === 10) {
        setIsLogoutModalOpen(true);
        setClickCount(0);
        clearTimeout(timerRef.current);
        timerRef.current = null;
        return 0;
      }

      return newCount;
    });
  };
  const logoutUser = () => {
    localStorage.removeItem("token");
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
