import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", semester: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      )

      console.log(response.data)
      navigate('/login')

    } catch(error) {
      console.log(error)

      alert(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div>
      <h1>Study Notes</h1>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="semester"
          placeholder="Enter your semester"
          value={formData.semester}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
export default Register