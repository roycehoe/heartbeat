import { useState } from "react";
import useCalendarForm from "../../hooks/useCalendarForm";
import CalendarForm from "./CalendarForm";
import PhotoUpload from "./PhotoUpload";
import QRCodeResult from "./QRCodeResult";

const HomePage = () => {
  const useCalendarFormHook = useCalendarForm();
  const [isShowQRCodeResult, setIsShowQRCodeResult] = useState(true);

  if (isShowQRCodeResult) {
    return (
      <QRCodeResult
        setIsShowQRCodeResult={setIsShowQRCodeResult}
        resetCalendarForm={useCalendarFormHook.resetCalendarForm}
      ></QRCodeResult>
    );
  }
  return (
    <div>
      <PhotoUpload
        updateCalendarForm={useCalendarFormHook.updateCalendarForm}
      ></PhotoUpload>
      <CalendarForm
        useCalendarFormHook={useCalendarFormHook}
        setIsShowQRCodeResult={setIsShowQRCodeResult}
      ></CalendarForm>
    </div>
  );
};

export default HomePage;
