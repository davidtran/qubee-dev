import React, { useState, useContext } from 'react';
import Promise from 'bluebird';
import { loader } from "graphql.macro";
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { FileContext } from './FileListContext';
import { toast } from 'react-toastify';
const uploadFileQuery = loader('../queries/uploadFile.graphql');
const getUploadProgressQuery = loader('../queries/getUploadProgress.graphql');

export const FileUploadContext = React.createContext({
  statuses: {},
  uploadFile: () => {},
})

export const FileUploadContextProvider = ({ children }) => {
  const { refresh } = useContext(FileContext);
  const [uploadFileStatuses, setUploadFileStatuses] = useState({});
  const [uploadFileMutation] = useMutation(uploadFileQuery);
  const client = useApolloClient();
  const CHUNK_SIZE = 1000000; // 1MB

  async function uploadFiles(files, folderId) {
    const pms = [];
    for (let i = 0; i < files.length; i++) {
      pms.push(handleUploadFile(files[i], folderId));
    }
    return await Promise.all(pms);
  }

  async function handleUploadFile(file, folderId) {
    const reader = new FileReader();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let chunkCount = 1;

    function getNextChunk() {
      return new Promise((resolve, reject) => {
        const length = totalChunks === 1 ? file.size : CHUNK_SIZE;
        const start = length * (chunkCount - 1);

        reader.onload = () => {
          const chunk = new Blob([reader.result]  );
          chunk.name = file.name;
          resolve(chunk);
        };
        if (chunkCount === totalChunks) {
          reader.readAsArrayBuffer(file.slice(start));
        } else {
          reader.readAsArrayBuffer(file.slice(start, start + length));
        }
      });
    }

    async function sendChunk() {
      try {
        const chunk = await getNextChunk();

        await uploadFileMutation({ variables: {
          file: chunk,
          filename: file.name,
          folderId: folderId,
          totalChunks,
          chunkNumber: chunkCount
        }})

        if (chunkCount < totalChunks) {
          const progress = Math.round(chunkCount / totalChunks * 100);
          _setFileStatus({ file, progress, isUploading: true, error: false, success: false });
          chunkCount++;
          sendChunk();
        } else {
          refresh();
          _setFileStatus({ file, progress: 100, isUploading: false, error: false, success: true });
        }
      } catch (e) {
        _setFileStatus({ file, isUploading: false, error: true, success: false });
      }
    }

    try {
      _setFileStatus({ file, progress: 0, isUploading: true, error: false, success: false });
      const uploadProgress = await client.query({
        query: getUploadProgressQuery,
        variables: {
          folderId,
          filename: file.name,
        }
      });

      if (uploadProgress.errors && uploadProgress.errors[0]) {
        toast.error(uploadProgress.errors[0].message);
        _setFileStatus({ file, progress: 0, isUploading: false, error: true, success: false });
        return false;
      }

      if (uploadProgress.data.getUploadProgress && uploadProgress.data.getUploadProgress.isResumable) {
        chunkCount = uploadProgress.data.getUploadProgress.lastChunkNumber + 1;
      }

      return sendChunk();
    } catch (e) {
      _setFileStatus({ file, progress: 0, isUploading: false, error: true, success: false });
    }
  }

  function clearFileStatuses() {
    setUploadFileStatuses({});
  }

  function _setFileStatus({ file, progress, isUploading, error, success }) {
    setUploadFileStatuses(state => ({
      ...state,
      [file.name]: {
        file,
        progress,
        isUploading,
        error,
        success
      }
    }));
  }

  function removeFile(file) {
    const newStatus = {...uploadFileStatuses};
    delete newStatus[file.name];
    setUploadFileStatuses(newStatus);
  }

  const value = {
    statuses: uploadFileStatuses,
    uploadFiles,
    removeFile,
    clearFileStatuses,
  }

  return (
    <FileUploadContext.Provider value={value}>{children}</FileUploadContext.Provider>
  );
}