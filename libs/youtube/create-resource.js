module.exports = (properties) => {
  const resource = {};
  const normalizedProps = properties;

  for (const p in properties) {
    const value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      const adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }

  for (const p in normalizedProps) {
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      const propArray = p.split('.');
      let ref = resource;
      for (let pa = 0; pa < propArray.length; pa++) {
        const key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    }
  }

  return resource;
};
