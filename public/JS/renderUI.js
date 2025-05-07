import {
    getByIDProduct,
    getTotalPriceEachProduct,
    getTotalPriceAllProducts,
} from "./shoppingCart.js";

const mainSection = document.getElementById("main");

//Render list products
const renderProducts_main = async (listProducts) => {
    const htmls = listProducts.map((product) => {
        // Create price display with appropriate styling
        let priceDisplay = "";
        if (product.sale_price && product.sale_price < product.list_price) {
            priceDisplay = `<p class="product--price">
                                <span class="list-price"><s>$${product.list_price}</s></span>
                                <span class="sale-price">$${product.sale_price}</span>
                            </p>`;
        } else {
            priceDisplay = `<p class="product--price">$${product.list_price}</p>`;
        }

        return `<div class="col l-3 m-4 c-6">
                        <div class="product">
                            <div class="product--img">
                                <img
                                    src=${product.url}
                                    alt=""
                                />
                                <div class="cart-plus">
                                    <i class="fa-solid fa-cart-plus"></i>
                                </div>
                            </div>
                            <div>
                                <h3 class="product--name">${product.name}</h3>
                                <div>
                                    ${priceDisplay}
                                    <p class="product--quantity">
                                        Quantity: ${product.quantity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>`;
    });
    const html = htmls.join("");
    mainSection.innerHTML = `<div class="row">${html}</div>`;
    return true;
};

//Render shopping cart
const renderShoppingCart_main = async (cartIsNull, listData, cart) => {
    if (cartIsNull === true) {
        mainSection.innerHTML = `<div class="empty-cart">
                                    <img src="./empty-cart.png" alt="" />
                                </div>
                                <div class="summary">
                                    <button class="btn-back">
                                        <i class="fa-solid fa-arrow-left"></i>
                                        Back To Shopping
                                    </button>
                                </div>`;
    }
    if (cartIsNull === false) {
        const totalPriceEachProduct_arr = getTotalPriceEachProduct(
            listData,
            cart
        );
        const htmls = cart.map((product, index) => {
            const productInListData = getByIDProduct(
                listData,
                product.idProduct
            );

            // Create price display with appropriate styling
            let priceDisplay = "";
            if (
                productInListData.sale_price &&
                productInListData.sale_price < productInListData.list_price
            ) {
                priceDisplay = `<s>$${productInListData.list_price}</s><br/>$${productInListData.sale_price}`;
            } else {
                priceDisplay = `$${productInListData.list_price}`;
            }

            return `<tr>
                        <td>
                            <div class="tbl__product-name">
                                <img
                                    src= ${productInListData.url}
                                    alt=""
                                />
                                <div>
                                    <h1>${productInListData.name}</h1>
                                    <p>Quantity: ${productInListData.quantity}</p>
                                </div>
                            </div>
                        </td>
                        <td class="tbl__quantity">
                            <i class="fa-solid fa-minus"></i>
                            <p>${product.quantity}</p>
                            <i class="fa-solid fa-plus"></i>
                        </td>
                        <td class="tbl__price">${priceDisplay}</td>
                        <td class="tbl__total">$${totalPriceEachProduct_arr[index]}</td>
                        <td class="tbl__clear-cart">
                            <i class="fa-regular fa-circle-xmark"></i>
                        </td>
                    </tr>`;
        });

        const table = `<table class="table-shopping">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Total</th>
                            <th>Clear Cart</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmls.join("")}
                    </tbody>
                </table>
                <div class="summary">
                    <button class="btn-back">
                        <i class="fa-solid fa-arrow-left"></i>
                        Back To Shopping
                    </button>
                    <div class="summary__total">
                        <h2>Total: $${getTotalPriceAllProducts(
                            listData,
                            cart
                        )}</h2>
                        <button class="btn-buy">Buy</button>
                    </div>
                </div>`;

        mainSection.innerHTML = table;
    }
};

const renderClientInfo_main = async (dataProvince) => {
    const htmls = dataProvince.map((data) => {
        return `<option value=${data.code}>${data.name}</option>`;
    });
    const html = htmls.join("");

    mainSection.innerHTML = `<form action="">
                                <div class="form__heading">
                                    <h1>Customer Information</h1>
                                    <i class="fa-solid fa-xmark"></i>
                                </div>
                                <div class="form__main-content">
                                    <div class="form-field form-field--name">
                                        <label for="input--surname" class="form-label"
                                            >Full Name<span>*</span></label
                                        >
                                        <div class="form-field__group-input">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                id="input--surname"
                                                class="form-input"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                class="form-input"
                                            />
                                        </div>
                                        <p class="form-error"></p>
                                    </div>
                                    <div class="form-field">
                                        <label for="input--email"
                                            >Email<span>*</span></label
                                        >
                                        <input
                                            type="email"
                                            class="form-input"
                                            id="input--email"
                                            placeholder="Email"
                                        />
                                        <p class="form-error"></p>
                                    </div>
                                    <div class="form-field">
                                        <label for="input--phone"
                                            >Phone Number<span>*</span></label
                                        >
                                        <input
                                            type="tel"
                                            class="form-input"
                                            id="input--phone"
                                            placeholder="Phone Number"
                                        />
                                        <p class="form-error"></p>
                                    </div>
                                    <div class="form-field form-field--address">
                                        <label for="input--province"
                                            >Address<span>*</span></label
                                        >
                                        <div class="form-field__group-input">
                                            <div>
                                                <select
                                                    name=""
                                                    id="input--province"
                                                    class="form-input"
                                                >
                                                    <option
                                                        value="default"
                                                        selected
                                                        disabled
                                                        hidden
                                                    >
                                                        Select Province/City
                                                    </option>
                                                    ${html}
                                                </select>
                                                <select name="" id="input--district" class="form-input">
                                                    <option
                                                        value="default"
                                                        selected
                                                        disabled
                                                        hidden
                                                    >
                                                        Select District
                                                    </option>
                                                </select>
                                                <select name="" id="input--ward" class="form-input">
                                                    <option
                                                        value="default"
                                                        selected
                                                        disabled
                                                        hidden
                                                    >
                                                        Select Ward
                                                    </option>
                                                </select>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="House Number"
                                                class="form-input"
                                            />
                                        </div>
                                        <p class="form-error"></p>
                                    </div>
                                    <div class="form-field">
                                        <label for="input--note">Message</label>
                                        <textarea
                                            name=""
                                            id="input--note"
                                            class="form-input"
                                        ></textarea>
                                    </div>
                                </div>
                                <div class="form__group-btn">
                                    <button type="button">Cancel</button>
                                    <button type="button">Confirm</button>
                                </div>
                            </form>`;
};
const renderBill_main = async (bills) => {
    if (bills.length !== 0) {
        const htmls = bills.map((bill) => {
            const billDetailHtmls = bill.billDetail.map((detail) => {
                return `<optgroup label="${detail.name}">
                            <option value="">Quantity: ${detail.quantity}</option>
                            <option value="">Sub total: $${detail.subTotal}</option>
                            <option value="">Total: $${detail.total}</option>
                        </optgroup>`;
            });
            const billDetailHtml = billDetailHtmls.join("");
            return `<tr>
                        <td>
                            ${bill.id}
                            <select name="Details" class="details">
                                <option
                                    value="default"
                                    selected
                                    disabled
                                    hidden
                                >
                                    Details
                                </option>
                                ${billDetailHtml}
                            </select>
                        </td>
                        <td>${bill.name}</td>
                        <td>${bill.time}</td>
                        <td>${bill.itemNumbers}</td>
                        <td>${bill.totalQuantity}</td>
                        <td>$${bill.totalPrice}</td>
                        <td>
                            <i class="fa-regular fa-rectangle-xmark"></i>
                        </td>
                    </tr>`;
        });
        const html = htmls.join("");

        mainSection.innerHTML = `<table class="table-bill">
                                    <thead>
                                        <th>Code</th>
                                        <th>Customer Name</th>
                                        <th>Date</th>
                                        <th>Item Numbers</th>
                                        <th>Total Quantity</th>
                                        <th>Total Price</th>
                                        <th>Return</th>
                                    </thead>
                                    <tbody>
                                        ${html}
                                    </tbody>
                                </table>
                                <div class="summary" style="margin-top: 30px">
                                    <button class="btn-back">
                                        <i class="fa-solid fa-arrow-left"></i>
                                        Back To Shopping
                                    </button>
                                </div>`;
    } else {
        mainSection.innerHTML = `<div class="no-bill">
            <img src="./no-bill.png" alt="" />
        </div>
        <div class="summary">
            <button class="btn-back" style="margin-top: 30px">
                <i class="fa-solid fa-arrow-left"></i>
                Back To Shopping
            </button>
        </div>`;
    }
};

export {
    renderProducts_main,
    renderShoppingCart_main,
    renderClientInfo_main,
    renderBill_main,
};
