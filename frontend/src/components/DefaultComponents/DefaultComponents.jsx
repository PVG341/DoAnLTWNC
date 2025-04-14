import React from "react";
import HeaderComponent from "../HeaderComponents/HeaderComponent";
import NavBarComponent from "../NavBarComponent/NavBarComponent";

const DefaultComponent = ({ children }) => {  // ✅ Sử dụng destructuring để lấy `children`
    return (
        <div>
            <HeaderComponent />
            <NavBarComponent/>
            {children}  {/* ✅ Hiển thị nội dung con đúng cách */}
        </div>
    );
};

export default DefaultComponent;