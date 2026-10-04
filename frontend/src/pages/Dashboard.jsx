import {useNavigate} from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div>
      <h1>Study Notes Dashboard</h1>
      <p>Welcome to your dashboard</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard