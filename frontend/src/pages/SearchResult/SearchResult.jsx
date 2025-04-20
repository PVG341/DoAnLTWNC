// src/pages/SearchResult/SearchResult.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCardComponent from '../../components/ProductCardComponent/ProductCardComponent';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axios.get(`http://localhost:3000/products/search?q=${query}`)
        .then(res => {
          setResults(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Lỗi khi tìm kiếm sản phẩm:', err);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div style={{ padding: '20px 100px' }}>
      <h2>Kết quả tìm kiếm cho: <em>"{query}"</em></h2>

      {loading ? (
        <p>Đang tải kết quả...</p>
      ) : results.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {results.map(product => (
            <ProductCardComponent key={product._id} data={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
