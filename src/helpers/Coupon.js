const COUPON_HELPER = {
  price: (packagePrice, coupon) => {
    return packagePrice - coupon.coupon_value;
  },
  percent: (packagePrice, coupon) => {
    return packagePrice - ((packagePrice * coupon.coupon_value) / 100);
  },
}

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default COUPON_HELPER;