import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCardComponent from "../../components/ProductCardComponent/ProductCardComponent";

const ProductList = () => {
    const [searchParams] = useSearchParams()
    const categoryId = searchParams.get('category')
    const [products, setProducts] = useState([])

    useEffect(() => {
        if (categoryId) {
        axios.get(`http://localhost:3000/products/category?category=${categoryId}`)
            .then(res => setProducts(res.data))
            .catch(err => console.error('Lỗi khi lấy sản phẩm: ', err))
        }
    }, [categoryId])

    return (
        <>
            <div id="container" style= {{ backgroundColor: '#efefef', padding: '0 120px'}}>
                <h2>Sản phẩm</h2>
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {products.map(product => (
                        <ProductCardComponent key={product._id} data={product} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProductList
