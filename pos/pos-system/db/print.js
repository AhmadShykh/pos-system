import printJS from 'print-js';

export const printProductList = (invoiceHtml) => {
  printJS({
    printable: invoiceHtml, // The id of the element you want to print
    type: 'html',
    targetStyles: ["*"], // Or specific styles you want to apply
    style: `@import url("../src/index.css");`, // Include CSS file
  });
};