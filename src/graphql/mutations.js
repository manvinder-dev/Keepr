/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFile = /* GraphQL */ `
  mutation CreateFile($input: CreateFileInput!) {
    createFile(input: $input) {
      id
      name
      size
      type
      category
      s3Key
      url
      uploadDate
      owner
    }
  }
`;

export const updateFile = /* GraphQL */ `
  mutation UpdateFile(
    $input: UpdateFileInput!
    $condition: ModelFileConditionInput
  ) {
    updateFile(input: $input, condition: $condition) {
      id
      name
      size
      type
      category
      s3Key
      url
      uploadDate
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFile = /* GraphQL */ `
  mutation DeleteFile($input: DeleteFileInput!) {
    deleteFile(input: $input) {
      id
    }
  }
`;
export const createFolder = /* GraphQL */ `
  mutation CreateFolder(
    $input: CreateFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    createFolder(input: $input, condition: $condition) {
      id
      name
      fileCount
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateFolder = /* GraphQL */ `
  mutation UpdateFolder(
    $input: UpdateFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    updateFolder(input: $input, condition: $condition) {
      id
      name
      fileCount
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFolder = /* GraphQL */ `
  mutation DeleteFolder(
    $input: DeleteFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    deleteFolder(input: $input, condition: $condition) {
      id
      name
      fileCount
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
