# CampusKizuna - Android Setup

This document explains how to take the CampusKizuna web application and run it as a native Android application using Capacitor.

## Overview

We have integrated **Vite** as a build tool and **Capacitor** to package the web app for Android.

-   **Vite**: A fast, modern build tool that bundles the React code for production.
-   **Capacitor**: A tool that wraps the web app in a native Android shell, allowing it to be run in Android Studio and deployed to the Google Play Store.

## Prerequisites

Before you begin, ensure you have the following installed:
1.  **Node.js and npm**: [Download here](https://nodejs.org/)
2.  **Android Studio**: [Download here](https://developer.android.com/studio)
3.  **Java JDK**: Android Studio usually includes this, but you may need to install it separately.

## Step-by-Step Instructions

Follow these steps in your terminal from the project's root directory.

### 1. Install Dependencies
This command reads the new `package.json` file and downloads all the necessary tools and libraries (React, Vite, Capacitor, etc.) into a `node_modules` folder.
```bash
npm install
```

### 2. Build the Web App
This command uses Vite to bundle all the TypeScript and React code into an optimized set of static files (HTML, CSS, JavaScript) and places them in a `dist` folder. This is the web content that will be shown in the Android app.
```bash
npm run build
```

### 3. Add the Android Platform
This command tells Capacitor to create a native Android project inside an `android` directory. You only need to run this once.
```bash
npx cap add android
```

### 4. Sync Web Assets with Android Project
This is a crucial step. It copies the contents of your `dist` folder into the native Android project. **You must run this command every time you make changes to your web code and want to see them in Android Studio.**
```bash
npx cap sync
```

### 5. Open in Android Studio
This command will automatically open the native project in Android Studio.
```bash
npx cap open android
```

### 6. Run the App in Android Studio
Once the project is open and has finished syncing/indexing in Android Studio:
-   Select an emulator or a connected physical Android device from the device dropdown menu.
-   Click the **Run 'app'** button (the green play icon ▶️).

Your CampusKizuna app should now be running on the Android device!

---
*Note: The `api` directory contains a separate Node.js backend. For full functionality, you will need to run it separately by navigating into the `api` directory and running `npm install` and then `npm start`.*
#   C a m p u s - i z u n a  
 