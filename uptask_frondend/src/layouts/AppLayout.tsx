import { Outlet, Link, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useAuth } from "@/hooks/useAuth"
import NavMenu from "@/components/NavMenu"
import Logo from "@/components/Logo"
import "react-toastify/dist/ReactToastify.css"

export default function AppLayout() {
    const {data, isError, isLoading} = useAuth()
    if(isLoading) return "cargando..."
    if(isError) {
        return <Navigate to="/Auth/login"/>
    }
    if(data) return (
        <>
            <header className="bg-gray-800 p-5">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-64">
                        <Link to={"/"}>
                            <Logo />
                        </Link>
                    </div>

                    <NavMenu
                        userName={data.name}
                    />
                </div>
            </header>
            <section className="max-w-screen-2xl mx-auto mt-10 p-5">
                <Outlet />
            </section>
            <footer className="py-5">
                <p className="text-center"> UpTask {new Date().getFullYear()}. Todos los derechos reservados</p>
            </footer>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
