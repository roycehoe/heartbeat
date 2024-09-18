import { Attachment } from "@opengovsg/design-system-react";
import { useState } from "react";

const PhotoUpload = ({ updateCalendarForm: updateCalendarForm }) => {
  const [uploadedFile, setUploadedFile] = useState([] as File[]);
  const getUploadFileResponse = () => {
    console.log("Call the upload file API here");
    console.log("get the response");
    console.log("populate the calendar form");
  };

  return (
    <Attachment
      name="Test-input"
      onChange={(files: File[]) => setUploadedFile(files)}
      value={uploadedFile}
      multiple
    ></Attachment>
  );
};

export default PhotoUpload;
