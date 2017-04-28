const { app, BrowserWindow, globalShortcut } = require('electron');
// Module to control application life.
// Module to create native browser window.
// const electronLocalshortcut = require('electron-localshortcut');

const path = require('path');
const url = require('url');

//electron data for local storage
const electronApp = require('electron').electronApp;
const electron_data = require('electron-data');

let files = [
  {
    id: 1,
    source: "github",
    name: "file1",
    createdAt: "April. 22, 2017",
    lastModified: "April 24, 2022"
  },
  {
    id: 2,
    source: "github",
    name: "file2",
    createdAt: "April. 23, 2017",
    lastModified: "April 25, 2022"
  },
  {
    id: 3,
    source: "github",
    name: "fileHow are you",
    createdAt: "April. 24, 2017",
    lastModified: "April 26, 2022"
  },
  {
    id: 4,
    source: "googledrive",
    name: "I'm great how about you.png",
    createdAt: "April. 25, 2017",
    lastModified: "April 27, 2022"
  }
];

electron_data.config(
  {
    filename: 'service_data',
    path: '/home/steven/Desktop/TestFolder',  //path to be determined later

  }
);

electron_data.getOptions()
  .then(options => {
    console.log("what are my options? ", options);
  });

electron_data.set('github', files)
  .then(data => {
    console.log('files: ', files);
  });
electron_data.save()
  .then(msg => {
    msg = 'you have saved the file to path whatevs.';
    console.log(msg);
  });
electron_data.get('github')
  .then(data => {
    console.log('got the data? ', data); //retrieves 'files'
  });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let quickSearch = null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});
    quickSearch = new BrowserWindow({
      width:784,
      height: 81,
      resizable:false,
      frame:false
    });
    quickSearch.hide();

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');
    quickSearch.loadURL('http://localhost:3000/search');

    //shortcut to open and close window with hot keys
    const shortcut = globalShortcut.register('CommandOrControl+Space', () => {
      mainWindow.show();
    });

    if(!shortcut) { console.log('Register failed.'); }

    const quickShortcut = globalShortcut.register('CommandOrControl+G', () => {
      quickSearch.show();
    });
     if(!quickShortcut) { console.log('Register failed for quickShortcut.'); }
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('close', function (event) {
      // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        event.preventDefault();
        mainWindow.hide();
    });

    quickSearch.on('close', function (event) {
      event.preventDefault();
      quickSearch.hide()
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function (event) {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
        // app.quit()
    // }
    event.preventDefault();
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});
