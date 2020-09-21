import {
  CHANGE_COUNT
} from '../actions';


export const changeCount = () => {
  // localStorage.setItem('currentLanguage', locale);
  let count = 0;
  const shoppingCart = JSON.parse(localStorage.getItem('cart')) || [];
  if (shoppingCart) {
    for (let item of shoppingCart) {
      count += item.quantity;
    }
  }
  return ({
    type: CHANGE_COUNT,
    payload: count
  })
}

