import React, { useState, useContext, useEffect } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { Button, Modal } from "reactstrap";
import FilePondPluginFileMetadata from "filepond-plugin-file-metadata";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import { FileContext } from "../../contexts/FileListContext";
import { FileUploadContext } from "../../contexts/FileUploadContext";
import FileUploader from "../Uploader/FileUploader";

registerPlugin(FilePondPluginFileMetadata);

const UploadFile = ({
  buttonLabel,
  buttonIcon,
  modalClassName,
}) => {
  const { uploadFiles, statuses, removeFile, clearFileStatuses } = useContext(FileUploadContext);
  const { folderId } = useContext(FileContext);
  const [modal, setModal] = useState(false);
  const [isUploadStarted, setIsUploadStarted] = useState(false);

  const toggle = () => {
    clearFileStatuses();
    setModal(!modal);
  };

  useEffect(() => {
    if (isUploadStarted && Object.values(statuses).every(item => item.success)) {
      setIsUploadStarted(false);
      setModal(false);
    }
  }, [statuses]);

  async function handleUploadFiles(files) {
    setIsUploadStarted(true);
    try {
      await uploadFiles(files, folderId);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="file-upload-component">
      <Button
        block
        className="mb-3 bg-gradient-cyan"
        color="default"
        type="button"
        onClick={toggle}
      >
        {buttonIcon}
        <span className="btn-inner--text">{buttonLabel}</span>
      </Button>
      <Modal
        className={modalClassName}
        isOpen={modal}
        toggle={toggle}
        backdrop="static"
      >
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            File uploader
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggle}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <FileUploader
            onSelectFiles={files => {
              handleUploadFiles(files);
            }}
            removeUpload={file => removeFile(file)}
            retryUpload={file => handleUploadFiles([file])}
            statuses={statuses}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UploadFile;
