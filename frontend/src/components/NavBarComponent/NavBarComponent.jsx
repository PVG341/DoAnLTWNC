import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WrapperTypeProduct } from './style'
import axios from 'axios'

const NavBarComponent = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Lỗi khi lấy categories: ", err))
  }, [])

  return (
    <div style={{ padding: '0 120px' }}>
      <WrapperTypeProduct>
        <Link to={`/`}>
          Trang chủ
        </Link>
        {categories.map(category => (
          <Link
            key={category._id}
            to={`/products?category=${category._id}`}
            style={{ marginLeft: '16px' }}
          >
            {category.cat_name}
          </Link>
        ))}
      </WrapperTypeProduct>
    </div>
  )
}

export default NavBarComponent
