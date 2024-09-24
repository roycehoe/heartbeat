import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function Coins(props: { coinCount: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>(
    new Audio("/src/assets/alarm.mp3")
  );

  useEffect(() => {
    const audioElement = new Audio("/src/assets/alarm.mp3");
    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);

  const toggleAlarm = () => {
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    audio.loop = true;
    audio.play();
    setIsPlaying(true);
    return;
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-end"
      gap="8px"
      alignItems="center"
      mr="24px"
    >
      <button onClick={toggleAlarm}>
        <img src="/src/assets/coin.svg"></img>
      </button>
      <Text fontWeight={800}>{props.coinCount}</Text>
    </Box>
  );
}

export default Coins;
