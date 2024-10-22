import { getDatabase, ref, set, push, get, update, remove, query, equalTo, orderByChild } from "firebase/database";

// Initialize the database
import {db} from "../src/firebase";

/**
 * @typedef {Object} Customer
 * @property {string} [id] - The ID of the customer (Firebase push ID).
 * @property {string} name - The name of the customer.
 * @property {string} address - The address of the customer.
 * @property {string} email - The email of the customer.
 * @property {string} legalName - The legal name of the customer.
 * @property {string} accountType - The account type of the customer.
 * @property {string} area - The area of the customer.
 * @property {string} telephone - The telephone number of the customer.
 * @property {string} active - The status of the customer (e.g., "Yes" or "No").
 * @property {string} referenceId - A reference ID for the customer.
 * @property {string} deliveryPlace - The delivery place of the customer.
 * @property {string} mobile - The mobile number of the customer.
 * @property {string} vatCode - The VAT code of the customer.
 * @property {Date} date - The date associated with the customer.
 * @property {number} creditLimit - The credit limit of the customer.
 * @property {string} salId - The sales ID associated with the customer.
 * @property {string} tmId - The team ID associated with the customer.
 */

/**
 * Add a new customer.
 * @param {Customer} customer - The customer to add.
 * @returns {Promise<string>} The ID of the added customer.
 */
const addCustomer = async (customer) => {
  try {
    const customerRef = push(ref(db, 'customers')); // Generates a unique ID
    await set(customerRef, { ...customer, id: customerRef.key });
    return customerRef.key;
  } catch (error) {
    console.error("Failed to add customer:", error);
  }
};

/**
 * Retrieve all customers.
 * @returns {Promise<Customer[]>} An array of customers.
 */
const getAllCustomers = async () => {
  try {
    const snapshot = await get(ref(db, 'customers'));
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error("Failed to retrieve customers:", error);
  }
};

/**
 * Retrieve all customers where accountType is 'Supplier'.
 * @returns {Promise<Customer[]>} The customers with accountType 'Supplier'.
 */
const getSuppliers = async () => {
  try {
    const suppliersQuery = query(ref(db, 'customers'), orderByChild('accountType'), equalTo('Supplier'));
    const snapshot = await get(suppliersQuery);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error("Failed to retrieve suppliers:", error);
    return [];
  }
};

/**
 * Retrieve all customers where accountType is 'Customer'.
 * @returns {Promise<Customer[]>} The customers with accountType 'Customer'.
 */
const getCustomers = async () => {
  try {
    const customersQuery = query(ref(db, 'customers'), orderByChild('accountType'), equalTo('Customer'));
    const snapshot = await get(customersQuery);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error("Failed to retrieve customers:", error);
    return [];
  }
};

/**
 * Update a customer by ID.
 * @param {string} id - The ID of the customer to update.
 * @param {Partial<Customer>} updatedCustomer - The updated customer data.
 * @returns {Promise<void>}
 */
const updateCustomer = async (id, updatedCustomer) => {
  try {
    const customerRef = ref(db, `customers/${id}`);
    await update(customerRef, updatedCustomer);
  } catch (error) {
    console.error("Failed to update customer:", error);
  }
};

/**
 * Delete a customer by ID.
 * @param {string} id - The ID of the customer to delete.
 * @returns {Promise<void>}
 */
const deleteCustomer = async (id) => {
  try {
    const customerRef = ref(db, `customers/${id}`);
    await remove(customerRef);
  } catch (error) {
    console.error("Failed to delete customer:", error);
  }
};

/**
 * Retrieve a customer by ID.
 * @param {string} id - The ID of the customer to retrieve.
 * @returns {Promise<Customer|null>} The customer object if found, or null if not.
 */
const getCustomerById = async (id) => {
  try {
    const customerRef = ref(db, `customers/${id}`);
    const snapshot = await get(customerRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Failed to retrieve customer by ID:", error);
    return null;
  }
};

export {
  addCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  getSuppliers,
  getCustomers,
};

