import React, { useContext } from 'react';
import { Button } from 'reactstrap';
import { downloadFiles } from '../../services/fileService';
import { FileContext } from '../../contexts/FileListContext';

const DownloadFiles = ({ buttonLabel, buttonIcon }) => {
  const { downloadSelectedFiles } = useContext(FileContext);
  
  return (
    <Button color="link" onClick={downloadSelectedFiles}>
      {buttonIcon}
      <span className="btn-inner--text d-md-inline d-none">{buttonLabel}</span>
    </Button>
  );
};
export default DownloadFiles;
