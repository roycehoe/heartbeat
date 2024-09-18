import { ChevronLeftIcon, DownloadIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/react";
import { Button } from "@opengovsg/design-system-react";

const QRCodeResult = ({
  setIsShowQRCodeResult: setIsShowQRCodeResult,
  resetCalendarForm: resetCalendarForm,
}) => {
  const handleSaveImage = () => {
    const link = document.createElement("a");
    link.href = "src/assets/Untitled 1.png"; // Replace with your image URL
    link.download = "calendar-invite.jpg";
    link.click();
  };
  return (
    <>
      <Button
        variant="outline"
        leftIcon={<ChevronLeftIcon></ChevronLeftIcon>}
        onClick={() => setIsShowQRCodeResult(false)}
      >
        Back
      </Button>
      <Image src="src/assets/Untitled 1.png" alt="wee"></Image>
      <Button
        variant="outline"
        leftIcon={<DownloadIcon></DownloadIcon>}
        onClick={handleSaveImage}
      >
        Save image
      </Button>
    </>
  );
};

export default QRCodeResult;
