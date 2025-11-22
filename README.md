# Keepr: Secure Cloud Storage Solution

**Keepr** is a secure, user-authenticated cloud storage web application built with **React** and powered by **AWS Amplify**. It allows authenticated users to securely upload, store, categorize, view, and manage their files.

## Features:

  * **User Authentication**: Secure sign-up and sign-in powered by **AWS Cognito User Pools**. The required sign-up attributes include First Name, Last Name, Preferred Username, and Email.
  * **Secure File Storage**: Files are stored securely on **AWS S3** with owner-level access control defined via GraphQL schema rules.
  * **File Management**: Easily upload multiple files, view file details (size, name), preview/open files in a new tab, and delete files from storage.
  * **Automatic Categorization**: Files are automatically organized into folders (categories) based on their file extension (e.g., `PDF Files`, `JPG Files`).
  * **Search and Filter**: Functionality to search files by name and filter by the auto-generated file categories (folders).
  * **UI/UX**: Clean, responsive interface using Tailwind CSS with toggleable **grid** and **list** views.

## Tech Stack: 

| Category | Technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | **React** | Framework for the user interface. |
| **Styling** | **Tailwind CSS** | Used for utility-first styling. |
| **Cloud/Backend** | **AWS Amplify** | Provides the development platform, libraries, and CLI integration. |
| **Authentication** | **AWS Cognito** | Manages user sign-up and sign-in. |
| **API/Data** | **AWS AppSync (GraphQL)** | Manages data (file metadata and folders). |
| **Storage** | **AWS S3** | Stores uploaded user files. |

## Getting Started: 

### Prerequisites

You need the following installed locally:

  * [Node.js](https://nodejs.org/en/) (version 14.0.0 or later, based on `react-scripts` v5.0.1 requirements).
  * [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).
  * [AWS Amplify CLI](https://docs.amplify.aws/cli/): `npm install -g @aws-amplify/cli`

### Backend Setup (AWS Amplify)

This project contains AWS Amplify configuration files, so you can restore the backend environment.

1.  **Pull the backend environment** (assuming you have AWS credentials configured):
    ```bash
    amplify pull
    ```
    *Note: This command usually configures your local environment based on the existing Amplify project files.*
2.  **Ensure all resources are pushed** (if you need to update or if the initial pull is incomplete):
    ```bash
    amplify push
    ```

### Frontend Setup (React)

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

-----

## Available Scripts

In the project directory, you can run the standard Create React App scripts:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view it in your browser.
The page will reload when you make changes.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
