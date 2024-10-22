import Dexie from "dexie";

// Create a new Dexie instance
const db = new Dexie("MyDatabase");

// Define your database schema
db.version(1).stores({
  categories: "++id, name, shortForm, subCategories",
  areas: "++id, name, shortForm",
  brands: "++id, name, shortForm",
  customers:
    "++id, name, address, email, legalName, accountType, area, telephone, active, referenceId, deliveryPlace, mobile, vatCode, date, creditLimit, salId, tmId",
  products:
    "++id, name, productCode, brand, description, description2, department, category, basicUnit, status, class, subCategory, uniqueId, sellingPrice1, sellingPrice2, sellingPrice3, picture, reOrder, hsCode, minOrder, maxOrder, shelfLife, vatType, origin, alternatives, appliedModels, quantity, lastSupplier, lastPurCost, averageCost",
  purchaseInvoices: "++id, invoiceNo, supplierName, supplierId, date, products",
  cashInvoices:
    "++id, terms, branch, name, LOC, DocNo, date, accCode, accountName, refNo, curr, rate, docType, note, docNo1, sMan, MDoc, payment, delPlace, area, type, PONo, products, total, details, invoiceType",
  deliveryNote:
    "++id, terms, branch, name, LOC, DocNo, date, accCode, accountName, refNo, curr, rate, docType, note, docNo1, sMan, MDoc, payment, delPlace, area, type, PONo, products, total, details, invoiceType",
  quotations:
    "++id, terms, branch, name, LOC, DocNo, date, accCode, accountName, refNo, curr, rate, docType, note, docNo1, sMan, MDoc, payment, delPlace, area, type, PONo, products, total, details, invoiceType",
});

// Open the database
db.open().catch((err) => {
  console.error("Failed to open db: " + (err.stack || err));
});

export default db;
