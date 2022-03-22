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
  },
  screenResolution: {
    key: 2,
    name: "Screen Resolution",
    options: null,
    acceptsCustomInput: true,
    customInputType: "text",
    placeholder: "1920x1080",
    promptFileDirectory: false,
  },
  username: {
    key: 3,
    name: "Username",
    options: null,
    acceptsCustomInput: true,
    customInputType: "text",
    placeholder: "Username",
    promptFileDirectory: false,
  },
  password: {
    key: 4,
    name: "Password",
    options: null,
    acceptsCustomInput: true,
    customInputType: "password",
    placeholder: "******",
    promptFileDirectory: false,
  },
  defaultDownloadDirectory: {
    key: 5,
    name: "Default Download Directory",
    options: null,
    acceptsCustomInput: true,
    customInputType: "text",
    placeholder: "C:/Users/Name/Downloads/",
    promptFileDirectory: {
      prompt: true,
      promptType: "directory",
    },
  },
  defaultUploadAndScanDirectory: {
    key: 6,
    name: "Default Upload and Scan Directory",
    options: null,
    acceptsCustomInput: true,
    customInputType: "text",
    placeholder: "C:/Users/Name/Downloads/",
    promptFileDirectory: {
      prompt: true,
      promptType: "directory",
    },
  },
};
