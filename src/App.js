import React, { useState, useEffect, useCallback } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { createFile, deleteFile } from './graphql/mutations';
import { listFiles as listFilesQuery } from './graphql/queries';
import { Upload, File, Folder, LogOut, Search, Grid, List as ListIcon, Eye, Trash2 } from 'lucide-react';

const client = generateClient();

const getFileCategory = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  
  const categories = {
    'Images': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
    'Documents': ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
    'Spreadsheets': ['xls', 'xlsx', 'csv', 'ods'],
    'Presentations': ['ppt', 'pptx', 'odp'],
    'Videos': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
    'Audio': ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'],
    'Archives': ['zip', 'rar', '7z', 'tar', 'gz'],
    'Code': ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml'],
  };
  
  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext)) return category;
  }
  
  return 'Others';
};

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => <CloudStorageApp signOut={signOut} user={user} />}
    </Authenticator>
  );
}

function CloudStorageApp({ signOut, user }) {
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      
      const result = await client.graphql({
        query: listFilesQuery,
      });
      
      const filesWithUrls = await Promise.all(
        result.data.listFiles.items.map(async (file) => {
          try {
            const urlResult = await getUrl({
              key: file.s3Key,
              options: {
                validateObjectExistence: false,
                expiresIn: 3600
              }
            });
            return { ...file, url: urlResult.url.toString() };
          } catch (error) {
            console.error('Error getting URL for file:', file.name, error);
            return file;
          }
        })
      );
      
      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, [user.username]); 

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    
    for (const file of uploadedFiles) {
      try {
        const category = getFileCategory(file.name);
        const s3Key = `${category}/${Date.now()}-${file.name}`;
        
        setUploadProgress({ fileName: file.name, progress: 0 });

        await uploadData({
          key: s3Key,
          data: file,
          options: {
            contentType: file.type,
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                const progress = Math.round((transferredBytes / totalBytes) * 100);
                setUploadProgress({ fileName: file.name, progress });
              }
            }
          }
        }).result;

        const urlResult = await getUrl({
          key: s3Key,
          options: {
            validateObjectExistence: false,
            expiresIn: 3600
          }
        });

        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          category: category,
          s3Key: s3Key,
          url: urlResult.url.toString(),
          uploadDate: new Date().toISOString(),
          owner: user.username 
        };

        await client.graphql({
          query: createFile,
          variables: { input: fileData }
        });

        setUploadProgress(null);
        
        await fetchFiles();
        
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(null);
        alert(`Error uploading ${file.name}: ${error.message}`);
      }
    }
  };

  const handleDeleteFile = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      return;
    }

    try {
      await remove({ key: file.s3Key });

      await client.graphql({
        query: deleteFile,
        variables: { input: { id: file.id } }
      });

      setFiles(prev => prev.filter(f => f.id !== file.id));
      
    } catch (error) {
      console.error('Error deleting file:', error);
      alert(`Error deleting file: ${error.message}`);
    }
  };

  const getFolders = () => {
    const folderMap = new Map();
    files.forEach(file => {
      const count = folderMap.get(file.category) || 0;
      folderMap.set(file.category, count + 1);
    });
    return Array.from(folderMap.entries()).map(([name, count]) => ({ name, count }));
  };

  const getFilteredFiles = () => {
    let filteredFiles = selectedFolder 
      ? files.filter(f => f.category === selectedFolder)
      : files;

    if (searchTerm) {
      filteredFiles = filteredFiles.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredFiles;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const folders = getFolders();
  const displayFiles = getFilteredFiles();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Upload className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-teal-500">Keepr</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.username}</span>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
            
            <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
              <Upload size={18} />
              <span>Upload Files</span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {uploadProgress && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading {uploadProgress.fileName}</span>
              <span className="text-sm text-gray-600">{uploadProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading files...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Folders</h2>
                
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition ${
                    !selectedFolder ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <File size={20} />
                    <span>All Files</span>
                  </div>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{files.length}</span>
                </button>
                
                {folders.map(folder => (
                  <button
                    key={folder.name}
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition ${
                      selectedFolder === folder.name ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Folder size={20} />
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedFolder || 'All Files'} 
                  <span className="text-gray-500 text-sm ml-2">({displayFiles.length} files)</span>
                </h2>
                
                {displayFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <Folder size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No files yet. Upload your first file!</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayFiles.map(file => (
                      <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition group">
                        <div className="flex flex-col items-center">
                          <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-3">
                            <File className="text-blue-600" size={32} />
                          </div>
                          <p className="text-sm font-medium text-center truncate w-full mb-2" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 mb-3">{formatFileSize(file.size)}</p>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={() => window.open(file.url, '_blank')}
                              className="p-2 bg-blue-50 hover:bg-blue-100 rounded"
                              title="Preview"
                            >
                              <Eye size={16} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="p-2 bg-red-50 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="bg-blue-100 w-10 h-10 rounded flex items-center justify-center">
                            <File className="text-blue-600" size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)} • {file.category}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-2 bg-blue-50 hover:bg-blue-100 rounded"
                            title="Preview"
                          >
                            <Eye size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="p-2 bg-red-50 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;