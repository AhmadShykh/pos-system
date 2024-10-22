import { getDatabase, ref, push, set, get, child, update, remove } from "firebase/database";
import {db} from "../src/firebase"; // assuming db is your Firebase database instance

/**
 * @typedef {Object} InvoiceProduct
 * @property {string} id
 * @property {string} productCode
 * @property {string} name
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} PurchaseInvoice
 * @property {string} [id]
 * @property {string} invoiceNo
 * @property {string} supplierName
 * @property {string} supplierId
 * @property {Date} date
 * @property {Array<InvoiceProduct>} products
 */

/**
 * Add a new purchase invoice and update product quantities.
 * @param {PurchaseInvoice} purchaseInvoice - The purchase invoice to add.
 * @returns {Promise<string>} The ID of the added purchase invoice.
 */
const addPurchaseInvoice = async (purchaseInvoice) => {
  try {
    const invoiceRef = push(ref(db, "purchaseInvoices"));
    const invoiceId = invoiceRef.key;
    
    // Add the purchase invoice
    await set(invoiceRef, {
      ...purchaseInvoice,
      id: invoiceId,
    });

    // Update product quantities
    for (const purchasedProduct of purchaseInvoice.products) {
      const productRef = ref(db, `products/${purchasedProduct.productCode}`);
      const snapshot = await get(productRef);

      if (snapshot.exists()) {
        const product = snapshot.val();
        const updatedQuantity =
          (parseInt(product.quantity) || 0) + parseInt(purchasedProduct.quantity);
        await update(productRef, {
          quantity: updatedQuantity,
          lastSupplier: purchaseInvoice.supplierName,
          lastPurCost: parseFloat(purchasedProduct.price),
        });
      } else {
        console.warn(
          `Product with productCode ${purchasedProduct.productCode} not found.`
        );
      }
    }

    return invoiceId;
  } catch (error) {
    console.error("Failed to add purchase invoice and update product quantities:", error);
    throw error;
  }
};

/**
 * Update an existing purchase invoice and adjust product quantities.
 * @param {string} id - The ID of the purchase invoice to update.
 * @param {Partial<PurchaseInvoice>} updates - The updates to apply.
 * @returns {Promise<void>}
 */
const updatePurchaseInvoice = async (id, updates) => {
  try {
    const invoiceRef = ref(db, `purchaseInvoices/${id}`);
    const snapshot = await get(invoiceRef);

    if (!snapshot.exists()) {
      throw new Error(`Purchase invoice with ID ${id} not found.`);
    }

    const existingInvoice = snapshot.val();

    // Adjust product quantities based on changes in the invoice
    const oldProductsMap = new Map(
      existingInvoice.products.map((p) => [p.productCode, p])
    );

    for (const updatedProduct of updates.products) {
      const oldProduct = oldProductsMap.get(updatedProduct.productCode);
      const quantityDifference =
        Number(updatedProduct.quantity) - (oldProduct ? Number(oldProduct.quantity) : 0);

      const productRef = ref(db, `products/${updatedProduct.productCode}`);
      const productSnapshot = await get(productRef);

      if (productSnapshot.exists()) {
        const product = productSnapshot.val();
        await update(productRef, {
          quantity: Number(product.quantity || 0) + Number(quantityDifference),
        });
      } else {
        console.warn(`Product with productCode ${updatedProduct.productCode} not found.`);
      }
    }

    // Update the purchase invoice
    await update(invoiceRef, updates);
  } catch (error) {
    console.error("Failed to update purchase invoice and adjust product quantities:", error);
    throw error;
  }
};

/**
 * Retrieve all purchase invoices.
 * @returns {Promise<PurchaseInvoice[]>} All purchase invoices.
 */
const getAllPurchaseInvoices = async () => {
  try {
    const snapshot = await get(ref(db, "purchaseInvoices"));
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error("Failed to retrieve purchase invoices:", error);
    throw error;
  }
};

/**
 * Retrieve a purchase invoice by ID.
 * @param {string} id - The ID of the purchase invoice to retrieve.
 * @returns {Promise<PurchaseInvoice>} The purchase invoice with the given ID.
 */
const getPurchaseInvoiceById = async (id) => {
  try {
    const snapshot = await get(ref(db, `purchaseInvoices/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Failed to retrieve purchase invoice:", error);
    throw error;
  }
};

/**
 * Delete a purchase invoice.
 * @param {string} id - The ID of the purchase invoice to delete.
 * @returns {Promise<void>}
 */
const deletePurchaseInvoice = async (id) => {
  try {
    await remove(ref(db, `purchaseInvoices/${id}`));
  } catch (error) {
    console.error("Failed to delete purchase invoice:", error);
    throw error;
  }
};

/**
 * Retrieves all purchase invoices where a specific product was included and returns an array of objects with both invoice and product data.
 * @param {string} productCode - The product code to search for.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects, each containing the invoice data and product data.
 */
export const getPurchaseInvoicesWithProductDetails = async (productCode) => {
  try {
    const snapshot = await get(ref(db, "purchaseInvoices"));
    if (!snapshot.exists()) return [];

    const invoices = Object.values(snapshot.val());
    const detailedInvoices = invoices.flatMap((invoice) =>
      invoice.products
        .filter((product) => product.productCode === productCode)
        .map((product) => ({
          id: invoice.id,
          invoiceNo: invoice.invoiceNo,
          supplierName: invoice.supplierName,
          supplierId: invoice.supplierId,
          date: invoice.date,
          productCode: product.productCode,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          total: Number(product.quantity) * Number(product.price),
        }))
    );

    return detailedInvoices;
  } catch (error) {
    console.error("Failed to retrieve purchase invoices with product details:", error);
    throw error;
  }
};

export {
  addPurchaseInvoice,
  updatePurchaseInvoice,
  getAllPurchaseInvoices,
  getPurchaseInvoiceById,
  deletePurchaseInvoice,
};
