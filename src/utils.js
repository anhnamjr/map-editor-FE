export const reverseCoor = (coor) => {
  let res = [];
  coor.forEach((item) => {
    let a = [item[1], item[0]];
    res.push(a);
  });
  return res;
};

export const reverseCoorMultiPolygon = (coor) => {
  let res = [];
  coor.forEach((item) => {
    let a = reverseCoor(item[0]);
    res.push(a);
  });
  return res;
};
