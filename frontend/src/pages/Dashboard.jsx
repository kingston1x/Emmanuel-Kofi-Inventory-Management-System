import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getProductsApi } from '../api/productApi'
import { getCategoriesApi } from '../api/categoryApi'
import { getSuppliersApi } from '../api/vendorApi'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: 0, categories: 0, suppliers: 0, lowStock: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, supRes] = await Promise.all([
          getProductsApi(),
          getCategoriesApi(),
          getSuppliersApi()
        ])
        const products = prodRes.data
        setStats({
          products: products.length,
          categories: catRes.data.length,
          suppliers: supRes.data.length,
          lowStock: products.filter(p => p.quantity < 5).length
        })
      } catch (err) {
        console.error('Failed to fetch stats')
      }
    }
    fetchStats()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">Inventory System</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">Hello, {user?.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <h5 className="mb-4">Dashboard</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card text-white bg-primary p-3 pointer" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <h6 className="card-title">Products</h6>
                <p className="card-text fs-4 fw-bold">{stats.products}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success p-3" onClick={() => navigate('/categories')} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <h6 className="card-title">Categories</h6>
                <p className="card-text fs-4 fw-bold">{stats.categories}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning p-3" onClick={() => navigate('/suppliers')} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <h6 className="card-title">Suppliers</h6>
                <p className="card-text fs-4 fw-bold">{stats.suppliers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger p-3">
              <div className="card-body">
                <h6 className="card-title">Low Stock</h6>
                <p className="card-text fs-4 fw-bold">{stats.lowStock}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-3">
            <div className="list-group">
              <button className="list-group-item list-group-item-action" onClick={() => navigate('/products')}>Products</button>
              <button className="list-group-item list-group-item-action" onClick={() => navigate('/categories')}>Categories</button>
              <button className="list-group-item list-group-item-action" onClick={() => navigate('/suppliers')}>Suppliers</button>
              {user?.role === 'admin' && (
                <button className="list-group-item list-group-item-action" onClick={() => navigate('/users')}>Users</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard