export function isProxy(obj: any) {
  try {
    // @ts-ignore
    postMessage(obj, window);
  } catch (error) {
    // @ts-ignore
    return error?.code === 25;
  }

  return false;
}

export function resetObject<T extends object>(obj: T) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      delete obj[key];
    }
  }
}

export function getSetDiff<T>(a: Set<T>, b: Set<T>) {
  const diff = new Set<T>();

  for (const value of a.values()) {
    if (!b.has(value)) {
      diff.add(value);
    }
  }

  return diff;
}
