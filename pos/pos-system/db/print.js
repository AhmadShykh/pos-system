import printJS from 'print-js';

export const printProductList = () => {
  printJS({
    printable: 'product-list', // The id of the element you want to print
    type: 'html',
    style: '.product-list { font-size: 14px; }' // Optional CSS styling for the print
  });
};