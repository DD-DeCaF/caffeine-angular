export const appendOrUpdate = <T>(predicate: (a: T) => (b: T) => boolean) => (array: T[], item: T) => {
  const oldIndex = array.findIndex(predicate(item));
  const index = oldIndex > -1 ? oldIndex : array.length;
  const newArray = [...array];
  newArray.splice(index, 1, item);
  return newArray;
};

export const appendOrUpdateStringList = appendOrUpdate<string>((a) => (b) => a === b);
