import React from "react";
import HeaderComponent from "../HeaderComponents/HeaderComponent";

const DefaultComponent = ({ children }) => {  // ✅ Sử dụng destructuring để lấy `children`
    return (
        <div>
            <HeaderComponent />
            {children}  {/* ✅ Hiển thị nội dung con đúng cách */}
        </div>
    );
};

export default DefaultComponent;