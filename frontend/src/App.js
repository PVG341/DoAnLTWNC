import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth để lấy thông tin người dùng
import DefaultComponent from "./components/DefaultComponents/DefaultComponents";
import { routes } from './routes'; // routes định nghĩa trong file routes.js
import AdminPage from './pages/AdminPage/AdminPage';


function App() {
  const { user, loading } = useAuth();  // Lấy thông tin user từ context

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Router>
        <Routes>
        {routes.map((route) => {
          const Page = route.page;
          const Layout = route.isShowHeader ? DefaultComponent : ({ children }) => <>{children}</>;

          // Nếu là admin page thì kiểm tra role
          if (route.path === '/admin-dashboard') {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  loading ? (
                    <div>Loading...</div>
                  ) : user?.role === 1 ? (
                    <Layout><Page /></Layout>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            );
          }

            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Layout><Page /></Layout>}
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
