import { Box, Text } from "@chakra-ui/react";

function Coins(props: { coinCount: number }) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      gap="8px"
      alignItems="center"
      mr="24px"
    >
      <img src="/src/assets/coin.svg"></img>
      <Text fontWeight={800}>{props.coinCount}</Text>
    </Box>
  );
}

export default Coins;
