import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { loader } from "graphql.macro";
import { sortFiles } from '../utils/sortFiles';
import { downloadFiles } from '../services/fileService';

const updateTagsQuery = loader('../queries/updateTags.graphql');
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
  downloadSelectedFiles: () => {},
  getSelectedFiles: () => {},
  deselectFiles: () => {},
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
  updateTags: (fileId, tags) => {},
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
  const [updateTagsMutation] = useMutation(updateTagsQuery);
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

  async function updateTags(fileId, tags) {
    try {
      await updateTagsMutation({ variables: { fileId, tags } });
      setFiles(files.map(file => {
        if (file.id === fileId) {
          file.tags = tags;
        }
        return file;
      }));

    } catch (e) {
      console.log(e);
    }
  }

  async function refresh() {        
    await fetchFiles(fetchFilesParams);
  }

  async function uploadFile(fileId, fileName, file) {    
    setFileStatus({fileId, fileName, file, isUploading: true, error: false, success: false })    
    try {      
      await uploadFileMutation({ variables: {
        file,
        folderId: folderId,
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
      refresh(); 
      return true;
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));      
    }
  } 
  
  async function fetchFiles({ folderId, keyword }) {
    setFetchFilesParams({ folderId, keyword });
    setFolderId(folderId);
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

  function downloadSelectedFiles() {
    if (selectedFileIds.length === 0) return;
    const selectedFiles = selectedFileIds.map(id => files.find(file => file.kind === 'FILE' && file.id === id));    
    const fileIds = selectedFiles.map(item => item.id);
    downloadFiles({ folderId, fileIds, selectedFiles, name: selectedFiles[0].name });
  }

  function getSelectedFiles() {
    const selectedFiles = selectedFileIds.map(id => files.find(file => file.id === id));    
    return selectedFiles;
  }

  function deselectFiles() {
    setSelectedFileIds([]);
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
    downloadSelectedFiles,
    getSelectedFiles,
    deselectFiles,
    uploadFileStatuses,
    files,    
    isRequestFileList,
    requestFileListError,    
    selectedFileIds,
    sorting,      
    isSeletedAll,
    isCreatingFolder,
    createFolderError,
    updateTags,
  }
  
  return (
    <FileContext.Provider value={value}>{children}</FileContext.Provider>
  )
}

