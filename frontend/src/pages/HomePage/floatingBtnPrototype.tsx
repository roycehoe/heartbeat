import { Box } from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";

function FloatingBtnPrototype() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      className="page"
    >
      <Box
        display="grid"
        gridTemplateColumns="repeat(10, 1fr)"
        gridTemplateRows="repeat(10, 1fr)"
        width="100%"
        height="100%"
        maxWidth="500px"
        maxHeight="500px"
        backgroundImage="url('/src/assets/tree/adult-tree-with-flowers.svg')"
        // backgroundSize="cover"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        position="relative"
        backgroundPosition="center right"
      >
        {/* Button 1x3 */}
        <Button
          position="absolute"
          top="10%"
          left="10%"
          backgroundColor="rgba(255, 255, 255, 0.8)"
          border="1px solid black"
        >
          Button 1x3
        </Button>

        {/* Button 5x5 */}
        <Button
          position="absolute"
          top="30%"
          left="0%"
          backgroundColor="rgba(255, 255, 255, 0.8)"
          border="1px solid black"
        >
          Button 5x5
        </Button>

        {/* Button 7x2 */}
        <Button
          position="absolute"
          top="40%"
          left="90%"
          backgroundColor="rgba(255, 255, 255, 0.8)"
          border="1px solid black"
        >
          Button 7x2
        </Button>
      </Box>
    </Box>
  );
}

export default FloatingBtnPrototype;
