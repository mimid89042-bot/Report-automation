const { app, BrowserWindow } = require('electron'); //imports two tools from electron, 
// app controls life cycle, BrowserWindow creates window to show HTML/CSS/JS


//creates a window using BrowserWindow
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
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