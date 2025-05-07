# Tài liệu dự án

## A. Cài đặt dự án

1. Clone repository:

```
git clone https://github.com/Tuienn/shirt-shopping.git
```

2. Di chuyển vào thư mục dự án:

```
cd shirt-shopping
```

3. Cài đặt các dependencies:

```
npm install
```

## B. Cách chạy dự án

Sử dụng "npm start" để khởi động:

-   File index.html (http://localhost:3000/) - Giao diện chính là mở theo link này
-   JSON server (http://localhost:3000/bill)
-   JSON server (http://localhost:3000/products)

## C. Cấu trúc file

### 1. File bill.json

Lưu danh sách hóa đơn

### 2. File product-list.json

Lưu danh sách sản phẩm

### 3. Folder public

#### a. File index.html

Trang chính (HOME + BILL + SHOPPING CART)

#### b. Folder CSS

-   **File responsive.css**: Responsive với Mobile, tablet, PC

-   **Folder utilities**

    -   _File base.css_: CSS base cho trang web
    -   _File grid.css_: Grid layout thư viện (Học ở F8) hỗ trợ responsive cho trang HOME

-   **Folder main**
    -   _File index.css_: CSS tổng quát cho .overlay, #main và loading
    -   _File bill.css_: CSS cho trang BILL
    -   _File clientInfo.css_: CSS cho form Thông tin người mua
    -   _File navBar.css_: CSS cho Thanh navbar
    -   _File product.css_: CSS cho item sản phẩm trang HOME
    -   _File shoppingCart.css_: CSS cho trang SHOPPING CART

#### c. Folder JS

-   **File index.js**: File chính xử lý các event, import các chức năng của các file còn lại
-   **File file.js**: Thư viện thao tác với localStorage, API và xử lý dữ liệu
-   **File listData.js**: Khai báo các biến và constants
-   **File renderUI.js**: Xử lý thao tác render giao diện cho các trang HOME + BILL + SHOPPING CART
-   **File clientInfo.js**: Xử lý logic cho form Thông tin người mua (chỉ hỗ trợ xử lý event cho index.js)
-   **File shoppingCart.js**: Xử lý logic của trang SHOPPING CART (chỉ hỗ trợ xử lý event cho index.js)

## D. Chi tiết

### Phần 1: File listData.js

**Note:**

-   Chuyển thuộc tính soLuong -> quantity
-   Thêm thuộc tính url là link ảnh

### Phần 2: File file.js

Dùng function setLocalStorage

### Phần 3:

-   **File file.js**: Dùng function getLocalStorage
-   **File renderUI.js**: Viết function renderProducts_main render các sản phẩm ra trang HOME
-   **File index.js**: Import function renderProducts_main từ renderUI.js
    -   Lần đầu mặc định renderProducts_main được chạy để render ra homePage
    -   Sự kiện click vào HOME ở navbar cũng renderProducts_main

### Phần 4:

-   Giỏ hàng là "let cart"
-   **File shoppingCart.js**: Function findIdProductInCart tìm id sản phẩm trong giỏ hàng
-   **File file.js**: Dùng function setLocalStorage
-   **File index.js**: addSP đổi tên thành addProduct, function này xử lý logic khi thêm sản phẩm vào giỏ hàng

### Phần 5:

-   Function getTotalPriceEachProduct: Tính tổng tiền của mỗi sản phẩm (quantity \* price)
-   Function getTotalPriceAllProducts: Tính tổng tiền của tất cả sản phẩm
-   Function getTotalQuantityAllProducts: Tính tổng số lượng các sản phẩm trong giỏ hàng

### Phần 6:

-   **File renderUI.js**: Function renderShoppingCart_main để render giao diện cho trang SHOPPING CART
-   **File shoppingCart.js**: Function getByIDSP -> đổi tên thành getByIDProduct
-   **File index.js**:
    -   Function handleMinusQuantity, handlePlusQuantity, reRenderTotalEachProduct, reRenderTotalAllProducts xử lý event khi tăng - giảm số lượng sản phẩm trong giỏ hàng
    -   Function handleClearAProduct xử lý xóa 1 sản phẩm trong giỏ hàng

### Phần 7:

-   **File renderUI.js**: Function renderClientInfo_main xử lý render form thông tin người mua
-   **File index.js**: Function handleOpenClientInfo xử lý event cho nút "Buy" hiện form thông tin người mua và thêm các sự kiện khác cho form này thông qua function handleClientInfo_main

### Phần 8: File file.js

Function getLocation (fetch đồng thời 3 API)

### Phần 9:

-   **File clientInfo.js**:
    -   Function checkInputLocationIsChecked_inOrder xử lý cho thứ tự chọn tỉnh -> huyện -> xã
    -   Function getDistrictsByProvinceID và getWardsByDistrictID xử lý lấy dữ liệu
    -   Function loadData_inputDistrict, loadData_inputWard xử lý render ra thông tin quận/huyện, phường/xã

### Phần 10: File file.js

Function generateRandomID xử lý tạo ra id ngẫu nhiên

### Phần 11:

-   **File clientInfo.js**: Các function validate input: checkError_groupInputName, checkError_inputEmail, checkError_inputPhoneNumber, checkError_inputLocation
-   **File file.js**: Function createObjectClientInfo tạo ra object để lưu vào bill.json

### Phần 13: File bill.json

Lưu thông tin các hóa đơn được trả về từ form thông tin người mua

### Phần 14:

-   **File file.js**:
    -   Function getBill_GET để lấy dữ liệu các bill từ API
    -   Function createBill_POST để tạo 1 bill mới (sau khi form thông tin người mua không có lỗi và nhấn nút "Xác nhận")
    -   Function deleteBill_DELETE để xóa 1 bill (khi nhấn nút X để return bill)

### Phần 15:

-   **File index.js**:
    -   Kiểm tra số lượng mua tối đa của 1 sản phẩm (Đã xử lý cho sự kiện tăng - giảm sản phẩm trong giỏ hàng)
    -   Function handleClearAProduct xử lý xóa 1 sản phẩm trong giỏ hàng
    -   Function reRenderTotalEachProduct, reRenderTotalAllProducts cập nhật số tiền
    -   Function updateListData_afterBuy để cập nhật dữ liệu sản phẩm sau khi mua

### Phần 16:

-   **File renderUI.js**:
    -   Function renderBill_main để render bill (dữ liệu được fetch trong index.js với function getBill_GET)
    -   Tạo tag select cho nút "Details" để xem thông tin sản phẩm
    -   Function updateListData_afterReturn để cập nhật dữ liệu sản phẩm sau khi trả hàng

### Phần 17: File file.js với IFFE

### Phần 18: API Products

-   **File file.js**:
    -   Function getProducts để lấy danh sách sản phẩm từ API
    -   Function updateProduct để cập nhật thông tin sản phẩm trên API
