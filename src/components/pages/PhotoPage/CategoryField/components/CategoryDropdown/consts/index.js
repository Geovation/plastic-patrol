import { sortArrayByObjectKey } from "utils";

export const getDropdownOptions = categoriesObject => {
  const items = [];

  function getNodesInLowestHierarchy(categoriesObject) {
    Object.entries(categoriesObject).forEach(([key, value]) => {
      if (!value.children) {
        items.push({ label: value.label, key: key });
      } else {
        getNodesInLowestHierarchy(value.children);
      }
    });
  }

  getNodesInLowestHierarchy(categoriesObject);
  
  return sortArrayByObjectKey(items, "label");
};
