import React, { useState, useContext } from "react";
import { Button, Modal } from "reactstrap";
import { FileOperationsContext } from "../../contexts/FileOperationsContext";

const DeleteFiles = ({ buttonLabel, buttonIcon, modalClassName }) => {
  const { deleteFileAndFolder, isDeletePending, isDeleteError } = useContext(
    FileOperationsContext
  );
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const onHandleDelete = () => {
    deleteFileAndFolder();
  };

  return (
    <>
      <Button color="link" type="button" onClick={toggle}>
        {buttonIcon}
        <span className="btn-inner--text">{buttonLabel}</span>
      </Button>
      <Modal className={modalClassName} isOpen={modal} toggle={toggle}>
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            Delete
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
        <div className="modal-body" style={{ textAlign: "center" }}>
          <p>Deleted items are removed from Qubee permanently.</p>
          <p>Do you wish to proceed?</p>
          {isDeleteError && (
            <div className="alert alert-danger">
              {isDeleteError.message}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="text-center">
            <Button data-dismiss="modal" color="link" onClick={toggle}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              onClick={onHandleDelete}
              disabled={isDeletePending}
            >
              {isDeletePending ? "Please wait" : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteFiles;
