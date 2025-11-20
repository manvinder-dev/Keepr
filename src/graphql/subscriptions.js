/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFile = /* GraphQL */ `
  subscription OnCreateFile(
    $filter: ModelSubscriptionFileFilterInput
    $owner: String
  ) {
    onCreateFile(filter: $filter, owner: $owner) {
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
export const onUpdateFile = /* GraphQL */ `
  subscription OnUpdateFile(
    $filter: ModelSubscriptionFileFilterInput
    $owner: String
  ) {
    onUpdateFile(filter: $filter, owner: $owner) {
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
export const onDeleteFile = /* GraphQL */ `
  subscription OnDeleteFile(
    $filter: ModelSubscriptionFileFilterInput
    $owner: String
  ) {
    onDeleteFile(filter: $filter, owner: $owner) {
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
export const onCreateFolder = /* GraphQL */ `
  subscription OnCreateFolder(
    $filter: ModelSubscriptionFolderFilterInput
    $owner: String
  ) {
    onCreateFolder(filter: $filter, owner: $owner) {
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
export const onUpdateFolder = /* GraphQL */ `
  subscription OnUpdateFolder(
    $filter: ModelSubscriptionFolderFilterInput
    $owner: String
  ) {
    onUpdateFolder(filter: $filter, owner: $owner) {
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
export const onDeleteFolder = /* GraphQL */ `
  subscription OnDeleteFolder(
    $filter: ModelSubscriptionFolderFilterInput
    $owner: String
  ) {
    onDeleteFolder(filter: $filter, owner: $owner) {
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
