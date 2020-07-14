import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavItem, Nav, Button } from "reactstrap";
import ShareFiles from "../Modals/ShareFiles";
import DeleteFiles from "../Modals/DeleteFiles";
import MoveFiles from "../Modals/MoveFiles";
import RenameFile from "../Modals/RenameFile";
import DownloadFiles from '../Modals/DownloadFiles';
import { FileOperationsContext } from "../../contexts/FileOperationsContext";
import { FileContext } from "../../contexts/FileListContext";

function FileEditActions() {
  const { deselectFiles } = useContext(FileContext);
  return (
    <Nav className="justify-content-end navbar" role="tablist">
      <NavItem>
        <ShareFiles
          buttonLabel="Share"
          buttonIcon={<FontAwesomeIcon icon="share-alt" />}
          modalClassName="modal-dialog-centered"          
        />
      </NavItem>
      <NavItem>
        <DownloadFiles
          buttonLabel="Download"
          buttonIcon={(<FontAwesomeIcon icon="download" />)}          
        />
      </NavItem>
      <NavItem>
        <RenameFile
          buttonLabel="Rename"
          buttonIcon={<FontAwesomeIcon icon="edit" />}
          disable={false}
          modalClassName="modal-dialog"          
        />
      </NavItem>
      <NavItem>
        <MoveFiles
          buttonLabel="Move"
          buttonIcon={<FontAwesomeIcon icon="file-export" />}
          modalClassName="modal-dialog"          
        />
      </NavItem>
      <NavItem>
        <DeleteFiles
          buttonLabel="Delete"
          buttonIcon={<FontAwesomeIcon icon="trash-alt" />}
          modalClassName="modal-dialog"          
        />
      </NavItem>
      <NavItem>
        <Button color="secondary" onClick={deselectFiles}>
          <span className="btn-inner--icon mr-md-1 mr-0">
            <i className="fas fa-times" />
          </span>
          <span className="btn-inner--text d-md-inline d-none">Cancel</span>
        </Button>
      </NavItem>
    </Nav>
  );
}

export default FileEditActions;
