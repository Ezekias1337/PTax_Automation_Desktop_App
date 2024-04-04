// Library Imports
const { ipcMain } = require("electron");
const fs = require("fs");
const https = require("https");
const path = require("path");
const extract = require("extract-zip");
// Constants
const {
  CHROMEDRIVER_DOWNLOAD_UPDATE_PENDING,
  CHROMEDRIVER_DOWNLOAD_UPDATE_SUCCESS,
  CHROMEDRIVER_DOWNLOAD_UPDATE_FAILURE,
} = require("../../constants/updateActions");

module.exports = {
  chromeDriverDownloadUpdatePending: ipcMain.on(
    CHROMEDRIVER_DOWNLOAD_UPDATE_PENDING,
    (event, message) => {
      const { sender } = event;

      let responseFromApi = "";
      const downloadApiEndpoint =
        "https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json";
      const destinationPath = path.join(
        __dirname,
        "../../../../webdriver/chromedriver-win64.zip"
      );
      const unzippedDestinationPath = path.join(
        __dirname,
        "../../../../webdriver/"
      );

      const downloadFile = (url, destination) => {
        return new Promise((resolve, reject) => {
          const file = fs.createWriteStream(destination);
          https
            .get(url, (response) => {
              response.pipe(file);
              file.on("finish", () => {
                file.close(resolve);
              });
            })
            .on("error", (error) => {
              fs.unlink(destination, () => {
                reject(error);
              });
            });
        });
      };

      const extractZipFile = (zipFile, destination) => {
        return new Promise((resolve, reject) => {
          extract(zipFile, { dir: destination }, (error) => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              resolve();
            }
          });
        });
      };

      const downloadAndExtractFile = async (
        url,
        destinationPath,
        unzippedDestinationPath
      ) => {
        try {
          console.log("Downloading Chromedriver ZIP file...");
          await downloadFile(url, destinationPath);
          console.log("Chromedriver ZIP file downloaded successfully!");

          console.log("Extracting Chromedriver ZIP file...");
          await extractZipFile(destinationPath, unzippedDestinationPath);
          console.log("Chromedriver ZIP file extracted successfully!");
        } catch (error) {
          console.error("Error downloading Chromedriver ZIP file:", error);
        }
      };

      https
        .get(downloadApiEndpoint, (response) => {
          let data = "";

          // A chunk of data has been received
          response.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received
          response.on("end", () => {
            responseFromApi = JSON.parse(data);
            const win64ChromedriverURL =
              responseFromApi.channels.Stable.downloads.chromedriver.find(
                (item) => item.platform === "win64"
              ).url;

            downloadAndExtractFile(
              win64ChromedriverURL,
              destinationPath,
              unzippedDestinationPath
            );
            sender.send(CHROMEDRIVER_DOWNLOAD_UPDATE_SUCCESS);
          });
        })
        .on("error", (error) => {
          console.error("Error fetching data:", error);
          sender.send(CHROMEDRIVER_DOWNLOAD_UPDATE_FAILURE);
        });
    }
  ),
};
