import React, { useState, useContext } from "react";
import { getFile, saveFile } from "../../services/fileService";
import { toast } from "react-toastify";
import { Button, Modal, Form, Input, Badge, Label } from "reactstrap";
import { FileContext } from "../../contexts/FileListContext";

const MetaTag = (props) => {
  const { files, updateTags } = useContext(FileContext);
  const { buttonLabel, modalClassName, fileId, getFiles } = props;
  const [modal, setModal] = useState(false);  
  const [inputField, setInputField] = useState(null);

  const file = files.find(item => item.id === fileId);
  const toggle = () => setModal(!modal);

  const handleOnChange = (e) => {
    setInputField(e.currentTarget.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagArray = inputField.replace(/[^0-9a-zA-Z-_ \n]/g, "").split(/\s+/);

    // If duplicate meta tags, prevent saving.
    if (checkDuplicate(tagArray))
      return toast.error("There are duplicate tags.");

    await updateTags(fileId, tagArray);
    toggle();
  };

  // Check for duplicate meta tags
  const checkDuplicate = (array) => {
    // compare the size of array and Set
    if (array.length !== new Set(array).size) return true;

    return false;
  };

  return (
    <>
      <Badge
        href="#pablo"
        color="secondary"
        pill
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      >
        {buttonLabel}
      </Badge>
      <Modal className={modalClassName} isOpen={modal} toggle={toggle}>
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            Edit tags for {file.name}
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
        <Form method="POST" onSubmit={handleSubmit}>
          <div className="modal-body">
            <Label for="metaTags">
              Add or remove your tags. (one tag per line)
            </Label>
            <Input
              name="metaTags"
              id="metaTags"
              placeholder="Add one tag per line."
              rows="5"
              type="textarea"
              value={inputField || ''}
              onChange={handleOnChange}
            />
          </div>
          <div className="modal-footer">
            <div className="text-center">
              <Button data-dismiss="modal" color="link" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {inputField ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default MetaTag;
