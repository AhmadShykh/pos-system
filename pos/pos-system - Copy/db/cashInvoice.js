import { ref, push, set, update, child, remove, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from "../src/firebase"; // Import your initialized Firebase database instance

/**
 * @typedef {Object} InvoiceProduct
 * @property {number} siNo
 * @property {string} type
 * @property {string} productCode
 * @property {string} brand
 * @property {string} description
 * @property {string} unit
 * @property {number} quantity
 * @property {number} gAmount
 * @property {number} discount
 * @property {number} totalVat
 */

/**
 * @typedef {Object} CashInvoice
 * @property {number} [id]
 * @property {string} terms
 * @property {number} branch
 * @property {string} name
 * @property {number} LOC
 * @property {number} DocNo
 * @property {Date} date
 * @property {string} accCode
 * @property {string} accountName
 * @property {number} refNo
 * @property {string} curr
 * @property {number} rate
 * @property {string} docType
 * @property {string} note
 * @property {number} docNo1
 * @property {string} sMan
 * @property {number} MDoc
 * @property {string} payment
 * @property {string} delPlace
 * @property {string} area
 * @property {string} type
 * @property {number} PONo
 * @property {number} grossTotal
 * @property {number} discount
 * @property {number} disAmount
 * @property {number} vatAmount
 * @property {number} total
 * @property {number} netTotal
 * @property {string} invoiceType
 * @property {InvoiceProduct[]} products
 */
/**
 * Ensures all numeric fields in the invoice are valid numbers and not NaN.
 * If a field is NaN, it sets it to 0.
 * @param {CashInvoice} cashInvoice - The cash invoice to validate.
 */
const sanitizeCashInvoice = (cashInvoice) => {
  // List of numeric fields to sanitize
  const numericFields = [
    'branch', 'LOC', 'DocNo', 'rate', 'refNo', 'docNo1', 'MDoc', 'PONo',
    'grossTotal', 'discount', 'disAmount', 'vatAmount', 'total', 'netTotal'
  ];

  numericFields.forEach(field => {
    if (isNaN(cashInvoice[field])) {
      cashInvoice[field] = 0;
    }
  });

  // Sanitize products as well
  cashInvoice.products.forEach(product => {
    const productNumericFields = ['quantity', 'gAmount', 'discount', 'totalVat'];
    productNumericFields.forEach(productField => {
      if (isNaN(product[productField])) {
        product[productField] = 0;
      }
    });
  });

  return cashInvoice;
};

/**
 * Add a new cash invoice and update product quantities.
 * @param {CashInvoice} cashInvoice - The cash invoice to add.
 * @returns {Promise<string>} The ID of the added cash invoice.
 */
const addCashInvoice = async (cashInvoice) => {
  try {
    //console.log(cashInvoice);
    // Sanitize the cash invoice data
    //cashInvoice = sanitizeCashInvoice(cashInvoice);

    cashInvoice.discount = isNaN(cashInvoice.discount) ? 0 : cashInvoice.discount;

    console.log(cashInvoice);

    // Generate a new ID using push for Firebase
    const newInvoiceRef = push(ref(db, 'cashInvoices'));
    cashInvoice.id = newInvoiceRef.key;

    // Set the cash invoice
    await set(newInvoiceRef, cashInvoice);

    // Update product quantities
    for (const invoiceProduct of cashInvoice.products) {
      const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
      const productSnapshot = await get(productRef);
      const productData = productSnapshot.val();

      if (productData) {
        const productId = Object.keys(productData)[0];
        const product = productData[productId];
        const productQuantity = isNaN(product.quantity) ? 0 :  parseInt(product.quantity);
        const newQuantity = productQuantity - parseInt(invoiceProduct.quantity);
        await update(ref(db, `products/${productId}`), { quantity: newQuantity });
      }
    }

    console.log("Cash Invoice Added");
    return cashInvoice.id;
  } catch (error) {
    console.error("Failed to add cash invoice and update product quantities:", error);
  }
};


/**
 * Update an existing cash invoice and update product quantities.
 * @param {string} id - The ID of the cash invoice to update.
 * @param {Partial<CashInvoice>} updates - The updates to apply.
 * @returns {Promise<void>}
 */
const updateCashInvoice = async (id, updates) => {
  try {
    const existingInvoiceRef = ref(db, `cashInvoices/${id}`);
    const existingInvoiceSnapshot = await get(existingInvoiceRef);
    const existingInvoice = existingInvoiceSnapshot.val();

    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }


    console.log(`Updates: ${JSON.stringify(updates, null, 2)} | Invoice ID: ${id}`);

    if (existingInvoice.products && existingInvoice.products.length > 0) {

    // Revert the previous quantities
      for (const invoiceProduct of existingInvoice.products) 
      {
        const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
        const productSnapshot = await get(productRef);
        const productData = productSnapshot.val();

        if (productData) {
          const productId = Object.keys(productData)[0];
          const product = productData[productId];
          const productQuantity = isNaN(product.quantity) ? 0 : Number(product.quantity || 0);
          const newQuantity = productQuantity - Number(invoiceProduct.quantity || 0);
          await update(ref(db, `products/${productId}`), { quantity: newQuantity });
        }
      }
    }

    // Apply the updates
    await update(existingInvoiceRef, updates);

    // Deduct the new quantities
    if (updates.products) {
      for (const invoiceProduct of updates.products) {
        const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
        const productSnapshot = await get(productRef);
        const productData = productSnapshot.val();

        if (productData) {
          const productId = Object.keys(productData)[0];
          const product = productData[productId];
          const productQuantity = isNaN(product.quantity) ? 0 : Number(product.quantity || 0);
          const newQuantity = productQuantity - Number(invoiceProduct.quantity);
          await update(ref(db, `products/${productId}`), { quantity: newQuantity });

        }
      }
    }
  } catch (error) {
    console.error("Failed to update cash invoice and product quantities:", error);
  }
};

/**
 * Delete a cash invoice.
 * @param {string} id - The ID of the cash invoice to delete.
 * @returns {Promise<void>}
 */
const deleteCashInvoice = async (id) => {
  try {
    const existingInvoiceRef = ref(db, `cashInvoices/${id}`);
    const existingInvoiceSnapshot = await get(existingInvoiceRef);
    const existingInvoice = existingInvoiceSnapshot.val();

    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }

    // Revert the quantities

    if (existingInvoice.products && existingInvoice.products.length > 0) {

      for (const invoiceProduct of existingInvoice.products) {
        const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
        const productSnapshot = await get(productRef);
        const productData = productSnapshot.val();

        if (productData) {
          const productId = Object.keys(productData)[0];
          const product = productData[productId];
          
          const productQuantity = isNaN(product.quantity) ? 0 : Number(product.quantity);
          const newQuantity = productQuantity - Number(invoiceProduct.quantity);
          await update(ref(db, `products/${productId}`), { quantity: newQuantity });


        }

      }
    }

    // Delete the cash invoice
    await remove(existingInvoiceRef);
  } catch (error) {
    console.error("Failed to delete cash invoice and revert product quantities:", error);
  }
};

/**
 * Retrieve a cash invoice by ID.
 * @param {string} id - The ID of the cash invoice to retrieve.
 * @returns {Promise<CashInvoice>} The cash invoice with the given ID.
 */
const getCashInvoiceById = async (id) => {
  try {
    const cashInvoiceRef = ref(db, `cashInvoices/${id}`);
    const cashInvoiceSnapshot = await get(cashInvoiceRef);
    return cashInvoiceSnapshot.val();
  } catch (error) {
    console.error("Failed to retrieve cash invoice:", error);
  }
};

/**
 * Retrieve all cash invoices.
 * @returns {Promise<CashInvoice[]>} All cash invoices.
 */
const getAllCashInvoices = async () => {
  try {
    const cashInvoicesRef = ref(db, 'cashInvoices');
    const cashInvoicesSnapshot = await get(cashInvoicesRef);
    return cashInvoicesSnapshot.val() ? Object.values(cashInvoicesSnapshot.val()) : [];
  } catch (error) {
    console.error("Failed to retrieve cash invoices:", error);
  }
};

/**
 * Generates a random string of the given length.
 * @param {number} length - The length of the string to generate.
 * @returns {string} - The generated random string.
 */
const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Generates random invoice product data for testing.
 * @param {number} count - The number of invoice products to generate.
 * @returns {InvoiceProduct[]} - The generated invoice products.
 */
const generateRandomInvoiceProducts = (count) => {
  const invoiceProducts = [];
  for (let i = 0; i < count; i++) {
    const invoiceProduct = {
      siNo: i + 1,
      type: "Product",
      productCode: generateRandomString(6),
      brand: `Brand ${Math.floor(Math.random() * 10) + 1}`,
      description: `Product description ${i + 1}`,
      unit: "PCS",
      quantity: Math.floor(Math.random() * 100) + 1,
      gAmount: parseFloat((Math.random() * 100).toFixed(2)),
      discount: parseFloat((Math.random() * 10).toFixed(2)),
      totalVat: parseFloat((Math.random() * 5).toFixed(2)),
    };
    invoiceProducts.push(invoiceProduct);
  }
  return invoiceProducts;
};

/**
 * Generates random cash invoice data for testing.
 * @param {number} count - The number of cash invoices to generate.
 * @returns {CashInvoice[]} - The generated cash invoices.
 */
const generateRandomCashInvoices = (count) => {
  const cashInvoices = [];
  for (let i = 0; i < count; i++) {
    const cashInvoice = {
      terms: "Net 30",
      branch: Math.floor(Math.random() * 10) + 1,
      name: `Customer ${i + 1}`,
      LOC: Math.floor(Math.random() * 100),
      DocNo: Math.floor(Math.random() * 10000),
      date: new Date().toISOString(),
      accCode: `ACC-${Math.floor(Math.random() * 1000)}`,
      accountName: `Account ${Math.floor(Math.random() * 100)}`,
      refNo: Math.floor(Math.random() * 1000),
      curr: "USD",
      rate: 1,
      docType: "Sales Invoice",
      note: `Invoice note ${i + 1}`,
      docNo1: Math.floor(Math.random() * 10000),
      sMan: `SalesMan ${Math.floor(Math.random() * 10) + 1}`,
      MDoc: Math.floor(Math.random() * 10000),
      payment: "Cash",
      delPlace: `Delivery Place ${Math.floor(Math.random() * 10) + 1}`,
      area: `Area ${Math.floor(Math.random() * 5)}`,
      type: "Normal",
      PONo: Math.floor(Math.random() * 10000),
      grossTotal: parseFloat((Math.random() * 1000).toFixed(2)),
      discount: parseFloat((Math.random() * 100).toFixed(2)),
      disAmount: parseFloat((Math.random() * 100).toFixed(2)),
      vatAmount: parseFloat((Math.random() * 100).toFixed(2)),
      total: parseFloat((Math.random() * 1000).toFixed(2)),
      netTotal: parseFloat((Math.random() * 1000).toFixed(2)),
      invoiceType: "Standard",
      products: generateRandomInvoiceProducts(Math.floor(Math.random() * 5) + 1),
    };
    cashInvoices.push(cashInvoice);
  }
  return cashInvoices;
};


/**
 * Retrieve cash invoices by product code.
 * @param {string} productCode - The product code to search for.
 * @returns {Promise<CashInvoice[]>} The cash invoices that contain the specified product code.
 */
const getCashInvoicesByProductCode = async (productCode) => {
  try {
    const cashInvoicesRef = ref(db, 'cashInvoices');
    const cashInvoicesSnapshot = await get(cashInvoicesRef);
    const cashInvoices = cashInvoicesSnapshot.val() ? Object.values(cashInvoicesSnapshot.val()) : [];
    
    // Filter invoices that contain the specified product code
    const filteredInvoices = cashInvoices.filter(invoice => 
      invoice.products.some(product => product.productCode === productCode)
    );

    return filteredInvoices;
  } catch (error) {
    console.error("Failed to retrieve cash invoices by product code:", error);
    return [];
  }
};


export {
  addCashInvoice,
  updateCashInvoice,
  deleteCashInvoice,
  getCashInvoiceById,
  getAllCashInvoices,
  generateRandomString,
  generateRandomInvoiceProducts,
  getCashInvoicesByProductCode,
  generateRandomCashInvoices
};
