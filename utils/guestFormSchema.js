import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters long")
    .max(20, "Name cannot exceed 20 characters")
    .required("Name is required"),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be at least 10 digits long")
    .max(10, "Phone number cannot exceed 10 digits")
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be only digits"),
});
export default validationSchema;
