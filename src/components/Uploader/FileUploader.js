import React from "react";

const FileUploader = () => {
  const files = [];
  return (
    <div className="file-uploader">
      <div className="file-uploader--wrapper">
        <input type="file" className="file-uploader--browser" multiple />
        <div
          className="file-uploader--drop-label"
        >
          <label
            htmlFor="file-uploader--browser"
            id="file-uploader--drop-label"
          >
            Drag &amp; Drop your files or{" "}
            <span className="file-uploader--label-action" tabindex="0">
              Browse
            </span>
          </label>
        </div>
        <div className="file-uploader--scroller">
          <div className="file-uploader--file-list">
            <div className="file-uploader--item">
              <div className="file-uploader--item-content uploading">
                <div className="file-uploader--file-info">
                  <div className="file-uploader-file-name">
                    my-file.png
                  </div>
                  <div className="file-uploader-file-size">
                    151 KB
                  </div>
                </div>
                <div className="file-uploader--file-info">
                  <div className="file-uploader-file-upload-status">
                    Uploading
                  </div>
                  <div className="file-uploader-file-upload-text">
                    tap to cancel
                  </div>
                </div>
                <div className="file-uploader--upload-spinner">
                  <img />
                </div>

              </div>
              <div className="file-uploader--file-list-item-error"></div>
              <div className="file-uploader--file-list-item-success"></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
