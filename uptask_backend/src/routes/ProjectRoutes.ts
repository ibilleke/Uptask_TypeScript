import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputErrors } from "../middleware/validation"
import { TaskController } from "../controllers/TaskController"
import { projectExists } from "../middleware/project"
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task"
import { authenticate } from "../middleware/auth"
import { TeamMemberController } from "../controllers/TeamController"
import { NoteController } from "../controllers/NoteController"

const router = Router()

// Autenticación
router.use(authenticate)

/** Routes for projects */
router.post("/",
    body("projectName")
        .notEmpty().withMessage("El Nombre del Proyecto es Obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El Nombre del Cliente es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La Descripción del Proyecto es Obligaoria"),
    handleInputErrors,
    ProjectController.createProject
)

router.get("/", 
    handleInputErrors,
    ProjectController.getAllProjects
)

router.get("/:projectId",
    param("projectId")
        .isMongoId().withMessage("ID no Válido"),
    handleInputErrors,
    ProjectController.getProjectByID
)

router.param("projectId", projectExists)

router.put("/:projectId",
    hasAuthorization,
    param("projectId")
        .isMongoId().withMessage("ID no Válido"),
    body("projectName")
        .notEmpty().withMessage("El Nombre del Proyecto es Obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El Nombre del Cliente es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La Descripción del Proyecto es Obligaoria"),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete("/:projectId",
    hasAuthorization,
    param("projectId")
        .isMongoId().withMessage("ID no Válido"),
    handleInputErrors,
    ProjectController.deleteProject
)

/** Routes for tasks */
router.post("/:projectId/tasks",
    hasAuthorization,
    body("name")
        .notEmpty().withMessage("El Nombre del la Tarea es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La Descripción del la Tarea es Obligaoria"),
    handleInputErrors,
    TaskController.createTask
)

router.get("/:projectId/tasks",
    handleInputErrors,
    TaskController.getProjectTasks
)

router.param("taskId", taskExists)
router.param("taskId", taskBelongsToProject)

router.get("/:projectId/tasks/:taskId",
    param("taskId")
        .isMongoId().withMessage("ID no Válido"),
    handleInputErrors,
    TaskController.getTaskByID
)

router.put("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId")
        .isMongoId().withMessage("ID no Válido"),
    body("name")
        .notEmpty().withMessage("El Nombre del la Tarea es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La Descripción del la Tarea es Obligaoria"),
    handleInputErrors,
    TaskController.updateTask
)

router.delete("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId")
        .isMongoId().withMessage("ID no Válido"),
    handleInputErrors,
    TaskController.deleteTask
)

router.post("/:projectId/tasks/:taskId/status",
    param("taskId")
        .isMongoId().withMessage("ID no Válido"),
    body("status")
        .notEmpty().withMessage("El Estado es Obligatorio"),
    handleInputErrors,
    TaskController.updateStatus
)

/** Routes for teams */
router.post("/:projectId/team",
    body("id")
        .isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.get("/:projectId/team",
    handleInputErrors,
    TeamMemberController.getProjectTeam
)

router.post("/:projectId/team/find",
    body("email")
        .isEmail().toLowerCase().withMessage("El correo electrónico no es válido"),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.delete("/:projectId/team/:userId",
    param("userId")
        .isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    TeamMemberController.deleteMemberByID
)

/** Routes for Notes */
router.post("/:projectId/tasks/:taskId/notes",
    body("content")
        .notEmpty().withMessage("El contenido de la nota es obligatoria"),
    handleInputErrors,
    NoteController.createNote
)

router.get("/:projectId/tasks/:taskId/notes",
    NoteController.getTaskNote
)

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
    param("noteId")
        .isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    NoteController.deleteNote
)

export default router 