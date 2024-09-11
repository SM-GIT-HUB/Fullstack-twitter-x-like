import { Link } from "react-router-dom"

function ErrorPage() {
  return (
    <>
        <div className="h-screen w-full place-content-center px-4">
        <div className="text-center">
            <h1 className="text-9xl font-black text-gray-200">404</h1>

            <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>

            <p className="mt-4 text-gray-500">{`We can't find that page.`}</p>

            <Link to={'/'}>
            <button className="btn btn-sm btn-primary text-white rounded-full mt-[10px]">Go Back Home</button>
            </Link>
        </div>
        </div>
    </>
  )
}

export default ErrorPage