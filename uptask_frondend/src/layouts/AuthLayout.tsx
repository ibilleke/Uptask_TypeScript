import { Outlet } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { ToastContainer } from "react-toastify"
import Logo from "@/components/Logo"

export default function AuthLayout() {
    const queryClient = useQueryClient()
    queryClient.removeQueries({queryKey: ["user"]})
    return (
        <>
            <div className="bg-gray-800 min-h-screen">
                <div className="py-10 lg:py-20 mx-auto w-[450px]">
                    <Logo />
                    <div className="mt-10">
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
