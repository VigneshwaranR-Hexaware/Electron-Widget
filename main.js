'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */

const electron = require('electron');
const Positioner = require('electron-positioner');
const path = require('path');
const url = require('url');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const appTray = electron.Tray
const iconPath = path.join(__dirname, './images/vfs-global.jpg');


let win;

function createWindow() {
  const trayControl = new appTray(iconPath)

  win = new BrowserWindow({
    width: 400,
    height: 650,
    frame: false,
    webPreferences: {
      devTools: true,
      detached: true
    },
    title: "VFS Global",
    icon: './vfs-global.jpg'
  })

  var positioner = new Positioner(win);
  positioner.move('bottomRight', 'trayBottomRight');

  win.setMenu(null);
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //Closing Chat Window and Minimize Window
  win.webContents.on('did-finish-load', () => {
    let code = `const remote = require('electron').remote;var btnClose = document.getElementById("btnClose");
    var btnMinimize = document.getElementById("btnMinimize");

    function googleauthlogin(){
      const exec = require('child_process').exec;
      exec('npm run test')
    }
            btnClose.addEventListener("click",function(){  var window = remote.getCurrentWindow();
		    if (confirm('Are you sure want to exit')) {
		        window.close();
		    }});
         btnMinimize.addEventListener("click",function(){  var window = remote.getCurrentWindow();
		      window.minimize();
		    });`;
    win.webContents.executeJavaScript(code);
  });

  // Open the DevTools.
  win.webContents.openDevTools()
  win.on('closed', () => {
    alert('srini');
    win = null
  });

  trayControl.on('click', function () {
    win.show();
  });

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})



