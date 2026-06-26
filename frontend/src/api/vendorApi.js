import axiosInstance from './axiosInstance'

export const getSuppliersApi = () => axiosInstance.get('/suppliers')
export const createSupplierApi = (data) => axiosInstance.post('/suppliers', data)
export const updateSupplierApi = (id, data) => axiosInstance.put(`/suppliers/${id}`, data)
export const deleteSupplierApi = (id) => axiosInstance.delete(`/suppliers/${id}`)