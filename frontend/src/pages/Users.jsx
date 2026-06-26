import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

const Users = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/auth/users')
      setUsers(res.data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await axiosInstance.delete(`/auth/users/${id}`)
      setSuccess('User deleted')
      fetchUsers()
    } catch (err) {
      setError('Delete failed')
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">Emmanuel Kofi Inventory Management System</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">Hello, {user?.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <h5 className="mb-4">Users</h5>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <table className="table table-bordered table-hover bg-white">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role}</span></td>
                    <td>
                      {u._id !== user.id && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Users