import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";

function UploadFolderPicker({ selectedFolderId, folders, selectFolder }) {  
 
  return (
    <>
      <ul className="breadcrumb folder-path list-unstyled">
        <li className="list-inline-item">
          <Button
            onClick={() =>
              selectFolder(null)
            }
            color="link"
            size="sm"
            type="button"
          >
            All
          </Button>
        </li>
      </ul>
      <div className="page">
        <ListGroup flush>
          {folders.map((folder) => (
            <ListGroupItem
              key={folder.id}
              tag="button"
              action
              onClick={() => selectFolder(folder.id)}
            >
              <i className="fas fa-folder-open mr-2" />
              <span className="mb-0 text-sm">{folder.name}</span>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </>
  );
}

export default UploadFolderPicker;
