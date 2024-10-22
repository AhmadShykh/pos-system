import { ref, set, get, update, remove, push, runTransaction } from "firebase/database";
import {db} from "../src/firebase"; // assuming db is your Firebase database instance

/**
 * @typedef {Object} Product
 * @property {string} id - The ID of the product (Firebase auto-generated).
 * @property {string} name - The name of the product.
 * @property {string} productCode - The product code.
 * @property {string} brand - The brand of the product.
 * @property {string} description - The description of the product.
 * @property {string} description2 - The secondary description of the product.
 * @property {string} department - The department of the product.
 * @property {string} category - The category of the product.
 * @property {string} basicUnit - The basic unit of the product.
 * @property {string} status - The status of the product.
 * @property {string} class - The class of the product.
 * @property {string} subCategory - The subcategory of the product.
 * @property {string} uniqueId - The unique ID of the product.
 * @property {number} sellingPrice1 - The first selling price.
 * @property {number} sellingPrice2 - The second selling price.
 * @property {number} sellingPrice3 - The third selling price.
 * @property {string} picture - The picture URL of the product.
 * @property {number} reOrder - The reorder level of the product.
 * @property {string} hsCode - The HS code of the product.
 * @property {number} minOrder - The minimum order quantity.
 * @property {number} maxOrder - The maximum order quantity.
 * @property {string} shelfLife - The shelf life of the product.
 * @property {string} vatType - The VAT type of the product.
 * @property {string} origin - The origin of the product.
 * @property {Array<{ productCode: string, brand: string, name: string, sellingPrice1: number }>} alternatives - The alternative products.
 * @property {Array<{make: string, type: string, remarks: string}>} appliedModels - The applied models.
 * @property {number} quantity - The stock of the product.
 * @property {string} lastSupplier
 * @property {number} lastPurCost
 * @property {number} averageCost
 */

/**
 * Get a product by its product code.
 *
 * @param {string} productCode - The product code to search for.
 * @returns {Promise<Product | undefined>} - Returns the product object if found, otherwise undefined.
 */
const getProductByCode = async (productCode) => {
  const code = productCode.toLowerCase();
  try {
    const snapshot = await get(ref(db, `products`));
    const products = snapshot.val();
    if (products) {
      const product = Object.values(products).find(
        (p) => p.productCode === code
      );
      return product;
    }
    return null;
  } catch (error) {
    console.error("Failed to retrieve product:", error);
    return null;
  }
};

/**
 * Adds a new product to the database and also adds it to the alternatives of other products.
 * Filters out any alternatives with an empty product code.
 *
 * @param {Product} product - The product object to add.
 * @returns {Promise<void>} - Resolves when the add operation is complete.
 */
const addProduct = async (product) => {
  try {
    const productCode = product.productCode.toLowerCase();

    if (await getProductByCode(productCode)) {
      alert("Product already exists with this code");
      return;
    }

    const productRef = push(ref(db, 'products')); // Push to generate a unique ID
    const productId = productRef.key;

    const validAlternatives = (product.alternatives || []).filter(
      (alt) => alt.productCode && alt.productCode.trim() !== ""
    );

    // Add the product
    await set(productRef, {
      ...product,
      id: productId,
      productCode,
      alternatives: validAlternatives,
    });

    // Add the new product as an alternative to other products
    if (validAlternatives.length > 0) {
      for (let alt of validAlternatives) {
        const altSnapshot = await get(ref(db, `products`));
        const altProducts = altSnapshot.val();
        const altProduct = Object.values(altProducts).find(
          (p) => p.productCode === alt.productCode
        );

        if (altProduct) {
          const altProductRef = ref(db, `products/${altProduct.id}`);
          await runTransaction(altProductRef, (existingProduct) => {
            if (existingProduct) {
              existingProduct.alternatives.push({
                productCode,
                brand: product.brand,
                name: product.name,
                sellingPrice1: product.sellingPrice1,
              });
            }
            return existingProduct;
          });
        }
      }
    }

    return productId;
  } catch (error) {
    console.error("Failed to add product and manage alternatives:", error);
  }
};

/**
 * Retrieve a product by ID.
 * @param {string} id - The ID of the product to retrieve.
 * @returns {Promise<Product|null>} The product object if found, or null if not.
 */
const getProductById = async (id) => {
  try {
    const productSnapshot = await get(ref(db, `products/${id}`));
    return productSnapshot.exists() ? productSnapshot.val() : null;
  } catch (error) {
    console.error("Failed to retrieve product by ID:", error);
    return null;
  }
};

/**
 * Retrieve all products.
 * @returns {Promise<Product[]>} An array of products.
 */
const getAllProducts = async () => {
  try {
    const snapshot = await get(ref(db, 'products'));
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error("Failed to retrieve products:", error);
    return [];
  }
};

/**
 * Updates an existing product in the database and handles the addition or removal of alternatives.
 *
 * @param {string} id - The ID of the product to be updated.
 * @param {Partial<Product>} updatedProductData - The updated product data.
 * @returns {Promise<void>} - Resolves when the update operation is complete.
 */
const updateProduct = async (id, updatedProductData) => {
  try {
    const productRef = ref(db, `products/${id}`);
    const snapshot = await get(productRef);
    const existingProduct = snapshot.val();

    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const productCode = existingProduct.productCode;
    const validAlternatives = (updatedProductData.alternatives || []).filter(
      (alt) => alt.productCode && alt.productCode.trim() !== ""
    );

    await update(productRef, updatedProductData);

    // Update alternatives if necessary
    for (let alt of validAlternatives) {
      const altSnapshot = await get(ref(db, `products`));
      const altProducts = altSnapshot.val();
      const altProduct = Object.values(altProducts).find(
        (p) => p.productCode === alt.productCode
      );

      if (altProduct) {
        const altProductRef = ref(db, `products/${altProduct.id}`);
        await runTransaction(altProductRef, (product) => {
          if (product) {
            product.alternatives = product.alternatives.filter(
              (a) => a.productCode !== productCode
            );
            product.alternatives.push({
              productCode,
              brand: updatedProductData.brand || existingProduct.brand,
              name: updatedProductData.name || existingProduct.name,
              sellingPrice1:
                updatedProductData.sellingPrice1 || existingProduct.sellingPrice1,
            });
          }
          return product;
        });
      }
    }
  } catch (error) {
    console.error("Failed to update product and manage alternatives:", error);
  }
};

/**
 * Deletes a product from the database and also removes it from the alternatives of other products.
 *
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<void>} - Resolves when the delete operation is complete.
 */
const deleteProduct = async (id) => {
  try {
    const productSnapshot = await get(ref(db, `products/${id}`));
    const productToDelete = productSnapshot.val();

    if (!productToDelete) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const productCode = productToDelete.productCode;
    const alternatives = productToDelete.alternatives || [];

    // Remove product from alternatives of other products
    for (let alt of alternatives) {
      const altSnapshot = await get(ref(db, `products`));
      const altProducts = altSnapshot.val();
      const altProduct = Object.values(altProducts).find(
        (p) => p.productCode === alt.productCode
      );

      if (altProduct) {
        const altProductRef = ref(db, `products/${altProduct.id}`);
        await runTransaction(altProductRef, (product) => {
          if (product) {
            product.alternatives = product.alternatives.filter(
              (a) => a.productCode !== productCode
            );
          }
          return product;
        });
      }
    }

    // Finally, delete the product
    await remove(ref(db, `products/${id}`));
  } catch (error) {
    console.error("Failed to delete product and manage alternatives:", error);
  }
};

/**
 * Retrieve products with filters applied.
 * 
 * @param {Object} filters - An object with key-value pairs to filter products by.
 *  Example: { category: "Electronics", brand: "Samsung", minPrice: 100, maxPrice: 500 }
 * @returns {Promise<Product[]>} - A list of products that match the filters.
 */
const getProductsWithFilters = async (filters) => {
  try {
    const snapshot = await get(ref(db, 'products'));
    const products = snapshot.exists() ? Object.values(snapshot.val()) : [];
    
    // Apply filters
    return products.filter(product => {
      let isMatch = true;
      
      if (filters.category && product.category !== filters.category) {
        isMatch = false;
      }
      if (filters.brand && product.brand !== filters.brand) {
        isMatch = false;
      }
      if (filters.minPrice && product.sellingPrice1 < filters.minPrice) {
        isMatch = false;
      }
      if (filters.maxPrice && product.sellingPrice1 > filters.maxPrice) {
        isMatch = false;
      }
      
      // Add more filters as needed
      return isMatch;
    });
  } catch (error) {
    console.error("Failed to retrieve products with filters:", error);
    return [];
  }
};

export { addProduct, getProductById, getProductByCode, getAllProducts, updateProduct, deleteProduct,getProductsWithFilters };
