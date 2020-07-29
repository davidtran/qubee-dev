import React, { useRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../../assets/scss/app/FileUploader.scss";
import fileSizeConversion from "../../utils/fileSizeConversion";
import { ReactComponent as ProcessingSvg } from "../../assets/img/icons/file-uploader/upload-processing.svg";
import { ReactComponent as CancelSvg } from "../../assets/img/icons/file-uploader/upload-cancel.svg";
import { ReactComponent as RetrySvg } from "../../assets/img/icons/file-uploader/upload-retry.svg";

const FileUploader = ({
  onSelectFiles,
  retryUpload,
  removeUpload,
  statuses,
}) => {
  const inputEl = useRef();
  const dropLabelEl = useRef();

  async function onChange(e) {
    e.preventDefault();
    if (e.target.validity.valid) {
      onSelectFiles(e.target.files);
    }
    return false;
  }

  return (
    <div
      className="file-uploader"
      ref={dropLabelEl}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer && e.dataTransfer.files) {
          onSelectFiles(e.dataTransfer.files);
        }
        return false;
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="file-uploader--wrapper">
        <input
          type="file"
          className="file-uploader--browser"
          multiple
          ref={inputEl}
          onChange={onChange}
        />
        <div className="file-uploader--drop-label">
          <label
            htmlFor="file-uploader--browser"
            id="file-uploader--drop-label"
          >
            Drag &amp; Drop your files or{" "}
            <span
              className="file-uploader--label-action"
              tabIndex="0"
              onClick={() => {
                inputEl.current.value = null;
                inputEl.current.click();
              }}
            >
              Browse
            </span>
          </label>
        </div>
        <div className="file-uploader--scroller">

            <TransitionGroup className="file-uploader--file-list">
              {Object.values(statuses).map((item) => (

                  <CSSTransition timeout={500} classNames="file-uploader--item-animation" key={item.file.name}>
                    <div
                      className={`file-uploader--item ${
                        item.isUploading
                          ? "uploading"
                          : item.error
                          ? "error"
                          : "success"
                      }`}
                    >
                      {item.isUploading && (
                        <div className="file-uploader--item-content">
                          <div
                            className="file-uploader--file-info"
                            data-align="left"
                          >
                            <div className="file-uploader-info-text-main">
                              {item.file.name}
                            </div>
                            <div className="file-uploader-info-text-sub">
                              {fileSizeConversion(item.file.size)}
                            </div>
                          </div>
                          <div
                            className="file-uploader--file-info"
                            data-align="right"
                          >
                            <div className="file-uploader-info-text-main">
                              Uploading{" "}
                              {item.progress > 0 && `${item.progress}%`}
                            </div>
                            <div
                              className="file-uploader-info-text-sub"
                              onClick={() => removeUpload(item.file)}
                            >
                              tap to cancel
                            </div>
                          </div>
                          <button
                            className="file-uploader--file-action-button"
                            data-align="right"
                          >
                            <div className="process-indicator">
                              <ProcessingSvg />
                            </div>
                          </button>
                        </div>
                      )}

                      {item.success && (
                        <div className="file-uploader--item-content">
                          <div
                            className="file-uploader--file-info"
                            data-align="left"
                          >
                            <div className="file-uploader-info-text-main">
                              {item.file.name}
                            </div>
                            <div className="file-uploader-info-text-sub">
                              {fileSizeConversion(item.file.size)}
                            </div>
                          </div>
                          <div
                            className="file-uploader--file-info"
                            data-align="right"
                          >
                            <div className="file-uploader-info-text-main">
                              Upload complete
                            </div>
                            <div
                              className="file-uploader-info-text-sub"
                              onClick={() => removeUpload(item.file)}
                            >
                              tap to undo
                            </div>
                          </div>
                          <button
                            className="file-uploader--file-action-button"
                            data-align="right"
                            onClick={() => removeUpload(item.file)}
                          >
                            <CancelSvg />
                          </button>
                        </div>
                      )}

                      {item.error && (
                        <div className="file-uploader--item-content">
                          <button
                            className="file-uploader--file-action-button"
                            data-align="left"
                            onClick={() => removeUpload(item.file)}
                          >
                            <CancelSvg />
                          </button>
                          <div
                            className="file-uploader--file-info"
                            data-align="left"
                          >
                            <div className="file-uploader-info-text-main">
                              {item.file.name}
                            </div>
                            <div className="file-uploader-info-text-sub">
                              {fileSizeConversion(item.file.size)}
                            </div>
                          </div>
                          <div
                            className="file-uploader--file-info"
                            data-align="right"
                          >
                            <div className="file-uploader-info-text-main">
                              Error during upload
                            </div>
                            <div
                              className="file-uploader-info-text-sub"
                              onClick={() => retryUpload(item.file)}
                            >
                              tap to retry
                            </div>
                          </div>
                          <button
                            className="file-uploader--file-action-button"
                            data-align="right"
                            onClick={() => retryUpload(item.file)}
                          >
                            <RetrySvg />
                          </button>
                        </div>
                      )}
                    </div>
                  </CSSTransition>

              ))}
            </TransitionGroup>

        </div>
        <div className="file-uploader--drip"></div>
      </div>
    </div>
  );
};

export default FileUploader;
