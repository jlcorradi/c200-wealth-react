import React from "react";
import { NotificationManager } from "react-notifications";
import { http } from "../Http";
import LoaderAndEmptyWrapper from "./LoaderAndEmptyWrapper";

function Interop() {
  const [fileType, setFileType] = React.useState();
  const [file, setFile] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [logs, setLogs] = React.useState([]);

  return (
    <>
      <div className="titlebar border-bottom">
        <h3>Interoperability</h3>
        <div className="w400">
          <select
            placeholder="Select File Type"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value="" disabled selected>
              Select File Type
            </option>
            <option value="B3_STATEMENT">B3 Statement</option>
          </select>
        </div>
      </div>

      <div className="padding flex flex-1 flex-column">
        <LoaderAndEmptyWrapper
          isEmpty={false}
          isLoading={isLoading}
          loadingMessage="Processing file"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!fileType) {
                NotificationManager.error("Please, select a File Type.");
                return;
              }

              if (!file) {
                NotificationManager.error("Please, select a file to upload.");
                return;
              }

              let formData = new FormData();
              formData.set("file", file);
              setIsLoading(true);
              setLogs([]);
              http
                .post(`/api/v1/system/interop/${fileType}`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                })
                .then(({ data }) => setLogs(data))
                .finally(() => setIsLoading(false));
            }}
          >
            <div className="form-group">
              <input
                type="file"
                name="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            {logs.length > 0 ? (
              <div className="flex flex-column flex-1 padding border italic well">
                {logs.map((i, idx) => (
                  <span key={idx}>{i}</span>
                ))}
              </div>
            ) : null}
            <div className="buttons">
              <input
                type="submit"
                value="Upload File"
                disabled={!file && !fileType}
              />
            </div>
          </form>
        </LoaderAndEmptyWrapper>
      </div>
    </>
  );
}

export default Interop;
