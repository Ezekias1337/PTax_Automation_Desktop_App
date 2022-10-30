export const listOfSettings = {
  theme: {
    key: 1,
    name: "Color Theme",
    options: [
      {
        key: 1,
        choice: "Light",
      },
      {
        key: 2,
        choice: "Dark",
      },
      {
        key: 3,
        choice: "Gradient",
      },
    ],
    acceptsCustomInput: false,
    customInputType: null,
    promptFileDirectory: false,
    inputCategory: "dropdown",
  },
  screenResolution: {
    key: 2,
    name: "Screen Resolution",
    options: [
      {
        key: 1,
        choice: "3440x1440",
      },
      {
        key: 2,
        choice: "1920x1080",
      },
      {
        key: 3,
        choice: "1366x768",
      },
      {
        key: 4,
        choice: "800x600",
      },
      {
        key: 5,
        choice: "1040x810",
      },
      {
        key: 6,
        choice: "1536x864",
      },
      {
        key: 7,
        choice: "414x896",
      },
      {
        key: 8,
        choice: "375x667",
      },
    ],
    acceptsCustomInput: false,
    customInputType: null,
    placeholder: "Screen Resolution",
    promptFileDirectory: false,
    inputCategory: "dropdown",
  },
  username: {
    key: 3,
    name: "Username",
    options: null,
    acceptsCustomInput: true,
    customInputType: "text",
    placeholder: "Username",
    promptFileDirectory: false,
    inputCategory: "text",
  },
  password: {
    key: 4,
    name: "Password",
    options: null,
    acceptsCustomInput: true,
    customInputType: "password",
    placeholder: "******",
    promptFileDirectory: false,
    inputCategory: "text",
  },
  defaultDownloadDirectory: {
    key: 5,
    name: "Download Directory",
    options: null,
    acceptsCustomInput: true,
    customInputType: "text",
    placeholder: "C:/Users/Name/Downloads/",
    promptFileDirectory: {
      prompt: true,
      promptType: "directory",
    },
    inputCategory: "fileOrDirectory",
  },
  defaultUploadAndScanDirectory: {
    key: 6,
    name: "Upload Directory",
    options: null,
    acceptsCustomInput: true,
    customInputType: "text",
    placeholder: "C:/Users/Name/Downloads/",
    promptFileDirectory: {
      prompt: true,
      promptType: "directory",
    },
    inputCategory: "fileOrDirectory",
  },
  launchWindowInCurrentPosition: {
    key: 7,
    name: "Launch Window in Current Position",
    options: null,
    acceptsCustomInput: false,
    customInputType: null,
    promptFileDirectory: false,
    inputCategory: "switch",
  },
};
