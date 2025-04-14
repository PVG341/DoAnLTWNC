import React, { useEffect, useState } from "react";
import axios from "axios";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperTypeProduct } from './style'
import s2 from '../../assets/images/s2.jpg'
import s3 from '../../assets/images/s3.jpg'
import ProductCardComponent from "../../components/ProductCardComponent/ProductCardComponent";

const Homepage = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/products")
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    }, []);
    return (
        <>
            <div id="container" style= {{ backgroundColor: '#efefef', padding: '0 120px'}}>
                <SliderComponent arrImages={[s2, s3]}/>
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {products.map(product => (
                        <ProductCardComponent key={product._id} data={product} />
                    ))}
                </div>
            </div>
        </>
        
    )
}

export default Homepage;
