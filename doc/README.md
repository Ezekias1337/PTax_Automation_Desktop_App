# Property Taxes Automation Desktop App

This project was made using Electron and React for the front-end, Node.js and Selenium for the back-end.

## Purpose

In the property tax industry there is alot of monotonous work that involves visiting County's websites to retrieve Tax Bills, Assessment Notices, and other documents and subsequently upload this information to their system.

However, with such monotony data entry errors are bound to be made. Also, a person's labor could be much better used towards something that requires more complex decision making while the automation runs in the background.

Simply install the app, select an automation you want to run,  upload a spreadsheet with the list of data points needed and relax.

## Available Scripts

In the project directory, you can run:

### `npm run increment-version`

When you are finished with a commit that you want to push to production, before committing run this script to increment the version number by one. This is because the version number needs to be higher for the production app to download the update.

### `npm run app`

After installing the dependencies with npm install, you can run the application using this command.

### `npm run start-main-debug`

This is the same as npm run app, but it allows you to debug the front-end of the application. More explanation in the Debug section at the bottom.

### `npm run prestart`

Allows the preload file to be used in the front-end of the application.

### `npm run start`

Allows the app to use environment variables.

### `npm run poststart`

Initiates react-scripts start.

### `npm run build`

Builds the application for production

### `npm run electron:package:win`

Runs npm run build and publishes the version to github releases.

## Code And File Structure

This app utilizes multiple technologies which are not typically used together. So I figured an explanation of the stack would be necessary.

**Electron** is the base of the application's front-end. It's what allows **Javascript/HTML/CSS** to be rendered in a desktop environment. Electron also serves as the communication bridge between the front and back-end through **IPC listeners**. It is located in the **public/electron folder.** The listeners for the back-end are located in **public/electron/ipc-main-listeners** and they are imported in the electron entry point file in public named **electron.js**. The listeners for the front-end are located in **src/hooks/ipc**.

**React** is the Javascript framework used for the front-end because of it's robust component reusability and state management. The overwhelming majority of the front-end is located in the **src folder**.

**Selenium** is the web automation framework being used to open the browser window and interact with the page via automation. Selenium is the **"back-end"** for this application. It is located in the **public/selenium folder.**

There are some things shared between Electron and Selenium in the **public/shared folder**. However, because of the way React works, the front-end cannot access anything outside of the src folder. Therefore, some pieces of code are duplicated due to this restriction.

## Comments

You might notice that some of my comments have symbols in front of them such as ! or ?. This just changes the color of the comments when you are utilizing the Better Comments extension. Link here:

[https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments]()

## Debugging

Because of this being an Electron application it has been difficult to set up debugging for both the front-end/back-end. The debugging process is different for each, so I will break it down.

### **Back-End**

Inside Visual Studio Code press `Ctrl+Shift+P` to open the Command Palette and select the `Toggle Auto Attach` option. Select the option labeled `Always`.

![Toggle Auto Attach](https://raw.githubusercontent.com/Ezekias1337/readme-images/main/ptax-automation-app/Toggle_Auto_Attach.gif)

Now press `Ctrl+Shift+D` to go to the debugging section in Visual Studio Code. Any breakpoints you set on files in the public folder will display here and when the breakpoints are hit it will automatically redirect you to this section and show you the values of the variables.

![Show Back-end Breakpoint](https://raw.githubusercontent.com/Ezekias1337/readme-images/main/ptax-automation-app/Show_Breakpoint.PNG)

### Front-End

Run the script `npm run start-main-debug` to start the app. Then open up google chrome and visit: [chrome://inspect/#devices]() in the browser window. You will see the following page:

![Chrome Inspect Page](https://raw.githubusercontent.com/Ezekias1337/readme-images/main/ptax-automation-app/chrome_inspector.PNG)

Click the inspect button underneath the target labeled "PTax Automation App" and the remote dev tools will be opened (**NOTE:** this method requires you to open the dev tools this way, using the built in ones the app has will not work.)

If you do not see it after about 30 seconds of the application being open, press the Configure button next to the option labeled "Discover network targets". In the popup add `localhost:9222` as one of the options and save:

![Add Localhost Settings](https://raw.githubusercontent.com/Ezekias1337/readme-images/main/ptax-automation-app/Add_Localhost_Setting.gif)

Once in the remote dev tools, enable javascript source maps, add the project's src folder to the workspaces, and add it to the Filesystem of the sources tab:

![Configure Devtools](https://raw.githubusercontent.com/Ezekias1337/readme-images/main/ptax-automation-app/Configure_Devtools.gif)

Now you are ready to debug! Simply add the breakpoints in the desired file and the code will halt execution at them:

![Devtools Debugging Demo](https://raw.githubusercontent.com/Ezekias1337/readme-images/main/ptax-automation-app/Devtools_Debugging_Demo.gif)
