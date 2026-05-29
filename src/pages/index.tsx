import AppOutlet from '@/views/AppOutlet'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function Main() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/dashboard')
  }, [navigate])

  return <AppOutlet />
}

export default Main
