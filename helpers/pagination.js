module.exports = (paginationObject, query, countProducts) => {
  if (query.page) {
    paginationObject.currentPage = parseInt(query.page);
  }
  paginationObject.skip = (paginationObject.currentPage - 1) * paginationObject.limit;
  paginationObject.totalPages = Math.ceil(countProducts / paginationObject.limit);
  return paginationObject;
}