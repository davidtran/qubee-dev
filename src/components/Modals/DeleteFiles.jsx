import React, { useState, useContext } from "react";
import { Button, Modal } from "reactstrap";
import { FileOperationsContext } from "../../contexts/FileOperationsContext";
import { FileContext } from "../../contexts/FileListContext";

const DeleteFiles = ({ buttonLabel, buttonIcon, modalClassName }) => {
  const { deleteFileAndFolder, isDeletePending, isDeleteError } = useContext(
    FileOperationsContext
  );
  const { getSelectedFiles } = useContext(FileContext);
  const [isAbleToDelete, setIsAbleToDelete] = useState(false);
  const isDeletingNonEmptyFolder = !!getSelectedFiles().find(
    (item) => item.kind === "FOLDER"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCorfirmInputModal, setShowConfirmInputModal] = useState(false);

  function toggleConfirmDeleteModal() {
    setShowDeleteModal(!showDeleteModal);
  }

  function onHandleDelete() {
    if (isDeletingNonEmptyFolder) {
      setShowConfirmInputModal(true);
    } else {
      deleteFileAndFolder();
    }
  }

  function handleDeleteNonEmptyFolder() {
    if (isAbleToDelete) {
      deleteFileAndFolder();
      setShowConfirmInputModal(false);
      setShowDeleteModal(false);
    }
  }

  function hideConfirmInputModal() {
    setShowConfirmInputModal(false);
    setShowDeleteModal(false);
  }

  return (
    <>
      <Button color="link" type="button" onClick={toggleConfirmDeleteModal}>
        {buttonIcon}
        <span className="btn-inner--text">{buttonLabel}</span>
      </Button>

      <Modal
        className={modalClassName}
        isOpen={showDeleteModal && !showCorfirmInputModal}
        toggle={toggleConfirmDeleteModal}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            Delete
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleConfirmDeleteModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <p>Deleted items are removed from Qubee permanently.</p>
          <p>Do you wish to proceed?</p>
          {isDeleteError && (
            <div className="alert alert-danger">{isDeleteError.message}</div>
          )}
        </div>
        <div className="modal-footer">
          <div className="text-center">
            <Button
              data-dismiss="modal"
              color="link"
              onClick={toggleConfirmDeleteModal}
            >
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

      <Modal
        className={modalClassName}
        isOpen={showCorfirmInputModal}
        toggle={hideConfirmInputModal}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="modal-title-default">
            Confirm delete
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={hideConfirmInputModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <p>The folder you are trying to delete is not empty</p>
          <p>
            Please type <strong>DELETE</strong> to confirm your action
          </p>
          <input
            type="text"
            onChange={(e) =>
              setIsAbleToDelete(
                e.target.value && e.target.value.toLowerCase() === "delete"
              )
            }
          />
        </div>
        <div className="modal-footer">
          <div className="text-center">
            <Button
              data-dismiss="modal"
              color="link"
              onClick={hideConfirmInputModal}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              onClick={handleDeleteNonEmptyFolder}
              disabled={isDeletePending || !isAbleToDelete}
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
