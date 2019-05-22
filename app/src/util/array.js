export const deleteAddress = (address, array, diveFunction = el => el) => {
    const copy = [...array];
    const index = copy.findIndex(element => diveFunction(element) === address);
    copy.splice(index, 1);
    return copy;
};

export const updateAddress = (
    address,
    array,
    newStatus,
    diveFunction = el => el
) => {
    const copy = [...array];
    const index = copy.findIndex(element => diveFunction(element) === address);
    copy[index].status = newStatus;
    return copy;
};

export const areArrayEqual = (arr1, arr2, searchingKeys) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    let index = 0;
    let isSimilar = true;
    while (isSimilar && index < arr1.length) {
        if (searchingKeys) {
            isSimilar = searchingKeys.reduce(
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

export const arrayInclude = (arr, searchingObject) =>
    arr.some(element => {
        return Object.entries(searchingObject).reduce(
            (acc, [key, value]) => acc && element[key] === value,
            true
        );
    });

export const updateKeyInMap = (originalMap, key, newValue) => {
    const map = new Map([...originalMap]);
    map.set(key, newValue);
    return map;
};

export const areMapEqual = (map1, map2) => {
    if (map1.size !== map2.size) {
        return false;
    }
    let isSimilar = true;
    map1.forEach((value, key) => {
        isSimilar = map2.has(key) && map2.get(key) === value;
    });
    return isSimilar;
};

export const deleteKeyInMap = (originalMap, key) => {
    const map = new Map([...originalMap]);
    map.delete(key);
    return map;
};
