const createTree = (arr, parentId = "", counter = { val: 0 }) => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parentId === parentId) {
      counter.val++;
      const newItem = item.toObject();
      newItem.index = counter.val;
      newItem.id = item.id;
      const children = createTree(arr, item.id, counter);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  })
  return tree;
}

module.exports.tree = (arr, parentId = "") => {
  return createTree(arr, parentId);
}
