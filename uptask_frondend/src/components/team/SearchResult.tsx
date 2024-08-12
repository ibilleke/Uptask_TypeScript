import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addUserToProject } from "@/api/TeamAPI";
import { SearchResultProps } from "@/types/index";

export default function SearchResult({user, reset}: SearchResultProps) {
    // const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    const queryclient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            // navigate(location.pathname, {replace: true})
            queryclient.invalidateQueries({queryKey: ["projectTeam", projectId]})
        }
    })
    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }
    return (
        <>
            <p className="mt-10 text-center font-bold">Resultaado: </p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold curser-pointer"
                    onClick={handleAddUserToProject}
                >Agregar al Proyecto</button>
            </div>
        </>
    )
}
