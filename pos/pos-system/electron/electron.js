const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";



let mainWindow;
let productMastery;
let cashInvoice;
let invoiceViewer;
let purchaseInvoice;
let customerMastery;
let addArea;
let addBrand;
let addSubCategory;
let addCategory;


function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1550,
    height: 1024,
    minWidth: 1550,
    minHeight: 1024,
    autoHideMenuBar: false,
    // resizable: false,
    // fullscreen: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Make sure your dev server is running
      : `file://${path.join(__dirname, "../dist/index.html")}` // Ensure index.html exists
  );

  // Menu
  const menu = Menu.buildFromTemplate([
    {
      label: "View",
      submenu: [
        { label: "Reload", role: "reload" },
        { label: "Developer Tools", role: "toggleDevTools" },
      ],
    },
    {
      label: "Navigation",
      submenu: [
        {
          label: "Product Mastery",
          click: () => {
            if (!productMastery || productMastery.isDestroyed()) {
              createProductMasteryWindow();
            } else {
              productMastery.focus();
            }
          },
        },
        {
          label: "Cash Invoice",
          click: () => {
            if (!cashInvoice || cashInvoice.isDestroyed()) {
              createCashInvoiceWindow();
            } else {
              cashInvoice.focus();
            }
          },
        },
        {
          label: "Invoice Viewer",
          click: () => {
            if (!invoiceViewer || invoiceViewer.isDestroyed()) {
              createInvoiceViewerWindow();
            } else {
              invoiceViewer.focus();
            }
          },
        },
        {
          label: "Purchase Invoice",
          click: () => {
            if (!purchaseInvoice || purchaseInvoice.isDestroyed()) {
              createPurchaseInvoiceWindow();
            } else {
              purchaseInvoice.focus();
            }
          },
        },
        {
          label: "Customer Mastery",
          click: () => {
            if (!customerMastery || customerMastery.isDestroyed()) {
              createCustomerMasteryWindow();
            } else {
              customerMastery.focus();
            }
          },
        },
      ],
    },
    {
      label: "Add",
      submenu: [
        {
          label: "Add Brand",
          click: () => {
            if (!addBrand || addBrand.isDestroyed()) {
              createAddBrandWindow();
            } else {
              addBrand.focus();
            }
          },
        },
        {
          label: "Add Area",
          click: () => {
            if (!addArea || addArea.isDestroyed()) {
              createAddAreaWindow();
            } else {
              addArea.focus();
            }
          },
        },
        {
          label: "Add Category",
          click: () => {
            if (!addCategory || addCategory.isDestroyed()) {
              createAddCategoryWindow();
            } else {
              addCategory.focus();
            }
          },
        },
        {
          label: "Add Sub-Category",
          click: () => {
            if (!addSubCategory || addSubCategory.isDestroyed()) {
              createaddSubCategoryWindow();
            } else {
              addSubCategory.focus();
            }
          },
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
}

function createProductMasteryWindow() {
  // if (productMastery && !productMastery.isDestroyed()) {
  //   productMastery.focus();
  //   return;
  // }

  productMastery = new BrowserWindow({
    modal: true,
    show: false,
    // resizable: false,
    width: 1460,
    height: 800,
    minWidth: 1460,
    minHeight: 800,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  productMastery.loadURL(
    isDev
      ? "http://localhost:3000#ProductMastery"
      : `file://${path.join(__dirname, "../dist/index.html#ProductMastery")}`
  );

  productMastery.once("ready-to-show", () => {
    productMastery.show();
  });

  productMastery.on("closed", () => {
    productMastery = null;
  });
}

function createCashInvoiceWindow() {
  // if (cashInvoice && !cashInvoice.isDestroyed()) {
  //   cashInvoice.focus();
  //   return;
  // }

  cashInvoice = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1500,
    height: 800,
    minWidth: 1500,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });
  cashInvoice.loadURL(
    isDev
      ? "http://localhost:3000#CashInvoice"
      : `file://${path.join(__dirname, "../dist/index.html#CashInvoice")}`
  );
  cashInvoice.once("ready-to-show", () => {
    cashInvoice.show();
  });

  cashInvoice.on("closed", () => {
    cashInvoice = null;
  });
}

function createInvoiceViewerWindow() {
  // if (invoiceViewer && !invoiceViewer.isDestroyed()) {
  //   invoiceViewer.focus();
  //   return;
  // }
  invoiceViewer = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1500,
    height: 700,
    minWidth: 1500,
    minHeight: 700,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  invoiceViewer.loadURL(
    isDev
      ? "http://localhost:3000#InvoiceViewer"
      : `file://${path.join(__dirname, "../dist/index.html#InvoiceViewer")}`
  );

  invoiceViewer.once("ready-to-show", () => {
    invoiceViewer.show();
  });

  invoiceViewer.on("closed", () => {
    invoiceViewer = null;
  });
}

function createPurchaseInvoiceWindow() {
  // if (purchaseInvoice && !purchaseInvoice.isDestroyed()) {
  //   purchaseInvoice.focus();
  //   return;
  // }
  purchaseInvoice = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1500,
    height: 700,
    minWidth: 1500,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  purchaseInvoice.loadURL(
    isDev
      ? "http://localhost:3000#PurchaseInvoice"
      : `file://${path.join(__dirname, "../dist/index.html#PurchaseInvoice")}`
  );

  purchaseInvoice.once("ready-to-show", () => {
    purchaseInvoice.show();
  });

  purchaseInvoice.on("closed", () => {
    purchaseInvoice = null;
  });
}

function createCustomerMasteryWindow() {
  // if (customerMastery && !customerMastery.isDestroyed()) {
  //   customerMastery.focus();
  //   return;
  // }
  customerMastery = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1500,
    height: 800,
    minWidth: 1500,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  customerMastery.loadURL(
    isDev
      ? "http://localhost:3000#CustomerMastery"
      : `file://${path.join(__dirname, "../dist/index.html#CustomerMastery")}`
  );
  customerMastery.once("ready-to-show", () => {
    customerMastery.show();
  });

  customerMastery.on("closed", () => {
    customerMastery = null;
  });
}

function createAddBrandWindow() {
  // if (addBrand && !addBrand.isDestroyed()) {
  //   purchaseInvoice.focus();
  //   return;
  // }
  addBrand = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  addBrand.loadURL(
    isDev
      ? "http://localhost:3000#AddBrand"
      : `file://${path.join(__dirname, "../dist/index.html#AddBrand")}`
  );

  addBrand.once("ready-to-show", () => {
    addBrand.show();
  });

  addBrand.on("closed", () => {
    addArea = null;
  });
}
function createAddAreaWindow() {
  // if (addArea && !addArea.isDestroyed()) {
  //   purchaseInvoice.focus();
  //   return;
  // }
  addArea = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  addArea.loadURL(
    isDev
      ? "http://localhost:3000#AddArea"
      : `file://${path.join(__dirname, "../dist/index.html#AddArea")}`
  );

  addArea.once("ready-to-show", () => {
    addArea.show();
  });

  addArea.on("closed", () => {
    addArea = null;
  });
}

function createaddSubCategoryWindow() {
  // if (addSubCategory && !addSubCategory.isDestroyed()) {
  //   addSubCategory.focus();
  // }
  addSubCategory = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  addSubCategory.loadURL(
    isDev
      ? "http://localhost:3000#AddSubCategory"
      : `file://${path.join(__dirname, "../dist/index.html#AddSubCategory")}`
  );

  addSubCategory.once("ready-to-show", () => {
    addSubCategory.show();
  });

  addSubCategory.on("closed", () => {
    addSubCategory = null;
  });
}

function createAddCategoryWindow() {
  // if (addCategory && !addCategory.isDestroyed()) {
  //   addCategory.focus();
  // }
  addCategory = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  addCategory.loadURL(
    isDev
      ? "http://localhost:3000#AddCategory"
      : `file://${path.join(__dirname, "../dist/index.html#AddCategory")}`
  );

  addCategory.once("ready-to-show", () => {
    addCategory.show();
  });

  addCategory.on("closed", () => {
    addCategory = null;
  });
}

function createReturnWindow() {
  // if (invoiceViewer && !invoiceViewer.isDestroyed()) {
  //   invoiceViewer.focus();
  //   return;
  // }
  invoiceViewer = new BrowserWindow({
    // parent: mainWindow,
    modal: true,
    show: false,
    // resizable: false,
    width: 1500,
    height: 700,
    minWidth: 1500,
    minHeight: 700,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  invoiceViewer.loadURL(
    isDev
      ? "http://localhost:3000#Return"
      : `file://${path.join(__dirname, "../dist/index.html#Return")}`
  );

  invoiceViewer.once("ready-to-show", () => {
    invoiceViewer.show();
  });

  invoiceViewer.on("closed", () => {
    invoiceViewer = null;
  });
}


function openInvoiceWindow(invoiceData) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000#Print"
      : `file://${path.join(__dirname, "../dist/index.html#Print")}`
  );

  // Send invoice data to the renderer process after it loads
  win.webContents.once('did-finish-load', () => {
    win.webContents.send('load-invoice-data', invoiceData);
  });
}


ipcMain.on('open-invoice-window', (event, invoiceData) => {
  openInvoiceWindow(invoiceData);
});

app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Rendering Windows
ipcMain.on("openProductMastery", () => {
  createProductMasteryWindow();
});

ipcMain.on("openCashInvoice", () => {
  createCashInvoiceWindow();
});

// Add IPC listener for opening the InvoiceViewer window
ipcMain.on("openInvoiceViewer", () => {
  createInvoiceViewerWindow();
});
ipcMain.on("openPurchaseInvoice", () => {
  createPurchaseInvoiceWindow();
});
ipcMain.on("openCustomerMastery", () => {
  createCustomerMasteryWindow();
});

ipcMain.on("openPurchaseInvoice", () => {
  createPurchaseInvoiceWindow();
});

ipcMain.on("openReturn", () => {
  createReturnWindow();
});
