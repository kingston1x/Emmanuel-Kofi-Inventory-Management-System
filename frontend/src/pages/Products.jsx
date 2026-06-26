import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../api/productApi'
import { getCategoriesApi } from '../api/categoryApi'
import { getSuppliersApi } from '../api/vendorApi'
import { useAuth } from '../context/AuthContext'

const Products = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '', quantity: '', category: '', supplier: ''
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes, supRes] = await Promise.all([
        getProductsApi(search),
        getCategoriesApi(),
        getSuppliersApi()
      ])
      setProducts(prodRes.data)
      setCategories(catRes.data)
      setSuppliers(supRes.data)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setForm({ name: '', description: '', price: '', quantity: '', category: '', supplier: '' })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      category: product.category?._id || '',
      supplier: product.supplier?._id || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingProduct) {
        await updateProductApi(editingProduct._id, form)
        setSuccess('Product updated successfully')
      } else {
        await createProductApi(form)
        setSuccess('Product added successfully')
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed')
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProductApi(id)
      setSuccess('Product deleted successfully')
      fetchData()
    } catch (err) {
      setError('Delete failed')
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">Inventory System</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">Hello, {user?.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Products</h5>
          {user?.role === 'admin' && (
            <button className="btn btn-primary btn-sm" onClick={openAddModal}>
              + Add Product
            </button>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-white">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  {user?.role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No products found</td></tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category?.name || '-'}</td>
                      <td>{product.supplier?.name || '-'}</td>
                      <td>${product.price}</td>
                      <td>
                        <span className={`badge ${product.quantity < 5 ? 'bg-danger' : 'bg-success'}`}>
                          {product.quantity}
                        </span>
                      </td>
                      {user?.role === 'admin' && (
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => openEditModal(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    <div className="col mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Supplier</label>
                    <select
                      className="form-select"
                      value={form.supplier}
                      onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                      required
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map(sup => (
                        <option key={sup._id} value={sup._id}>{sup.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products