import { ref,set, get, runTransaction, push } from "firebase/database"; // Import necessary Firebase methods
import { database } from "../src/firebase"; // Import your initialized Firebase database instance

/**
 * @typedef {Object} Brand
 * @property {string} id - The ID of the brand (will be generated by Firebase).
 * @property {string} name - The name of the brand.
 * @property {string} shortForm - The short form of the brand.
 */

/**
 * Add a new brand.
 * @param {Brand} brand - The brand to add.
 * @returns {Promise<string>} The ID of the added brand.
 */
export const addBrand = async (brand) => {
  try {
    const brandsRef = ref(database, 'brands/'); // Reference to brands in the database

    // Generate a new unique ID using Firebase's push method
    const newBrandRef = push(brandsRef); // Create a new child reference with a unique key

    // Run a transaction to handle potential race conditions
    const transactionResult = await runTransaction(brandsRef, (currentBrands) => {
      currentBrands = currentBrands || {}; // Initialize brands if none exist yet

      // Check if the brand already exists
      const brandExists = Object.values(currentBrands).some(existingBrand => 
        existingBrand.name.toLowerCase() === brand.name.toLowerCase() ||
        existingBrand.shortForm.toLowerCase() === brand.shortForm.toLowerCase()
      );

      if (brandExists) {
        return; // Abort the transaction if the brand already exists
      }

      // Add the new brand to the current brands using the new unique ID
      currentBrands[newBrandRef.key] = { ...brand, id: newBrandRef.key }; // Add the new brand

      return currentBrands; // Return the updated brands
    });

    // If the transaction was successful and a new brand was added
    if (transactionResult.committed) {
      await set(newBrandRef, { ...brand, id: newBrandRef.key }); // Set brand data in Firebase
      return newBrandRef.key; // Return the ID of the added brand
    } else {
      throw new Error("Brand already exists.");
    }
  } catch (error) {
    console.error("Failed to add brand:", error);
    throw new Error("Failed to add brand");
  }
};

/**
 * Retrieve all brands.
 * @returns {Promise<Brand[]>} An array of brands.
 */
export const getAllBrands = async () => {
  try {
    const brandsRef = ref(database, 'brands/'); // Reference to brands in the database
    const snapshot = await get(brandsRef); // Retrieve the data
    if (snapshot.exists()) {
      const brands = [];
      snapshot.forEach((childSnapshot) => {
        const brand = childSnapshot.val(); // Get the brand data
        brands.push({ id: childSnapshot.key, ...brand }); // Push the brand with its ID
      });
      return brands; // Return the array of brands
    } else {
      console.log("No brands found.");
      return []; // Return an empty array if no brands are found
    }
  } catch (error) {
    console.error("Failed to retrieve brands:", error);
    throw new Error("Failed to retrieve brands");
  }
};


/**
 * Delete a brand by a property inside the object.
 * @param {string} id - The ID to match against the property inside the brand object.
 * @returns {Promise<void>} Resolves when the brand is deleted.
 */
export const deleteBrand = async (id) => {
  try {
    const brandsRef = ref(database, 'brands'); // Reference to all brands in the database
    const snapshot = await get(brandsRef); // Retrieve all brands

    if (snapshot.exists()) {
      let brandToDeleteKey = null;

      // Find the key of the brand to delete by matching the property with id
      snapshot.forEach((childSnapshot) => {
        const brand = childSnapshot.val();

        if (brand.shortForm === id) { // Match the inner property `id` with the provided id parameter
          brandToDeleteKey = childSnapshot.key;
        }
      });

      if (brandToDeleteKey) {
        // Delete the specific brand entry by its key
        const brandRef = ref(database, `brands/${brandToDeleteKey}`);
        await set(brandRef, null);
        console.log(`Brand with ID ${id} has been deleted.`);
      } else {
        console.log(`No brand found with ID ${id}.`);
      }
    } else {
      console.log("No brands found.");
    }
  } catch (error) {
    console.error("Failed to delete brand:", error);
    throw new Error("Failed to delete brand");
  }
};
