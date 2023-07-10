const getFileNameFromUrl = (url) => {
  const fileName = url.split('/').pop().split('.').shift();
  return fileName;
};

export default getFileNameFromUrl;
