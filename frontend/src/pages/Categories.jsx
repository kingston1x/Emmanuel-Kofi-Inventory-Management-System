import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '../api/categoryApi'
import { useAuth } from '../context/AuthContext'

const Categories = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await getCategoriesApi()
      setCategories(res.data)
    } catch (err) {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const openAddModal = () => {
    setEditingCategory(null)
    setForm({ name: '', description: '' })
    setShowModal(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setForm({ name: category.name, description: category.description || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, form)
        setSuccess('Category updated')
      } else {
        await createCategoryApi(form)
        setSuccess('Category added')
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed')
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategoryApi(id)
      setSuccess('Category deleted')
      fetchCategories()
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Categories</h5>
          {user?.role === 'admin' && (
            <button className="btn btn-primary btn-sm" onClick={openAddModal}>+ Add Category</button>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <table className="table table-bordered table-hover bg-white">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="3" className="text-center">No categories found</td></tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat._id}>
                    <td>{cat.name}</td>
                    <td>{cat.description || '-'}</td>
                    {user?.role === 'admin' && (
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(cat)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingCategory ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories