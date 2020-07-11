import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { loader } from "graphql.macro";

const filesQuery = loader('../queries/files.graphql');
const createFolderQuery = loader('../queries/createFolder.graphql');
const uploadFileQuery = loader('../queries/uploadFile.graphql');

export const FileContext = React.createContext({
  fetchFiles: () => {},
  files: [],
  isRequestFileList: false,
  requestFileListError: false,  
  toggleSelectFile: () => {},
  selectAllFiles: () => {},
  selectedFileIds: [],
  isSeletedAll: false,
  sorting: {
    attribute: 'name',
    direction: 'ASC',
  },
  toggleSortDirection: () => {},
});

export const FileContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [sorting, setSorting] = useState({
    attribute: 'name',
    direction: 'ASC',
  });
  const [fetchFileQuery, {
    data: fileListData,
    loading: isRequestFileList,
    error: requestFileListError,
  }] = useLazyQuery(filesQuery);

  useEffect(() => {
    if (fileListData) {
      const _files = fileListData.data.files;
      setFiles(_files);
    }
  }, [fileListData]);
  
  function fetchFiles({ folderId, keyword }) {
    await fetchFileQuery({ variables: {
      folderId,
      keyword
    }});
  }
  
  function selectAllFiles() {
    setFiles(files.map(file => {
      file._selected = true;
      return file;
    }));
  }

  function toggleSelectFile(fileId) {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        file._selected = !file._selected;
      }      
      return file;
    }));
  }

  function toggleSortDirection(attribute) {    
    let nextDirection = null;
    if (attribute === sorting.attribute) {
      nextDirection = sorting.direction === 'DESC' ? 'ASC' : 'DESC';
    } else {
      nextDirection = 'DESC';
    }
    const _sorting = {
      attribute,
      direction: nextDirection,
    }
    setSorting(_sorting);
  }

  const isSeletedAll = files.length > 0 && !files.some(file => !file._selected);
  
  const value = {
    fetchFiles,
    toggleSelectFile,
    selectAllFiles,
    files,    
    isRequestFileList,
    requestFileListError,    
    selectedFileIds,
    sorting,
    toggleSortDirection,    
    selectedFolderId,
    isSeletedAll,
  }
  
  return (
    <FileContext.Provider value={value}>{children}</FileContext.Provider>
  )
}