import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSuppliersApi, createSupplierApi, updateSupplierApi, deleteSupplierApi } from '../api/vendorApi'
import { useAuth } from '../context/AuthContext'

const Suppliers = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const res = await getSuppliersApi()
      setSuppliers(res.data)
    } catch (err) {
      setError('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSuppliers() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const openAddModal = () => {
    setEditingSupplier(null)
    setForm({ name: '', email: '', phone: '', address: '' })
    setShowModal(true)
  }

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier)
    setForm({ name: supplier.name, email: supplier.email || '', phone: supplier.phone || '', address: supplier.address || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingSupplier) {
        await updateSupplierApi(editingSupplier._id, form)
        setSuccess('Supplier updated')
      } else {
        await createSupplierApi(form)
        setSuccess('Supplier added')
      }
      setShowModal(false)
      fetchSuppliers()
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed')
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return
    try {
      await deleteSupplierApi(id)
      setSuccess('Supplier deleted')
      fetchSuppliers()
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
          <h5 className="mb-0">Suppliers</h5>
          {user?.role === 'admin' && (
            <button className="btn btn-primary btn-sm" onClick={openAddModal}>+ Add Supplier</button>
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
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No suppliers found</td></tr>
              ) : (
                suppliers.map(sup => (
                  <tr key={sup._id}>
                    <td>{sup.name}</td>
                    <td>{sup.email || '-'}</td>
                    <td>{sup.phone || '-'}</td>
                    <td>{sup.address || '-'}</td>
                    {user?.role === 'admin' && (
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(sup)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sup._id)}>Delete</button>
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
                <h5 className="modal-title">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h5>
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
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingSupplier ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers