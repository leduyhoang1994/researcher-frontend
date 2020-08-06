const researcherMenu = [
  {
    id: "research",
    icon: "iconsminds-qr-code",
    label: "Research",
    to: "/app/research"
  },
  {
    id: "product",
    icon: "iconsminds-qr-code",
    label: "Products",
    to: "/app/products"
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
