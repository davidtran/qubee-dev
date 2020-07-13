import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { loader } from "graphql.macro";
import { sortFiles } from '../utils/sortFiles';

const filesQuery = loader('../queries/files.graphql');
const createFolderQuery = loader('../queries/createFolder.graphql');
const uploadFileQuery = loader('../queries/uploadFile.graphql');

export const FileContext = React.createContext({
  fetchFiles: () => {},
  toggleSelectFile: () => {},
  selectAllFiles: () => {},
  toggleSortDirection: () => {},
  uploadFile: () => {},
  refresh: () => {},
  createFolder: () => {},
  uploadFileStatuses: null,
  files: [],
  isRequestFileList: false,
  requestFileListError: false,    
  selectedFileIds: [],
  isSeletedAll: false,
  sorting: {
    attribute: 'name',
    direction: 'ASC',
  },  
  isCreatingFolder: false,
  createFolderError: null,
});

export const FileContextProvider = ({ children }) => {
  const [fetchFilesParams, setFetchFilesParams] = useState({});
  const [files, setFiles] = useState([]);  
  const [sorting, setSorting] = useState({
    attribute: 'name',
    direction: 'ASC',
  });
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [fetchFileQuery, {
    data: fileListData,
    loading: isRequestFileList,
    error: requestFileListError,
  }] = useLazyQuery(filesQuery);
  const [uploadFileStatuses, setUploadFileStatuses] = useState({});
  const [uploadFileMutation] = useMutation(uploadFileQuery); 
  const [createFolderMutation, { loading: isCreatingFolder, error: createFolderError }] = useMutation(createFolderQuery);
  const [folderId, setFolderId] = useState(null);

  useEffect(() => {
    if (fileListData) {      
      const fileData = [
        ...fileListData.getFiles.files.map(file => ({
          ...file,
          name: file.file_name,
          kind: 'FILE',
        })),
        ...fileListData.getFiles.folders.map(folder => ({
          ...folder,
          name: folder.name,
          kind: 'FOLDER',
        }))

      ]      
      sortFiles(fileData, sorting.attribute, sorting.direction);      
      setFiles(fileData);
      
    }
  }, [fileListData]);

  function setFileStatus({ fileId, fileName, file, isUploading, error, success }) {
    setUploadFileStatuses({
      ...uploadFileStatuses,
      [fileId]: {
        isUploading,
        error,
        success
      }
    });
  }

  async function refresh() {        
    await fetchFiles(fetchFilesParams);
  }

  async function uploadFile(fileId, fileName, file) {    
    setFileStatus({fileId, fileName, file, isUploading: true, error: false, success: false })    
    try {      
      await uploadFileMutation({ variables: {
        file
      }});
      refresh();
      setFileStatus({fileId, isUploading: false, error: false, success: true });    
    } catch (e) {
      setFileStatus({fileId, isUploading: false, error: true, success: false });
    }
  }

  async function createFolder({ folderName }) {
    try {
      await createFolderMutation({
        variables: {
          folderName,
          folderId,
        }
      });       
      return true;
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
      console.log(e);
    }
  } 
  
  async function fetchFiles({ folderId, keyword }) {
    setFetchFilesParams({ folderId, keyword });
    setSelectedFileIds([]);
    await fetchFileQuery({ variables: {
      folderId,
      keyword
    }});
  }
  
  function selectAllFiles() {
    if (files.length === selectedFileIds.length) {
      setSelectedFileIds([]);
    } else {
      const ids = files.map(file => file.id);
      setSelectedFileIds(ids);
    }    
  }

  function toggleSelectFile(fileId) {
    const index = selectedFileIds.indexOf(fileId);
    if (index >= 0) {
      setSelectedFileIds(selectedFileIds.filter(id => id !== fileId))
    } else {
      setSelectedFileIds([...selectedFileIds, fileId]);
    }
    console.log(fileId);
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
    sortFiles(files, _sorting.attribute, _sorting.direction);
  }
  
  const isSeletedAll = files.length > 0 && selectedFileIds.length > 0 && files.length === selectedFileIds.length;

  const value = {
    fetchFiles,
    toggleSelectFile,
    selectAllFiles,
    toggleSortDirection, 
    uploadFile,
    refresh,
    createFolder,
    uploadFileStatuses,
    files,    
    isRequestFileList,
    requestFileListError,    
    selectedFileIds,
    sorting,      
    isSeletedAll,
    isCreatingFolder,
    createFolderError,
  }
  
  return (
    <FileContext.Provider value={value}>{children}</FileContext.Provider>
  )
}

