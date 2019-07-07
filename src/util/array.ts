export const areArrayEqual = (arr1: Array<any>, arr2: Array<any>, searchingKeys: Array<string>) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  let index = 0;
  let isSimilar = true;
  while (isSimilar && index < arr1.length) {
    if (searchingKeys) {
      isSimilar = searchingKeys.reduce<boolean>(
        (acc, key) => acc && arr1[index][key] === arr2[index][key], // eslint-disable-line
        true
      );
    } else {
      isSimilar = arr1[index] === arr2[index];
    }
    index++;
  }
  return isSimilar;
};

export const arrayInclude = (arr: Array<any>, searchingObject: Object) =>
  arr.some(element => {
    return Object.entries(searchingObject).reduce<boolean>((acc, [key, value]) => acc && element[key] === value, true);
  });

export const areMapEqual = (map1: Map<any, any>, map2: Map<any, any>) => {
  if (map1.size !== map2.size) {
    return false;
  }
  let isSimilar = true;
  map1.forEach((value, key) => {
    isSimilar = map2.has(key) && map2.get(key) === value;
  });
  return isSimilar;
};
