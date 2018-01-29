const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 800, 
      height: 560,
      backgroundColor: '#0e0e0e'
    })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit()
})

app.on("will-quit", function(event) {
    console.log("app quiting")

    if(tvbus) {
      tvbus.quit()
    }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


var TVBus = require("./tvbus.js")

//=================================================
//              tvbus related 
//=================================================
tvbus = new TVBus()

tvbus.on("init", function(data) {
    mainWindow.webContents.send("tvbus-init", data);
});

tvbus.on("start", function(data) {
    mainWindow.webContents.send("tvbus-start", data);
});

tvbus.on("prepared", function(url) {
    mainWindow.webContents.send("tvbus-prepared", url);
});

tvbus.on("stats", function(stats) {
    mainWindow.webContents.send("tvbus-stats", stats);
});

tvbus.on("stop", function(code) {
    if(mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("tvbus-stop", code);
    }
});