//--------Import các trang từ folder pages vào đây--------
//--------Để dễ quản lý các trang được import trong App.js--------

import Homepage from "../pages/Homepage/Homepage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import ProductList from "../pages/ProductList/ProductList"

export const routes = [
    {
        path: '/',
        page: Homepage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductList,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]