const multiMenu = [
  {
    id: "research",
    icon: "simple-icon-globe",
    label: "Sản phẩm nguồn",
    to: "/app/research",
    subs: [{
      icon: "simple-icon-list",
      label: "Ngành hàng",
      to: "/app/research"
    },
    {
      icon: "simple-icon-list",
      label: "Danh sách ngành hàng",
      to: "/app/source-category-sets"
    },
    {
      icon: "simple-icon-list",
      label: "Sản phẩm",
      to: "/app/source-products"
    },
    {
      icon: "simple-icon-list",
      label: "Bộ Sản phẩm",
      to: "/app/source-product-sets",
    }
    ]
  },
  {
    id: "ubox-product",
    icon: "iconsminds-data-center",
    label: "Sản phẩm Ubox",
    to: "/app/ubox-products",
    subs: [
      {
        id: "cateList",
        icon: "simple-icon-list",
        label: "Danh sách ngành hàng",
        to: "/app/ubox-categories",
      },
      {
        id: "product",
        icon: "simple-icon-list",
        label: "Danh sách sản phẩm",
        to: "/app/ubox-products"
      },
      {
        id: "calculate",
        icon: "iconsminds-calculator",
        label: "Tính phí dịch vụ",
        to: "/calculator"
      }
    ]
  },
  {
    id: "info-page",
    icon: "simple-icon-info",
    label: "Thông tin tài khoản",
    to: "/info",
  },
  {
    id: "admin-page",
    icon: "simple-icon-people",
    label: "Quản lý tài khoản",
    to: "/app",
    subs: [
      {
        id: "user-detail",
        icon: "simple-icon-list",
        label: "Nhân viên",
        to: "/info/users"
      },
      {
        id: "seller-detail",
        icon: "simple-icon-list",
        label: "Khách hàng",
        to: "/info/sellers"
      },
      {
        id: "address-detail",
        icon: "iconsminds-location-2",
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
