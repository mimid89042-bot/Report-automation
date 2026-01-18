const { app, BrowserWindow } = require('electron'); //imports two tools from electron,


//creates a window using BrowserWindow
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,       // for IPC if needed
            contextIsolation: false,     // allows renderer to access Electron APIs
    }
    })

    win.loadFile('app/index.html');
}

// Waits for electron to finish initializing, then creates window
app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
// Quits app when all windows are closed, except on macOS where it's common for apps to stay open

