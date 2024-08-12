import { isAxiosError } from "axios"
import api from "@/lib/axios"
import { NoteAPIType } from "../types"

export async function createNote({projectId, taskId, formData}: Pick<NoteAPIType, "projectId"|"taskId"|"formData" >) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteNote({projectId, taskId, noteId}: Pick<NoteAPIType, "projectId"|"taskId"|"noteId">) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
        const {data} = await api.delete<string>(url)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}