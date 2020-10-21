const multiMenu = [
  {
    id: "research",
    icon: "iconsminds-qr-code",
    label: "Sản phẩm nguồn",
    to: "/app/research",
    subs: [{
      icon: "iconsminds-qr-code",
      label: "Ngành hàng",
      to: "/app/research"
    },
    {
      icon: "iconsminds-qr-code",
      label: "Danh sách ngành hàng",
      to: "/app/source-category-sets"
    },
    {
      icon: "iconsminds-qr-code",
      label: "Sản phẩm",
      to: "/app/source-products"
    },
    {
      icon: "iconsminds-qr-code",
      label: "Bộ Sản phẩm",
      to: "/app/source-product-sets",
    }
    ]
  },
  {
    id: "ubox-product",
    icon: "iconsminds-qr-code",
    label: "Sản phẩm Ubox",
    to: "/app/ubox-products",
    subs: [
      {
        id: "cateList",
        icon: "iconsminds-qr-code",
        label: "Danh sách ngành hàng",
        to: "/app/ubox-categories",
      },
      {
        id: "product",
        icon: "iconsminds-qr-code",
        label: "Danh sách sản phẩm",
        to: "/app/ubox-products"
      },
      {
        id: "calculate",
        icon: "iconsminds-qr-code",
        label: "Tính phí dịch vụ",
        to: "/calculator"
      }
    ]
  },
  {
    id: "info-page",
    icon: "iconsminds-qr-code",
    label: "Thông tin tài khoản",
    to: "/info",
  },
  {
    id: "admin-page",
    icon: "iconsminds-qr-code",
    label: "Quản lý tài khoản",
    to: "/app",
    subs: [
      {
        id: "user-detail",
        icon: "iconsminds-qr-code",
        label: "Nhân viên",
        to: "/info/users"
      },
      {
        id: "seller-detail",
        icon: "iconsminds-qr-code",
        label: "Khách hàng",
        to: "/info/sellers"
      },
      {
        id: "address-detail",
        icon: "iconsminds-qr-code",
        label: "Cấu hình địa chỉ",
        to: "/info/address"
      },
    ]
  },
];

let data = [];
let userDetails = localStorage.getItem("user_details");
userDetails = userDetails ? JSON.parse(userDetails) : null;
if (userDetails && userDetails?.authUser?.role) {
  const roles = userDetails.authUser.role || [];

  if(roles.includes("admin")) {
    data = data.concat(multiMenu);
  } else if(roles.includes("user")) {
    let menu = multiMenu.slice(0, multiMenu.length - 1);
    data = data.concat(menu);
  }
  
}

export default data;
