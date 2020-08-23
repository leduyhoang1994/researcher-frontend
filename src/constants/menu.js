const researcherMenu = [
  {
    id: "research",
    icon: "iconsminds-qr-code",
    label: "Ngành hàng",
    to: "/app/research"
  },
  {
    id: "cateList",
    icon: "iconsminds-qr-code",
    label: "Danh sách ngành hàng",
    to: "/app/cate-sets"
  },
  {
    id: "product",
    icon: "iconsminds-qr-code",
    label: "Sản phẩm",
    to: "/app/products"
  },
  {
    id: "productSet",
    icon: "iconsminds-qr-code",
    label: "Bộ Sản phẩm",
    to: "/app/product-sets"
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
data = data.concat(researcherMenu);

export default data;
