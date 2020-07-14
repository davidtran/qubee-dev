import React, { useState, useContext, useEffect } from "react";
import { saveFolder } from "../../services/folderService";
import { saveFile } from "../../services/fileService";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { FileContext } from "../../contexts/FileListContext";
import { FileOperationsContext } from "../../contexts/FileOperationsContext";

const RenameFile = ({ buttonLabel, buttonIcon, disable, modalClassName }) => {
  const { getSelectedFiles } = useContext(FileContext);
  const { renameFileAndFolder, isRenamePending, isRenameError } = useContext(
    FileOperationsContext
  );
  const selectedDataObj = getSelectedFiles();
  const [modal, setModal] = useState(false);
  const [inputField, setInputField] = useState(
    selectedDataObj.length > 0 && selectedDataObj[0].name
  );
  useEffect(() => {
    if (!modal) {
      setInputField('');
    } else {
      let name = '';
      if (selectedDataObj.length > 0) {
        name = selectedDataObj[0].kind === 'FILE' ? selectedDataObj[0].name.split('.')[0] : selectedDataObj[0].name;  
      }            
      setInputField(name)
    }
  }, [modal]);
  const toggle = () => setModal(!modal);
  const handleOnChange = (e) => setInputField(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputField) return;
    renameFileAndFolder(inputField);
    setModal(false);
  };

  if (!selectedDataObj) return null;

  return (
    <div className="file-upload-component">
      <Button color="link" type="button" onClick={toggle} disabled={disable}>
        {buttonIcon}
        <span className="btn-inner--text">{buttonLabel}</span>
      </Button>
      <Modal className={modalClassName} isOpen={modal} toggle={toggle}>
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            Rename
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
            <InputGroup>
              <Input
                type="text"
                name="rename"
                id="rename"
                value={inputField}
                onChange={handleOnChange}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  .{selectedDataObj.fileExtension}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {isRenameError && (
              <div className="alert alert-danger">
                {isRenameError.message}
              </div>
            )}            
          </div>
          <div className="modal-footer">
            <div className="text-center">
              <Button data-dismiss="modal" color="link" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" disabled={!inputField || isRenamePending} type="submit">
                {isRenamePending ? "Please wait" : "Rename"}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RenameFile;
