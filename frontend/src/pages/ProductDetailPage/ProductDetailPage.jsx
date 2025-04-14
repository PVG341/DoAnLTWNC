
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
  }, [id])

  if (!product) return <p>Đang tải...</p>
  return (
    <div style={{ padding: '0 120px', background: '#efefef', height: '1000px'}}>
        <div style={{ display: 'flex', background: '#fff'}}>
            <ProductDetailComponent product={product}/>
        </div>  
        
    </div>
  )
}

export default ProductDetailPage
