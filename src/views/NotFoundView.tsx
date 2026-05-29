function NotFoundView() {
  const route = location.pathname
  return (
    <div className="flex h-screen flex-col items-center justify-center p-5 text-center font-sans text-gray-800">
      <h1 className="mb-4 text-5xl font-light">404</h1>
      <p className="mb-8 max-w-md text-xl">{route} not found</p>
    </div>
  )
}

export default NotFoundView
