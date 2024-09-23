import { Box } from "@chakra-ui/react";
import { Calendar } from "react-multi-date-picker";

function HomePage() {
  const dateRanges: Date[] = [
    new Date(2024, 9, 19),
    new Date(2024, 9, 20),
    new Date(2024, 9, 21),
    new Date(2024, 9, 22),
    new Date(2024, 9, 23),
  ]; // 10/2 to 15/2
  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column">
      <Calendar disabled value={dateRanges}></Calendar>
    </Box>
  );
}

export default HomePage;
