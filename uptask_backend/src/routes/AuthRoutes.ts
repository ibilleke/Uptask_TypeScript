import { Router } from "express";
import { body, param } from "express-validator"
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post("/create-account",
    body("name")
        .notEmpty().withMessage("El nombre es obligatorio"),
    body("password")
        .isLength({min: 8}).withMessage("La contraseña debe de contener mínimo 8 caracteres"),
    body("password_confirmation")
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error("Las contraseñas deben ser iguales")
            }
            return true
        }),
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido"),
    handleInputErrors,
    AuthController.createAccount
)

router.post("/confirm-account",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacío"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post("/login",
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria"),
    handleInputErrors,
    AuthController.login
)

router.post("/request-code",
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido"),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post("/forgot-password",
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido"),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post("/validate-token",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacío"),
    handleInputErrors,
    AuthController.validateToken
)

router.post("/update-password/:token",
    param("token")
        .isNumeric().withMessage("Token no valido"),
    body("password")
        .isLength({min: 8}).withMessage("La contraseña debe de contener mínimo 8 caracteres"),
    body("password_confirmation")
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error("Las contraseñas deben ser iguales")
            }
            return true
        }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get("/user",
    authenticate,
    AuthController.user
)

/** PROFILE */
router.put("/profile",
    authenticate,
    body("name")
        .notEmpty().withMessage("El nombre es obligatorio"),
    body("email")
        .isEmail().withMessage("El correo electrónico no es válido"),
    handleInputErrors,
    AuthController.updateProfile
)

router.post("/update-password",
    authenticate,
    body("current_password")
        .notEmpty().withMessage("La contraseña actual es obligtoria"),
    body("password")
        .isLength({min: 8}).withMessage("La contraseña debe de contener mínimo 8 caracteres"),
    body("password_confirmation")
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error("Las contraseñas deben ser iguales")
            }
            return true
        }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post("/check-password",
    authenticate,
    body("password")
        .notEmpty().withMessage("La contraseña es obligtoria"),
    handleInputErrors,
    AuthController.checkPassword
)

export default router