const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const saveImageAsBase64 = async (file) => {
  const base64String = await fileToBase64(file);
  // Store base64String in the database
  return base64String;
};
