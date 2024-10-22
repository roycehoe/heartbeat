import { Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function Coins(props: { coinCount: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>(
    new Audio("/assets/alarm.mp3")
  );

  useEffect(() => {
    const audioElement = new Audio("/assets/alarm.mp3");
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
    <Box display="flex" flexDirection="column" justifyContent="center">
      <Box display="flex" alignItems="center" gap="8px">
        <button onClick={toggleAlarm}>
          <Image boxSize="24px" src="/assets/coin.svg"></Image>
        </button>
        <Text fontWeight={800} fontSize="md">
          {props.coinCount}
        </Text>
      </Box>
    </Box>
  );
}

export default Coins;
