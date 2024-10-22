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
 * @typedef {Object} Quotation
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
 * Add a new quotation.
 * @param {Quotation} quotation - The quotation to add.
 * @returns {Promise<string>} - The ID of the added quotation.
 */
const addQuotation = async (quotation) => {
  try {

    quotation.discount = isNaN(quotation.discount) ? 0 : quotation.discount;

    

    const newQuotationRef = push(ref(db, 'quotations')); // Create a new reference
    //quotation.id = newQuotationRef;
    await set(newQuotationRef, quotation); // Set the quotation data at the new reference
    return newQuotationRef.key; // Return the ID of the added quotation
  } catch (error) {
    console.error("Failed to add quotation:", error);
  }
};

/**
 * Update an existing quotation by id.
 * @param {string} id - The ID of the quotation to update.
 * @param {Partial<Quotation>} updatedQuotation - The updated quotation data.
 * @returns {Promise<void>}
 */
const updateQuotation = async (id, updatedQuotation) => {
  try {
    console.log(id);

    await update(ref(db, `quotations/${id}`), updatedQuotation); // Update the quotation
  } catch (error) {
    console.error("Failed to update quotation:", error);
  }
};

/**
 * Delete a quotation by id.
 * @param {string} id - The ID of the quotation to delete.
 * @returns {Promise<void>}
 */
const deleteQuotation = async (id) => {
  try {
    await remove(ref(db, `quotations/${id}`)); // Remove the quotation
  } catch (error) {
    console.error("Failed to delete quotation:", error);
  }
};

/**
 * Get a quotation by id.
 * @param {string} id - The ID of the quotation to get.
 * @returns {Promise<Quotation | undefined>} - The fetched quotation.
 */
const getQuotation = async (id) => {
  try {
    const snapshot = await get(ref(db, `quotations/${id}`)); // Get the quotation
    return snapshot.val(); // Return the quotation data
  } catch (error) {
    console.error("Failed to get quotation:", error);
  }
};

/**
 * Get all quotations.
 * @returns {Promise<Quotation[]>} - An array of all quotations.
 */
const getAllQuotations = async () => {
  try {
    const quotationsRef = ref(db, 'quotations');
    const snapshot = await get(quotationsRef); // Get all quotations
    //return snapshot.val() ? Object.values(snapshot.val()) : []; // Return the quotations as an array
    return snapshot.exists() ? Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })) : [];
  } catch (error) {
    console.error("Failed to get all quotations:", error);
  }
};

/**
 * Retrieves all quotations where a specific product was included.
 * @param {string} productCode - The product code to search for.
 * @returns {Promise<Quotation[]>} - A promise that resolves to an array of quotations containing the specified product.
 */
export const getQuotationsByProductCode = async (productCode) => {
  try {
    const quotations = await getAllQuotations(); // Fetch all quotations
    const updatedInvoices = quotations.flatMap((invoice) => {
      const matchingProducts = invoice.products.filter(
        (product) => product.productCode === productCode
      );

      return matchingProducts.map((product) => ({
        ...invoice, // Spread the original invoice properties
        ...product, // Spread the matching product properties
      }));
    });

    return updatedInvoices;
  } catch (error) {
    console.error("Failed to retrieve quotations:", error);
    return [];
  }
};

export {
  addQuotation,
  updateQuotation,
  deleteQuotation,
  getQuotation,
  getAllQuotations,
};
