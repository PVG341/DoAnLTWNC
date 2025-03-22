import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Fragment } from 'react'
import { routes } from './routes'
import DefaultComponent from "./components/DefaultComponents/DefaultComponents";


function App() {

  return(
    <div>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const Layout = route.isShowHeader ? DefaultComponent : ({ children }) => <>{children}</>;
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
    </div>
  );
}

export default App;
