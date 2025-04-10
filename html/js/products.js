let dialog = document.getElementById("purchaseDialogue");
let openBtn = document.getElementById("openDialogue");
let closeBtn = document.getElementById("closeDialogue");
let listItemsHTML = document.querySelector(".categoryCont");
let listCartsHTML = document.querySelector("#productContainer");
let iconCounter = document.querySelector(".cartCounter");

let carts = [];
let listItems = [];

openBtn.addEventListener("click", () => {
    dialog.showModal(); 
});

closeBtn.addEventListener("click", () => {
    dialog.close(); 
});

const addDataToHTML = () => {
    // Clear previous content
    listItemsHTML.innerHTML = '';

    // Create a new parent wrapper div for the categories (inside .categoryCont)
    let newParentContainer = document.createElement("div");
    newParentContainer.classList.add("categoriesWrapper");

    if (listItems.length > 0) {
        // Group items by category
        let groupedItems = {};

        listItems.forEach(item => {
            if (!groupedItems[item.category]) {
                groupedItems[item.category] = [];
            }
            groupedItems[item.category].push(item);
        });

        // Loop through each category and create a separate section
        Object.keys(groupedItems).forEach(category => {
            // Create a section for each category
            let section = document.createElement("div");
            section.classList.add("categorySection");

            // Create the category header with a dynamic id
            let header = document.createElement("h2");
            header.classList.add("categoryHeader");
            header.innerText = category;

            // Assign a dynamic ID to the header (you can sanitize the category name for safe IDs)
            header.id = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;

            section.appendChild(header);

            // Create a new .gridContainer for this category
            let categoryGrid = document.createElement("div");
            categoryGrid.classList.add("gridContainer");

            // Append each item to this grid
            groupedItems[category].forEach(item => {
                let newItem = document.createElement("div");
                newItem.classList.add("itemCard");
                newItem.innerHTML = `
                    <div class="imageContainer">
                        <img class="itemImage" src="${item.image}" alt="${item.name}">

                    </div>
                    <div class="itemName">${item.name}</div>
                    <div class="itemInfo">
                        <span class="price">$${item.price}</span><br>
                        <span class="description">${item.desc}</span>
                    </div>
                    <button class="buttonBackground" data-id="${item.id}">
                        <div class="cartContainer">
                            <img src="./css/images/shoppingCart.png" class="cartIcon" alt="Shopping Cart">
                        </div>
                        <div class="cartButton">
                            Add
                        </div>
                    </button>
                `;
                categoryGrid.appendChild(newItem);
            });

            // Append categoryGrid to the section
            section.appendChild(categoryGrid);

            // Append the section to the new wrapper
            newParentContainer.appendChild(section);
        });

        // Append the newParentContainer inside .categoryCont (instead of document.body)
        listItemsHTML.appendChild(newParentContainer);
    }
};

listItemsHTML.addEventListener('click', (event) => {
    const button = event.target.closest(".buttonBackground");
    if (button) {
        const productId = button.dataset.id;
        // Use loose equality or cast both to same type
        const product = listItems.find(item => item.id == productId); 

        addToCart(productId);
    }
});

function addToCart(id) {
    let positionThisProductInCart = carts.findIndex((item) => item.productId == id);    
    if(carts.length <= 0) {
        carts = [{
            productId: id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0) {
        carts.push({
            productId: id,
            quantity: 1
        })
    }else{
        carts[positionThisProductInCart].quantity += 1;
    }
    addToCartHTML();
    addCartToMemory();
    showToast();
    sumTotalPrice();
}

function showToast(message = "Item added successfully!") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hidden");
    }, 1000); // 1 second
}


const addCartToMemory = () => {
    localStorage.setItem("cart", JSON.stringify(carts));
}

const addToCartHTML = () => {
    listCartsHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0) {
        carts.forEach((item) => {
            totalQuantity += item.quantity;
            let newCartItem = document.createElement("div");
            newCartItem.classList.add("cartItem");
            newCartItem.dataset.id = item.productId;
            let positionProduct = listItems.findIndex((product) => product.id == item.productId);
            let info = listItems[positionProduct];
            newCartItem.innerHTML = `
            <div class="rowContainer">
                    <img src="${info.image}" alt="ItemPicture" class="itemPic">
                    
                    <div class="infoContainer">
                        ${info.name}    </br>
                        <span class="price"> $${info.price * item.quantity}</span></br>
                    </div>
                    <div class="buttonCont">
                        <button class="minus">
                            -
                        </button>
                            ${item.quantity}
                        <button class="plus">
                            +
                        </button>
                    </div>
            </div>
            `;
            listCartsHTML.appendChild(newCartItem);
        });
    }
    if (carts.length === 0) {
        listCartsHTML.innerHTML = `<p class="emptyCartMessage">Your cart is empty.</p>`;
    }
    
    iconCounter.innerHTML = totalQuantity;
}


listCartsHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains("minus") || event.target.classList.contains("plus")) {
        const cartItem = event.target.closest(".cartItem");
        const productId = cartItem.dataset.id;
        const type = event.target.classList.contains("plus") ? 'plus' : 'minus';
        changeQuantity(productId, type);
    }
});


const changeQuantity = (id, type) => {
    let positionThisProductInCart = carts.findIndex((item) => item.productId == id);    
    if(positionThisProductInCart >= 0) {
        switch(type) {
            case 'plus':
                carts[positionThisProductInCart].quantity += 1;
                break;
            case 'minus':
                let valueChange = carts[positionThisProductInCart].quantity - 1;
                if(valueChange > 0) {
                    carts[positionThisProductInCart].quantity = valueChange;
                }else{
                    carts.splice(positionThisProductInCart, 1);
                }
                break;
        }
    }

    addCartToMemory();
    addToCartHTML();
    sumTotalPrice();
}

const sumTotalPrice = () => {
    let total = 0;

    carts.forEach(item => {
        const product = listItems.find(p => p.id == item.productId);
        if (product) {
            total += parseFloat(product.price) * item.quantity;
        }
    });

    // Optional: Format total price and display it in the DOM
    const totalDisplay = document.querySelector(".totalCounter");
    if (totalDisplay) {
        totalDisplay.innerHTML = `Total: $${total.toFixed(2)}`;
    }

    return total;
};

document.getElementById("purchaseButton").addEventListener("click", sendCartToWhatsApp);


const extractCartDataForSubmission = () => {
    let cartSummary = [];
    let finalTotal = 0;

    carts.forEach(cartItem => {
        const product = listItems.find(p => p.id == cartItem.productId);
        if (product) {
            const itemTotal = parseFloat(product.price) * cartItem.quantity;
            finalTotal += itemTotal;

            cartSummary.push({
                id: product.id,
                name: product.name,
                quantity: cartItem.quantity,
                unitPrice: parseFloat(product.price),
                totalPrice: itemTotal
            });
        }
    });

    return {
        items: cartSummary,
        grandTotal: finalTotal
    };
};

function sendCartToWhatsApp() {
    const cartData = extractCartDataForSubmission();
    // if (cartData.items.length === 0) {
    //     $.confirm({
    //         title: 'Cart is Empty!',
    //         content: 'You need to add items before sending your order to WhatsApp.',
    //         type: 'red',
    //         typeAnimated: true,
    //         buttons: {
    //             goShop: {
    //                 text: 'Go to Shop',
    //                 btnClass: 'btn-red',
    //                 action: function () {
    //                     dialog.showModal(); // open your product dialog
    //                 }
    //             },
    //             close: function () {}
    //         }
    //     });
    //     return;
    // }

    if (cartData.items.length === 0) {

        if (dialog.open) dialog.close();
    
        $.confirm({
            title: 'Cart is Empty!',
            content: 'You need to add items before sending your order to WhatsApp.',
            type: 'red',
            typeAnimated: true,
            boxWidth: '35vw',
            useBootstrap: false, 
            buttons: {
                goShop: {
                    text: 'Okay',
                    btnClass: 'btn-red',
                    close: function () {}
                }
            }
        });
        return;
    }    

    let message = "Hey! I want to order this items.:\n";

    cartData.items.forEach((item, index) => {
        message += `\n${index + 1}. ${item.name}\n`;
        message += `   - Unit Price: $${item.unitPrice.toFixed(2)}\n`;
        message += `   - Quantity: ${item.quantity}\n`;
        message += `   - Total: $${item.totalPrice.toFixed(2)}\n`;
    });

    message += `\nTotal to Pay: $${cartData.grandTotal.toFixed(2)}\n\n`;
    message += " Please confirm my order.";

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "5016558098";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
}


const initApp = () => {
    fetch("./json/products.json")
        .then(response => response.json())
        .then(data => {
            listItems = data;
            addDataToHTML(); // Display items

            const hash = window.location.hash;  // Get the hash from URL
            if (hash) {
                const target = document.querySelector(hash);  // Find the target element
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: "smooth" });
                    }, 100); // Optionally delay to ensure rendering is finished
                }
            }

            // Get cart from memory (localStorage)
            if(localStorage.getItem("cart")) {
                carts = JSON.parse(localStorage.getItem("cart"));
            }

            // Update cart HTML and the total price
            addToCartHTML();
            sumTotalPrice(); // Call this after loading the cart
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}

initApp();