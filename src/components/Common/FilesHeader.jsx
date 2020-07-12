import React, { useContext } from "react";
import CreateFolder from "../Modals/CreateFolder";
import { Row, CardHeader } from "reactstrap";
import { FileContext } from "../../contexts/FileListContext";

function FilesHeader({  
  createFolderButton,  
}) {
  const { files } = useContext(FileContext);
  return (
    <CardHeader className="border-0">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="my-2">All {files.length}</h3>
        </div>
        {createFolderButton && (
          <div className="col text-right">
            <CreateFolder
              buttonLabel="Create new folder"
              modalClassName="modal-dialog"              
            />
          </div>
        )}
      </Row>
    </CardHeader>
  );
}

export default FilesHeader;
