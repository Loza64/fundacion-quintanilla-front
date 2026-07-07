import { useSession } from '@/hooks/useSession'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Main() {
  const navigate = useNavigate()
  const { profile } = useSession()

  useEffect(() => {
    const target =
      profile?.role?.name === 'ENCARGADO' ? '/encargado' : '/dashboard'
    navigate(target, { replace: true })
  }, [navigate, profile])

  return null
}

export default Main
