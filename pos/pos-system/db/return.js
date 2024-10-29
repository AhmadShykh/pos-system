import { ref, push, set, update, child, remove, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from "../src/firebase"; // Import your initialized Firebase database instance


/**
 * @typedef {Object} ReturnProducts
 * @property {InvoiceProduct[]} products
 */


/**
 * Add a new delivery note and update product quantities.
 * @param {ReturnProducts} returnProducts - The delivery note to add.
 * @returns {Promise<string>} The ID of the added delivery note.
 */
export const returnProductsFunc = async (returnProducts) => {
    try {
  
  
      // Update product quantities
  
      
      const updates = returnProducts.products.map(async (invoiceProduct) => {
        if (invoiceProduct.productCode && invoiceProduct.productCode !== "") {
          
          const productRef = query(ref(db, 'products'), orderByChild('productCode'), equalTo(invoiceProduct.productCode));
          
          const productSnap = await get(productRef);
          
          
          if (productSnap.exists()) {
            
            
            const productData = productSnap.val();
  
            const productId = Object.keys(productData)[0];
            
            const productQuantity = isNaN(productData[productId].quantity) ? 0 :  parseInt(productData[productId].quantity);
            const newQuantity = productQuantity + parseInt(invoiceProduct.quantity);
  
            await update(ref(db, `products/${productId}`), { quantity: newQuantity });
  
          }  
        }
        
      });
  
      
      // Wait for all updates to complete
      await Promise.all(updates);
  
    } catch (error) {
      console.error("Failed to return products:", error);
    }
  };
  