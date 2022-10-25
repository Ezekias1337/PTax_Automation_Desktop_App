# Property Taxes Automation Desktop App

This project was made using Electron and React for the Front End, Node.js and Selenium for the backend.

## Purpose

In the property tax industry there is alot of monotonous work that involves visiting County's websites to retrieve Tax Bills, Assessment Notices, and other documents and subsequently upload this information to their system.

However, with such monotony data entry errors are bound to be made. Also, a person's labor could be much better used towards something that requires more complex decision making while the automation runs in the background.

Simply install the app, select an automation you want to run,  upload a spreadsheet with the list of data points needed and relax.

## Available Scripts

In the project directory, you can run:

### `npm run app`

After installing the dependencies with npm install, you can run the application using this command.

## Code And File Structure

This app utilizes multiple technologies which are not typically used together. So I figured an explanation of the stack would be necessary.

**Electron** is the base of the application's front end. It's what allows **Javascript/HTML/CSS** to be rendered in a desktop environment. Electron also serves as the communication bridge between the front and back end through **IPC listeners**. It is located in the **electron folder**. The listeners for the backend are located in **src/ipc-main-listeners**. The listeners for the front end are located in **src/ipc-renderer-listeners**. The entry point for electron is at the root directory and named **main.js**.

**React** is the Javascript framework used for the front end because of it's robust component reusability and state management. The overwhelming majority of the front end is located in the **src folder**.

**Selenium** is the web automation framework being used to open the browser window and interact with the page via automation. Selenium is the **"backend"** for this application. It is located in the **selenium folder**.
