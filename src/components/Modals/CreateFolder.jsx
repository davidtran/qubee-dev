import React, { useState, useContext } from "react";
import { saveFolder } from "../../services/folderService";
import { Button, Modal, Form, Input } from "reactstrap";
import { FileContext } from "../../contexts/FileListContext";

const CreateFolder = ({
  buttonLabel,
  buttonIcon,
  modalClassName,  
}) => {
  const { createFolder, createFolderError, isCreatingFolder } = useContext(FileContext);

  let buttonIconClasses = "ni ni-";
  if (buttonIcon) buttonIconClasses += buttonIcon;

  const [modal, setModal] = useState(false);
  const [inputField, setInputField] = useState("");

  const toggle = () => {    
    setModal(!modal);
  };

  const handleOnChange = (e) => setInputField(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    createFolder({ folderName: inputField });
    setModal(false);
    setInputField('');
  };

  return (
    <div className="file-upload-component">
      <Button color="secondary" type="button" onClick={toggle} className="ml-1">
        <span className="btn-inner--icon">
          <i className={buttonIconClasses} />
        </span>
        <span className="btn-inner--text">{buttonLabel}</span>
      </Button>
      <Modal className={modalClassName} isOpen={modal} toggle={toggle}>
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            Create new folder
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
        <Form onSubmit={handleSubmit}>
          <div className="modal-body">
            <Input
              type="text"
              name="folderName"
              id="folderName"
              placeholder="Type folder name"
              value={inputField}
              onChange={handleOnChange}
            />
            {createFolderError && 
              <div className="alert alert-danger">
                {createFolderError.message}
              </div>
            }            
          </div>
          <div className="modal-footer">
            <div className="text-center">
              <Button data-dismiss="modal" color="link" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" disabled={!inputField} type="submit">
                { isCreatingFolder ? 'Please wait...' : 'Create '}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateFolder;
