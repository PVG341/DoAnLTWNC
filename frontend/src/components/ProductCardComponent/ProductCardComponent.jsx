import { Card } from 'antd'
import { Link } from 'react-router-dom'
import React from 'react'
import { StyleNameProduct, WrapperDiscountText, WrapperPriceText, WrapperReportText } from './style'

const ProductCardComponent = ({ data }) => {
  return (
    <Card
      hoverable
      style={{ width: 240}}
      bodyStyle={{ padding: '10px' }}
      cover={<img alt={data.name} src={`http://localhost:3000${data.image}`} style={{height: '200px'}}/>}
    >
      <Link to={`/product-detail/${data._id}`}>
        <StyleNameProduct>{data.name}</StyleNameProduct>
      </Link>
      <WrapperPriceText>Giá: {data.price} VNĐ</WrapperPriceText>
    </Card>
  );
};

export default ProductCardComponent;
