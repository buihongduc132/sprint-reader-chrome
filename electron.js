// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  screen,
  Menu,
  MenuItem,
} = require('electron')
const path = require('path')
const { keyTap } = require('robotjs')

const getSelectedText = async () => {
  const currentClipboardContent = clipboard.readText(); // preserve clipboard content
  clipboard.clear();
  try {
    keyTap("c", process.platform === "darwin" ? "command" : "control");
    const selectedText = clipboard.readText();
    await new Promise((resolve) => setTimeout(resolve, 500)); // add a delay before checking clipboard
    clipboard.writeText(currentClipboardContent);
    return selectedText;
  } catch(err) {
    console.warn('Get selected text error', err);
    clipboard.writeText(currentClipboardContent);
    return '';
  }
};

let _window;

// const menu = new Menu()
// menu.append(new MenuItem({
//   label: 'Tabs',
//   submenu: [
//     {
//       role: 'help',
//       accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
//       click: () => {
//         if(_window) {
//           _window.webContents
//             .executeJavaScript(`localStorage.setItem("selectedText", \`${selectedText}\`);`, true);
//         }
//       }
//     }
//   ]
// }))

function createWindow() {
  // mainWindow.loadURL(startUrl);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    // menu,
    // frame: false,
  })
  // mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadFile('src/reader.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  return mainWindow;
}

global.sharedObj = {
  eWindow: null,
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const window = createWindow();
  window.loadFile('src/reader.html');

  // const appMenu = app.applicationMenu;
  // appMenu.append(new MenuItem({
  //   label: 'zzzz',
  //   accelerator: process.platform === 'darwin' ? 'Alt+Cmd+T' : 'Alt+Shift+T',
  //   click: () => {
  //     console.log('qweqweqwe');
  //     window.webContents
  //       .executeJavaScript(`localStorage.setItem("selectedText", \`${selectedText}\`);`, true);
  //   }
  // }));

  // console.log(',,,app.applicationMenu', app.applicationMenu);

  const displays = screen.getAllDisplays()

  const {
    size: displaySize
  } = displays[0];
  const {
    width: displayWidth,
    height: displayHeight,
  } = displaySize;

  window.webContents
    .executeJavaScript(`JSON.stringify(localStorage)`, true)
    .then((valueStr) => {
      const value = JSON.parse(valueStr);
      let {
        readerWidth,
        readerHeight,
      } = value;

      if (!readerWidth) {
        readerWidth = Math.floor(displayWidth * 0.6);
      }

      if (!readerHeight) {
        readerHeight = Math.floor(displayHeight * 0.6);
      }

      window.setSize(+readerWidth, +readerHeight);
    })

  globalShortcut.register('CommandOrControl+Shift+R', async () => {
    const selectedText = await getSelectedText();

    if(selectedText && selectedText.length) {
      await window.webContents
      .executeJavaScript(`localStorage.setItem("selectedText", \`${selectedText.toString()}\`); wordIndex = 0; textReset();`, true);
      
      // window.reload();
      window.show();
    }

  })

  // globalShortcut.register('CommandOrControl+Shift+R', async () => {
  //   const selectedText = await getSelectedText();
  //   await window.webContents
  //     .executeJavaScript(`localStorage.setItem("selectedText", \`${selectedText}\`);`, true);

  //   // window.reload();
  //   window.show();
  // })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.