
# DoAnLTWNC

│── /backend                # Thư mục chứa backend (Node.js + Express)
│   │── /config             # Cấu hình môi trường (database, secret keys, ...)
│   │── /controllers        # Xử lý logic cho API (controller)
│   │── /models             # Định nghĩa Schema cho MongoDB (Mongoose models)
│   │── /routes             # Định nghĩa API endpoint (Express routes)
│   │── /middleware         # Middleware (xác thực, logs, ...)
│   │── /utils              # Các hàm tiện ích dùng chung
│   │── /tests              # Kiểm thử API
│   │── server.js           # File chính khởi chạy server
│   │── package.json        # Thông tin project & dependencies
│
│── /frontend               # Thư mục chứa frontend (React)
│   │── /public             # Chứa file tĩnh (index.html, favicon, ...)
│   │── /src
│   │   │── /components     # Các component UI tái sử dụng
│   │   │── /pages          # Các trang chính (Home, About, Dashboard, ...)
│   │   │── /utils          # Hàm tiện ích frontend
│   │   │── /services       # API services (axios, fetch ...)
│   │   │── App.js          # Component gốc của ứng dụng React
│   │   │── index.js        # Điểm khởi chạy ứng dụng React
│   │── package.json        # Thông tin project & dependencies frontend

