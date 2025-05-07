const findIndexProductInListData = (listData, idProduct) => {
    // Convert both IDs to numbers for comparison
    return listData.findIndex((item) => Number(item.id) === Number(idProduct));
};
const findIdProductInCart = (id, cart) => {
    // Convert both IDs to numbers for comparison
    return cart.findIndex(
        (product) => Number(product.idProduct) === Number(id)
    );
};
const getByIDProduct = (listData, idProduct) => {
    const index = findIndexProductInListData(listData, idProduct);
    // Add error handling to prevent accessing undefined product
    if (index === -1) {
        console.error(`Product with ID ${idProduct} not found`);
        return null;
    }
    return listData[index];
};

// Get the effective price of a product (sale price if available, otherwise list price)
const getEffectivePrice = (product) => {
    if (product && product.sale_price) {
        return product.sale_price;
    }
    return product ? product.list_price : 0;
};

//Calculate total of a product => list of total of each product
const getTotalPriceEachProduct = (listData, cart) => {
    return cart.map((item) => {
        const product = getByIDProduct(listData, item.idProduct);
        // Add error handling to prevent "cannot read property 'price' of null"
        if (!product) {
            console.error(
                `Unable to calculate price for product ID ${item.idProduct}`
            );
            return 0;
        }
        return getEffectivePrice(product) * item.quantity;
    });
};

//Calculate total price of all products
const getTotalPriceAllProducts = (listData, cart) =>
    getTotalPriceEachProduct(listData, cart).reduce((a, b) => a + b, 0);

//Calculate total quantity of all products
const getTotalQuantityAllProducts = (cart) => {
    return cart.reduce((a, b) => a + b.quantity, 0);
};

//Get info to save in bill(post API)
const getItemNumbers = (cart) => {
    return cart.length;
};
// Create bill detail for each shopping cart
const createBillDetail = (listData, cart) => {
    return cart.map((item) => {
        const product = getByIDProduct(listData, item.idProduct);
        // Add error handling to prevent "cannot read property of null"
        if (!product) {
            console.error(
                `Unable to create bill detail for product ID ${item.idProduct}`
            );
            return {
                idProduct: item.idProduct,
                name: "Product Not Found",
                quantity: item.quantity,
                subTotal: 0,
                total: 0,
            };
        }
        const effectivePrice = getEffectivePrice(product);
        return {
            idProduct: product.id,
            name: product.name,
            quantity: item.quantity,
            subTotal: effectivePrice,
            total: effectivePrice * item.quantity,
        };
    });
};

export {
    getTotalPriceEachProduct,
    getTotalPriceAllProducts,
    getTotalQuantityAllProducts,
    getByIDProduct,
    getItemNumbers,
    createBillDetail,
    findIdProductInCart,
    getEffectivePrice,
};
