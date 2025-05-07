import library from "./file.js";

import {
    renderProducts_main,
    renderShoppingCart_main,
    renderClientInfo_main,
    renderBill_main,
} from "./renderUI.js";
import {
    getTotalPriceAllProducts,
    getByIDProduct,
    getTotalQuantityAllProducts,
    getItemNumbers,
    getTotalPriceEachProduct,
    createBillDetail,
    findIdProductInCart,
} from "./shoppingCart.js";

import {
    checkError_groupInputName,
    checkError_inputEmail,
    checkError_inputPhoneNumber,
    checkError_inputLocation,
    handleOnFocusInput_clearInputError,
    eventSelectLocation,
} from "./clientInfo.js";

export const keyLocalStorageItemCart = "DANHSACHITEMCART";

// First call API - only fetch products once and reuse the data
let listProductFromAPI = [];

// Initialize data
async function initializeData() {
    // Fetch location data
    const [dataProvince, dataDistrict, dataWard] = await library.getLocation();

    // Fetch products data (only once)
    listProductFromAPI = await library.getProducts();

    // Default render home page
    await renderProducts_main(listProductFromAPI);
    handleHomePage_main();

    // Setup event handlers that depend on location data
    setupLocationHandlers(dataProvince, dataDistrict, dataWard);

    // Set up other event handlers after data is loaded
    setupEventHandlers();

    return { dataProvince, dataDistrict, dataWard };
}

// Setup overlay functionality
const overlay = document.querySelector(".overlay");
const navBarContent = document.getElementById("navbar");
const navBars = document.querySelector(".navbar__bars");
const navbarGroupBtn = document.querySelector(".navbar__group-btn");

const openOverlay = () => {
    overlay.classList.add("active");
    navBarContent.classList.add("overlay-active");
};
const openOverlay_disabledNavbar = () => {
    overlay.classList.add("active");
    navBarContent.classList.add("overlay-active");
    navBarContent.classList.add("disabled");
};
const closeOverlay = () => {
    overlay.classList.remove("active");
    navBarContent.classList.remove("overlay-active");
    navBarContent.classList.remove("disabled");
};

//On mobile click navbar_bars
navBars.addEventListener("click", () => {
    openOverlay();
    navbarGroupBtn.classList.add("active-mobile");
    document.body.style.overflow = "hidden"; //Prevent scroll when overlay is active
});
const removeActiveOverlay = () => {
    closeOverlay();
    navbarGroupBtn.classList.remove("active-mobile");
    document.body.style.overflow = "visible"; //Allow scroll when overlay is not active
};
//On mobile close overlay = click overlay
overlay.addEventListener("click", removeActiveOverlay);
// On mobile close overlay = click navbarGroupBtn
navbarGroupBtn.addEventListener("click", removeActiveOverlay);

//Home page
const btnHomePage = document.querySelector(".nav-btn--home");
// All event of add product to cart
const handleHomePage_main = () => {
    const addProduct = (i) => {
        // idProduct = i + 1 (i = index of btn of group_plusCart)
        const index = findIdProductInCart(i + 1, cart);

        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({ idProduct: i + 1, quantity: 1 });
        }
        library.setLocalStorage(keyLocalStorageItemCart, cart);
    };

    const group_plusCart = document.querySelectorAll(".cart-plus");
    group_plusCart.forEach((btnPlusCart, i) => {
        // Index of product in listProductFromAPI = index of button in group_plusCart + 1
        btnPlusCart.addEventListener("click", () => addProduct(i));
    });
};

//Shopping cart
let cart = library.getLocalStorage(keyLocalStorageItemCart) || [];
const reRenderTotalEachProduct = (index) => {
    const totalEachProduct = getTotalPriceEachProduct(listProductFromAPI, cart)[
        index
    ];
    document.querySelectorAll("td.tbl__total")[
        index
    ].innerText = `$${totalEachProduct}`;
};
const reRenderTotalAllProducts = () => {
    const totalAllProducts = getTotalPriceAllProducts(listProductFromAPI, cart);
    document.querySelector(
        ".summary__total h2"
    ).innerText = `Total: $${totalAllProducts}`;
};
const handleMinusQuantity = () => {
    const groupQuantity = document.querySelectorAll("td.tbl__quantity");

    groupQuantity.forEach((quantityElement, i) => {
        quantityElement
            .querySelector("i:first-child")
            .addEventListener("click", () => {
                if (cart[i].quantity > 0) {
                    cart[i].quantity -= 1;
                    quantityElement.querySelector("p").innerText =
                        cart[i].quantity;

                    library.setLocalStorage(keyLocalStorageItemCart, cart);
                    reRenderTotalEachProduct(i);
                    reRenderTotalAllProducts();
                }
            });
    });
};

const handlePlusQuantity = () => {
    const groupQuantity = document.querySelectorAll("td.tbl__quantity");

    groupQuantity.forEach((quantityElement, i) => {
        const productInListData = getByIDProduct(
            listProductFromAPI,
            cart[i].idProduct
        );
        quantityElement
            .querySelector("i:last-child")
            .addEventListener("click", () => {
                if (cart[i].quantity < productInListData.quantity) {
                    cart[i].quantity += 1;
                    quantityElement.querySelector("p").innerText =
                        cart[i].quantity;

                    library.setLocalStorage(keyLocalStorageItemCart, cart);
                    reRenderTotalEachProduct(i);
                    reRenderTotalAllProducts();
                }
            });
    });
};

const handleBackToShopping = () => {
    document.querySelector(".btn-back").addEventListener("click", async () => {
        await renderProducts_main(listProductFromAPI);
        handleHomePage_main();
    });
};
const clearCart = () => {
    cart = [];
    library.setLocalStorage(keyLocalStorageItemCart, cart);
};

//Client info
const closeClientInfo = async () => {
    closeOverlay();
    await renderShoppingCart_main(checkCartIsNull(), listProductFromAPI, cart);
    handleShoppingCart_main();
};

const handleCloseClientInfo = () => {
    const btnClose = document.querySelector(".form__heading i");
    const btnClose2 = document.querySelector(".form__group-btn button");
    btnClose.addEventListener("click", closeClientInfo);
    overlay.addEventListener("click", closeClientInfo);
    btnClose2.addEventListener("click", closeClientInfo);
};

const handleSubmitClientInfo = () => {
    const btnSubmit = document.querySelector(
        "form .form__group-btn button:last-child"
    );

    const groupErrorMessage = document.querySelectorAll(".form-error");
    const groupInput = document.querySelectorAll(".form-input");

    handleOnFocusInput_clearInputError(groupInput);

    btnSubmit.addEventListener("click", async () => {
        const nameIsCorrect = checkError_groupInputName(
            groupErrorMessage,
            groupInput
        );
        const emailIsCorrect = checkError_inputEmail(
            groupErrorMessage,
            groupInput
        );
        const phoneNumberIsCorrect = checkError_inputPhoneNumber(
            groupErrorMessage,
            groupInput
        );
        const locationIsCorrect = checkError_inputLocation(
            groupErrorMessage,
            groupInput
        );

        if (
            nameIsCorrect &&
            emailIsCorrect &&
            phoneNumberIsCorrect &&
            locationIsCorrect
        ) {
            library.createBill_POST(
                `${groupInput[0].value} ${groupInput[1].value}`,
                getItemNumbers(cart),
                getTotalQuantityAllProducts(cart),
                getTotalPriceAllProducts(listProductFromAPI, cart),
                createBillDetail(listProductFromAPI, cart)
            );

            // Update product quantities in the API and refresh our local data
            listProductFromAPI = await library.updateListData_afterBuy(
                listProductFromAPI
            );

            alert("Buy successfully!");
            clearCart();

            removeActiveOverlay();
            await renderProducts_main(listProductFromAPI);
            handleHomePage_main();
        }
    });
};

function setupLocationHandlers(dataProvince, dataDistrict, dataWard) {
    const handleClientInfo_main = () => {
        handleCloseClientInfo();
        handleSubmitClientInfo();
        eventSelectLocation(dataDistrict, dataWard);
    };

    const handleOpenClientInfo = () => {
        const btnBuy = document.querySelector("button.btn-buy");

        btnBuy.addEventListener("click", async () => {
            openOverlay_disabledNavbar();
            await renderClientInfo_main(dataProvince);
            handleClientInfo_main();
        });
    };

    window.handleClientInfo_main = handleClientInfo_main;
    window.handleOpenClientInfo = handleOpenClientInfo;
}

const handleShoppingCart_main = () => {
    if (cart.length !== 0) {
        handleMinusQuantity();
        handlePlusQuantity();
        handleClearAProduct();
        handleOpenClientInfo();
    }
    handleBackToShopping();
};
const handleClearAProduct = () => {
    const groupClearCart = document.querySelectorAll("td.tbl__clear-cart i");
    groupClearCart.forEach((clearCartBtn, i) => {
        clearCartBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete this product?")) {
                cart.splice(i, 1);
                library.setLocalStorage(keyLocalStorageItemCart, cart);
                await renderShoppingCart_main(
                    checkCartIsNull(),
                    listProductFromAPI,
                    cart
                );
                handleShoppingCart_main();
            }
        });
    });
};

//Check cart is null?
const checkCartIsNull = () => {
    return cart.length === 0 ? true : false;
};

const cartPage = document.querySelector(".nav-btn--cart");

//Render bill to main
const handleRemoveBill = (bills) => {
    const groupRemoveBill = document.querySelectorAll("table.table-bill i");

    groupRemoveBill.forEach((btnBill, i) => {
        btnBill.addEventListener("click", async () => {
            if (confirm("Are you sure you want to return this bill?")) {
                // Update product quantities in the API and refresh our local data
                listProductFromAPI = await library.updateListData_afterReturn(
                    listProductFromAPI,
                    bills[i]
                );
                library.deleteBill_DELETE(bills[i].id);
                bills.splice(i, 1);
                await renderBill_main(bills);
                handleBill_main();
            }
        });
    });
};
const preventSelectDetails = () => {
    const groupSelectElement = document.querySelectorAll(".details");

    groupSelectElement.forEach((element) => {
        const defaultValue = element.value;
        element.addEventListener("change", (e) => {
            e.target.value = defaultValue;
        });
    });
};
const btnBill = document.querySelector(".nav-btn--bill");
const handleBill_main = async () => {
    const bills = await library.getBill_GET();
    await renderBill_main(bills);
    if (bills.length !== 0) {
        handleRemoveBill(bills);
        preventSelectDetails();
    }
    handleBackToShopping();
};

// Set up all event handlers that need product data
function setupEventHandlers() {
    btnHomePage.addEventListener("click", async () => {
        await renderProducts_main(listProductFromAPI);
        handleHomePage_main();
    });

    cartPage.addEventListener("click", async () => {
        await renderShoppingCart_main(
            checkCartIsNull(),
            listProductFromAPI,
            cart
        );
        handleShoppingCart_main();
    });

    btnBill.addEventListener("click", handleBill_main);
}

// Initialize the app
initializeData();
