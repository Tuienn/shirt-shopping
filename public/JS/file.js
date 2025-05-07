import { keyLocalStorageItemCart } from "./index.js";

const library = (() => {
    "use strict";
    //Handle with local storage
    const setLocalStorage = (key, value) => {
        if (value || Array.isArray(value)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    const getLocalStorage = (key) => {
        const data = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(data)) {
            return data.map((item) => ({
                ...item,
                price: Number(item.price),
                quantity: Number(item.quantity),
            }));
        }
        return data;
    };
    //Update list data after buy
    const findCartItem = (cart, id) => {
        // Convert both IDs to numbers for comparison
        return cart.find((item) => Number(item.idProduct) === Number(id));
    };

    const updateListData_afterBuy = async (listProduct) => {
        const cart = getLocalStorage(keyLocalStorageItemCart);

        if (cart && cart.length !== 0) {
            const newListData = listProduct.map((item) => {
                if (findCartItem(cart, item.id)) {
                    return {
                        ...item,
                        quantity:
                            item.quantity -
                            findCartItem(cart, item.id).quantity,
                    };
                } else {
                    return item;
                }
            });

            // Update products in the API
            for (const item of newListData) {
                await updateProduct(item);
            }

            return newListData;
        } else {
            const products = await getProducts();
            return products;
        }
    };

    const updateListData_afterReturn = async (listProduct, bill) => {
        const newListData = listProduct.map((item) => {
            const billItem = bill.billDetail.find(
                (billItem) => Number(billItem.idProduct) === Number(item.id)
            );
            if (billItem) {
                return {
                    ...item,
                    quantity: item.quantity + billItem.quantity,
                };
            }
            return item;
        });

        // Update products in the API
        for (const item of newListData) {
            await updateProduct(item);
        }

        return newListData;
    };

    // Handle with API
    //Link API thành phố / tỉnh
    const APIProvince = "https://provinces.open-api.vn/api/";
    //Link API cho quận / huyện
    const APIDistrict = "https://provinces.open-api.vn/api/d/";
    //Link API cho phường / xã
    const APIWard = "https://provinces.open-api.vn/api/w/";
    //Link fakeAPI cho bill
    const APIBill = "http://localhost:3000/bill";
    //Link API for products
    const APIProducts = "http://localhost:3000/products";

    // Handle product API
    const getProducts = async () => {
        try {
            const response = await fetch(APIProducts);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error(error);
        }
    };

    const updateProduct = async (product) => {
        try {
            // For json-server 1.0.0-beta.2, ensure IDs are properly formatted
            const productToUpdate = {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                list_price: Number(product.list_price),
                sale_price: product.sale_price
                    ? Number(product.sale_price)
                    : null,
                quantity: Number(product.quantity),
                url: product.url,
            };

            const response = await fetch(
                `${APIProducts}/${productToUpdate.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productToUpdate),
                }
            );

            if (!response.ok) {
                // If PUT fails, try a different approach with PATCH
                console.log(
                    `PUT failed for product ${productToUpdate.id}, trying PATCH instead`
                );
                const patchResponse = await fetch(
                    `${APIProducts}/${productToUpdate.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(productToUpdate),
                    }
                );

                if (!patchResponse.ok) {
                    throw new Error(
                        `Failed to update product ${productToUpdate.id}`
                    );
                }

                return await patchResponse.json();
            }

            return await response.json();
        } catch (error) {
            console.error(
                `Error updating product with ID ${product.id}:`,
                error
            );
            throw new Error(error);
        }
    };

    // Handle with location
    const getLocation = async () => {
        try {
            const mainContent = document.getElementById("main");
            mainContent.innerHTML = `<div class="loading"></div>`;

            const response = await Promise.all([
                fetch(APIProvince),
                fetch(APIDistrict),
                fetch(APIWard),
            ]);
            const data = await Promise.all(response.map((res) => res.json()));
            return data;
        } catch (error) {
            throw new Error(error);
        }
    };

    //Filter district by province
    const getDistrictsByProvinceID = (codeProvince, dataDistrict) => {
        const dataDistrictLength = dataDistrict.length;
        const dataDistrictFilter = [];

        for (let i = 0; i < dataDistrictLength; i++) {
            if (dataDistrict[i].province_code == codeProvince) {
                dataDistrictFilter.push(dataDistrict[i]);
                if (
                    i === dataDistrictLength - 1 ||
                    dataDistrict[i + 1].province_code != codeProvince
                ) {
                    return dataDistrictFilter;
                    // optimize code
                }
            }
        }
        return null;
    };
    //Filter ward by district
    const getWardsByDistrictID = (codeDistrict, dataWard) => {
        const dataWardLength = dataWard.length;
        const dataWardFilter = [];

        for (let i = 0; i < dataWardLength; i++) {
            if (dataWard[i].district_code == codeDistrict) {
                dataWardFilter.push(dataWard[i]);
                if (
                    i === dataWardLength - 1 ||
                    dataWard[i + 1].district_code != codeDistrict
                ) {
                    return dataWardFilter;
                    // optimize code
                }
            }
        }
        return null;
    };

    // Handle with bill
    const getCurrentDate = () => {
        const today = new Date(); // Lấy ngày hiện tại
        const day = String(today.getDate()).padStart(2, "0"); // Lấy ngày và thêm số 0 phía trước nếu < 10
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Lấy tháng (cộng 1 vì tháng bắt đầu từ 0)
        const year = today.getFullYear(); // Lấy năm

        return `${day}/${month}/${year}`; // Trả về chuỗi định dạng ngày/tháng/năm
    };
    const generateRandomID = (length) => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        // Hàm đệ quy tạo ID dưới dạng arrow function
        const createID = (id) => {
            return id.length >= length
                ? id
                : createID(
                      id +
                          characters[
                              Math.floor(Math.random() * characters.length)
                          ]
                  );
        };

        return createID("");
    };
    const createObjectClientInfo = (
        name,
        itemNumbers,
        totalQuantity,
        totalPrice,
        billDetail
    ) => {
        return {
            id: generateRandomID(5),
            name,
            time: getCurrentDate(),
            itemNumbers,
            totalQuantity,
            totalPrice,
            billDetail,
        };
    };

    const postAPI = (data, API) => {
        var options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        fetch(API, options)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const createBill_POST = (
        name,
        itemNumbers,
        totalQuantity,
        totalPrice,
        billDetail
    ) => {
        const bill = createObjectClientInfo(
            name,
            itemNumbers,
            totalQuantity,
            totalPrice,
            billDetail
        );
        postAPI(bill, APIBill);
    };
    const getBill_GET = async () => {
        try {
            const response = await fetch(APIBill);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching bill data:", error);
            throw new Error(error);
        }
    };
    const deleteBill_DELETE = (id) => {
        fetch(`${APIBill}/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .catch((error) => console.log(error));
    };

    const getTotal = (arr, attr) => {
        // Kiểm tra nếu param thứ nhất là array và không có param thứ hai
        if (!attr) {
            return arr.reduce((total, element) => total + element, 0);
        } else {
            // Trường hợp có param thứ hai là tên thuộc tính
            return arr.reduce((total, element) => total + element[attr], 0);
        }
    };
    return {
        setLocalStorage,
        getLocalStorage,
        updateListData_afterBuy,
        updateListData_afterReturn,
        getLocation,
        getDistrictsByProvinceID,
        getWardsByDistrictID,
        createBill_POST,
        getBill_GET,
        deleteBill_DELETE,
        getTotal,
        getProducts,
        updateProduct,
    };
})();

export default library;
