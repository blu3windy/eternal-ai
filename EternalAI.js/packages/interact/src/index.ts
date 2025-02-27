import * as Immutable from 'immutable';

export const abc = () => {
  console.log('abc', Immutable);
  const map = Immutable.Map([
    ['a', 1],
    ['b', 2],
  ]);
  console.log(map);
};

abc();
