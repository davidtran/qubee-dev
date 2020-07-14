import React, { useState, useContext } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { Button, Modal } from "reactstrap";
import FilePondPluginFileMetadata from "filepond-plugin-file-metadata";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import { FileContext } from "../../contexts/FileListContext";

registerPlugin(FilePondPluginFileMetadata);

const UploadFile = ({
  buttonLabel,
  buttonIcon,
  modalClassName,  
}) => {
  const { uploadFile, uploadFileStatuses, refresh } = useContext(FileContext);
  const [modal, setModal] = useState(false);
  const toggle = () => {    
    setModal(!modal);
  };

  function onChange({
    target: {
      validity,
      files: [file],
    },
  }) {
    if (validity.valid) {      
      uploadFile(new Date().getTime(), file.name, file);      
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
          <input type="file" required onChange={onChange} />
          <div className="upload-file-list">
            {Object.values(uploadFileStatuses).map(fileStatus => (
              <div className="upload-file-item" key={fileStatus.id}>
                <div className="upload-file-name">{fileStatus.name}</div>                                
                {fileStatus.pending && 
                  <div className="upload-file-pending">Please wait</div>
                }
                {fileStatus.error && 
                  <div className="upload-file-error">Error</div>
                }
                {fileStatus.success && 
                  <div className="upload-file-success">Success</div>
                }
              </div>
            ))}
            
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadFile;
