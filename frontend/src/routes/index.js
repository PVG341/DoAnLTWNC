//--------Import các trang từ folder pages vào đây--------
//--------Để dễ quản lý các trang được import trong App.js--------

import Homepage from "../pages/Homepage/Homepage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProductList from "../pages/ProductList/ProductList"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import AdminPage from "../pages/AdminPage/AdminPage"

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
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: '/sign-up',
        page: SignUpPage
    },
    {
        path: '/sign-in',
        page: SignInPage
    },
    {
        path: '/admin-dashboard',
        page: AdminPage
    }
]