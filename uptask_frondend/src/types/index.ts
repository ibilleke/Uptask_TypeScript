import { UseFormRegister, FieldErrors } from "react-hook-form"
import { z } from "zod"

/** AUTH & USERS */
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    current_password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})
type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, "email" | "password">
export type UserRegistrationForm = Pick<Auth, "name" | "email" | "password" | "password_confirmation">
export type RequestConfirmationCodeForm = Pick<Auth, "email">
export type ForgotPasswordForm = Pick<Auth, "email">
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">
export type UpdateCurrentUserPasswordForm = Pick<Auth, "current_password" | "password" | "password_confirmation">
export type ConfirmToken = Pick<Auth, "token">
export type CheckPasswordForm = Pick<Auth, "password">

/** Users */
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User,"name"|"email">

/** Notes */
const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
}) 
export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, "content">

/** TASKS */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])
export type TaskStatus = z.infer<typeof taskStatusSchema>
export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(noteSchema.extend({
        createdBy: userSchema
    })),
    createdAt: z.string(),
    updatedAt: z.string()
})
export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true
})
export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, "name" | "description">
export type TaskProject = z.infer<typeof taskProjectSchema>

/** PROJECTS */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(userSchema.pick({_id: true})),
    tasks: z.array(taskProjectSchema),
    team: z.array(userSchema.pick({_id: true}))
})
export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)
export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true
})
export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'>

/** TEAM */
const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, "email">

/** DATOS */
export type GroupedTasks = {
    [key: string]: TaskProject[]
}

/** API */
export type ProjectAPIType = {
    formData: ProjectFormData,
    projectId: Project["_id"]
}
export type TaskAPI = {
    formData: TaskFormData
    projectId: Project["_id"]
    taskId: Task["_id"]
    status: Task["status"]
}
export type NoteAPIType = {
    formData: NoteFormData
    projectId: Project["_id"]
    taskId: Task["_id"]
    noteId: Note["_id"]
}

/** PROPS */
export type ProjectFormProps = {
    register: UseFormRegister<ProjectFormData>
    errors: FieldErrors<ProjectFormData>
}
export type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project["_id"]
}
export type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
}
export type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}
export type TaskCardProps = {
    task: TaskProject
    canEdit: boolean
}
export type EditTaskModalProps = {
    data: Task
    taskId: Task["_id"]
}
export type NewPasswordTokenProps = {
    token: ConfirmToken["token"]
    setToken: React.Dispatch<React.SetStateAction<string>>
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}
export type NewPasswordFormProps = {
    token: ConfirmToken["token"]
}
export type NavMenuProps = {
    userName: User["name"]
}
export type SearchResultProps = {
    user: TeamMember
    reset: () => void
}
export type NotesPanelProps = {
   notes:  Task["notes"]
}
export type NotesDetailProps = {
    note: Note
}
export type ProfileFormProps = {
    data: User
}
export type DropTaskProps = {
    status: string
}