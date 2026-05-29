import { useNavigate } from 'react-router-dom'

function ForbiddenView({
  details = ' No tienes permiso para acceder a esta área',
}: {
  details?: string
}) {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen flex-col items-center justify-center p-5 text-center font-sans text-gray-800">
      <h1 className="mb-4 text-5xl font-light">401</h1>
      <p className="mb-8 max-w-md text-xl">{details}</p>
      <button
        onClick={() => {
          navigate(-1)
        }}
        className="rounded-md border border-gray-300 px-6 py-2 transition-colors hover:bg-gray-50"
      >
        Regresar
      </button>
    </div>
  )
}

export default ForbiddenView
