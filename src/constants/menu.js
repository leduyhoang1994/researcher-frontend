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
];

let data = [];
let userDetails = localStorage.getItem("user_details");
userDetails = userDetails ? JSON.parse(userDetails) : null;
if (userDetails && userDetails.roles) {
  userDetails.roles.forEach(role => {
    if (role.name === "student" || role.name === "super admin") {

    }
    if (role.name === "instructor" || role.name === "collaborator" || role.name === "super admin") {
      // data = data.concat(classManagersMenu);
    }
  });
}
data = data.concat(multiMenu);

export default data;
