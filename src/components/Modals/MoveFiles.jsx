import React, { useState, useContext } from "react";
import { Button, Modal } from "reactstrap";
// import { saveFolder } from "../../services/folderService";
import { saveFile } from "../../services/fileService";
import UploadFolderPicker from "../Common/UploadFolderPicker";
import "react-toastify/dist/ReactToastify.css";
import { FileOperationsContext } from "../../contexts/FileOperationsContext";

const MoveFiles = ({
  buttonLabel,
  buttonIcon,
  modalClassName,  
}) => {
  const [modal, setModal] = useState(false);
  const { folders, selectedFolderId, selectFolder, fetchFolders } = useContext(FileOperationsContext);

  const toggle = () => {    
    fetchFolders();
    setModal(!modal);
  };

  const handleProcessedFiles = () => { 
  };
  
  return (
    <>
      <Button block color="link" type="button" onClick={toggle}>
        {buttonIcon}
        <span className="btn-inner--text">{buttonLabel}</span>
      </Button>
      <Modal className={modalClassName} isOpen={modal} toggle={toggle}>
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            Move
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
          <UploadFolderPicker            
            selectedFolderId={selectedFolderId}
            folders={folders}
            selectFolder={selectFolder}
          />
        </div>
        <div className="modal-footer">
          <div className="text-center">
            <Button data-dismiss="modal" color="link" onClick={toggle}>
              Cancel
            </Button>            
            <Button
              color="primary"
              type="button"
              onClick={handleProcessedFiles}
            >
              Move
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MoveFiles;
