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
 * @typedef {Object} DeliveryNote
 * @property {string} [id]
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
 * Add a new delivery note and update product quantities.
 * @param {DeliveryNote} deliveryNote - The delivery note to add.
 * @returns {Promise<string>} The ID of the added delivery note.
 */
const addDeliveryNote = async (deliveryNote) => {
  try {

    deliveryNote.discount = isNaN(deliveryNote.discount) ? 0 : deliveryNote.discount;

    

    const deliveryNotesRef = ref(db, 'deliveryNotes');
    const newDeliveryNoteRef = push(deliveryNotesRef); // Use push to create a new reference
    await set(newDeliveryNoteRef, deliveryNote); // Set the delivery note data at the new reference


    // Update product quantities

    
    const updates = deliveryNote.products.map(async (invoiceProduct) => {
      if (invoiceProduct.productCode && invoiceProduct.productCode !== "") {
        
        const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
        
        const productSnap = await get(productRef);
        
        
        if (productSnap.exists()) {
          
          
          const productData = productSnap.val();

          const productId = Object.keys(productData)[0];
          
          const productQuantity = isNaN(productData.quantity) ? 0 :  parseInt(productData.quantity);
          const newQuantity = productQuantity - parseInt(invoiceProduct.quantity);

          await update(ref(db, `products/${productId}`), { quantity: newQuantity });

        }  
      }
      
    });

    
    // Wait for all updates to complete
    await Promise.all(updates);

    return newDeliveryNoteRef.key; // Return the ID of the added delivery note
  } catch (error) {
    console.error("Failed to add delivery note and update product quantities:", error);
  }
};

/**
 * Update an existing delivery note and update product quantities.
 * @param {string} id - The ID of the delivery note to update.
 * @param {Partial<DeliveryNote>} updates - The updates to apply.
 * @returns {Promise<void>}
 */
const updateDeliveryNote = async (id, updates) => {
  try {

    const deliveryNoteRef = ref(db, `deliveryNotes/${id}`);
    const existingInvoiceSnap = await get(deliveryNoteRef);

    if (!existingInvoiceSnap.exists()) {
      throw new Error("Delivery note not found");
    }

    const existingInvoice = existingInvoiceSnap.val();
    
    // Initialize revertUpdates as an empty array
    let revertUpdates = [];

    if (existingInvoice.products && existingInvoice.products.length > 0) {
      // Revert previous quantities
      revertUpdates = existingInvoice.products.map(async (invoiceProduct) => {
        const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
        const productSnap = await get(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.val();
          const productQuantity = isNaN(productData.quantity) ? 0 : Number(productData.quantity || 0);
          const newQuantity = productQuantity + Number(invoiceProduct.quantity);  // Revert, so adding the quantity back

          const productId = Object.keys(productData)[0];
          await update(ref(db, `products/${productId}`), { quantity: newQuantity });
        }
      });
    }

    let deductUpdates = [];

    if (updates.products && updates.products.length > 0) {
      // Deduct new quantities if provided
      deductUpdates = updates.products.map(async (invoiceProduct) => {
        const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
        const productSnap = await get(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.val();
          const productQuantity = isNaN(productData.quantity) ? 0 : Number(productData.quantity);
          const newQuantity = productQuantity - Number(invoiceProduct.quantity);

          const productId = Object.keys(productData)[0];
          await update(ref(db, `products/${productId}`), { quantity: newQuantity });
        }
      });
    }
    
    // Wait for all updates to complete
    await Promise.all([...revertUpdates, ...deductUpdates]);

    // Update the delivery note
    await update(deliveryNoteRef, updates);
  } catch (error) {
    console.error("Failed to update delivery note and product quantities:", error);
  }
};


/**
 * Delete a delivery note.
 * @param {string} id - The ID of the delivery note to delete.
 * @returns {Promise<void>}
 */
const deleteDeliveryNote = async (id) => {
  try {
    const deliveryNoteRef = ref(db, `deliveryNotes/${id}`);
    const existingInvoiceSnap = await get(deliveryNoteRef);

    if (!existingInvoiceSnap.exists()) {
      throw new Error("Delivery note not found");
    }

    const existingInvoice = existingInvoiceSnap.val();


    let revertUpdates = [];
    if (existingInvoice.products && existingInvoice.products.length > 0) {

      // Revert the quantities
      revertUpdates = existingInvoice.products.map(async (invoiceProduct) => {
        const productRef = ref(db, `products/${invoiceProduct.productCode}`);
        
        const productSnap = await get(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.val();

          
          const productQuantity = isNaN(productData.quantity) ? 0 : Number(productData.quantity);
          const newQuantity = productQuantity - Number(invoiceProduct.quantity);

          const productId = Object.keys(productData)[0];
          await update(ref(db, `products/${productId}`), { quantity: newQuantity });
        }
      });
    }
    // Delete the delivery note
    await remove(deliveryNoteRef);

    // Wait for all updates to complete
    await Promise.all(revertUpdates);
  } catch (error) {
    console.error("Failed to delete delivery note and revert product quantities:", error);
  }
};

/**
 * Retrieve a delivery note by ID.
 * @param {string} id - The ID of the delivery note to retrieve.
 * @returns {Promise<DeliveryNote>} The delivery note with the given ID.
 */
const getDeliveryNoteById = async (id) => {
  try {
    const deliveryNoteSnap = await get(ref(db, `deliveryNotes/${id}`));
    return deliveryNoteSnap.exists() ? deliveryNoteSnap.val() : null;
  } catch (error) {
    console.error("Failed to retrieve delivery note:", error);
  }
};

/**
 * Retrieve all delivery notes.
 * @returns {Promise<DeliveryNote[]>} All delivery notes.
 */
const getAllDeliveryNote = async () => {
  try {
    const deliveryNotesSnap = await get(ref(db, 'deliveryNotes'));
    return deliveryNotesSnap.exists() ? Object.entries(deliveryNotesSnap.val()).map(([id, data]) => ({ id, ...data })) : [];
  } catch (error) {
    console.error("Failed to retrieve delivery notes:", error);
  }
};

/**
 * Retrieves all delivery notes where a specific product was included.
 * @param {string} productCode - The product code to search for.
 * @returns {Promise<DeliveryNote[]>} - A promise that resolves to an array of delivery notes containing the specified product.
 */
export const getDeliveryNotesByProductCode = async (productCode) => {
  try {
    const deliveryNotesSnap = await get(ref(db, 'deliveryNotes'));

    const deliveryNotes = deliveryNotesSnap.exists() ? deliveryNotesSnap.val() : {};
    
    const updatedInvoices = Object.keys(deliveryNotes).flatMap((id) => {
      const invoice = deliveryNotes[id];
      const matchingProducts = invoice.products.filter(
        (product) => product.productCode === productCode
      );

      // Return updated invoice entries
      return matchingProducts.map((product) => ({
        ...invoice, // Spread the original invoice properties
        ...product, // Spread the matching product properties
      }));
    });

    return updatedInvoices;
  } catch (error) {
    console.error("Failed to retrieve delivery notes:", error);
    return [];
  }
};

export {
  addDeliveryNote,
  updateDeliveryNote,
  deleteDeliveryNote,
  getDeliveryNoteById,
  getAllDeliveryNote,
};
