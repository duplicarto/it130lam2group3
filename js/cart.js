let carts = document.querySelectorAll('.add-cart');
let products = [
	{
		name: "Akai DVD Home Theater System",
		tag: "akaidvdhometheatersystem",
		price: 4880,
		inCart: 0
	},
	{
		name: "Anker Stereo Bluetooth Speaker",
		tag: "ankerstereobluetoothspeaker",
		price: 2000,
		inCart: 0
	},
	{
		name: "Bauhn Stereo Bluetooth Speaker",
		tag: "bauhnstereobluetoothspeaker",
		price: 6573,
		inCart: 0
	},
	{
		name: "Bauhn Wheeled Stereo Bluetooth Speaker",
		tag: "bauhnwheeledstereobluetoothspeaker",
		price: 4474,
		inCart: 0
	},
	{
		name: "ECandy Bluetooth Headset",
		tag: "ecandybluetoothheadset",
		price: 4880,
		inCart: 0
	},
	{
		name: "Kuchef-01 Electric Water Heater",
		tag: "kuchef-01electricwaterheater",
		price: 900,
		inCart: 0
	},
	{
		name: "Kuchef-02 Electric Water Heater",
		tag: "kuchef-02electricwaterheater",
		price: 500,
		inCart: 0
	},
];

for (let i = 0; i < carts.length; i++) {
	carts[i].addEventListener('click', () => {
		cartNum(products[i]);
		totalCost(products[i]);
	})
}

function onLoadCartNum() {
	let productNum = localStorage.getItem('cartNum');
	if (productNum) {
		document.querySelector('.navigation span').textContent = productNum;
	}
}

function cartNum(products, action) {
	console.log("Product clicked: ", products);
	let productNum = localStorage.getItem('cartNum');
	productNum = parseInt(productNum);
	console.log(productNum);

	let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);

	if (action == "decrease") {
		localStorage.setItem('cartNum', productNum - 1);
		document.querySelector('.navigation span').textContent = productNum - 1;
	}
	else if (productNum) {
		localStorage.setItem('cartNum', productNum + 1);
		document.querySelector('.navigation span').textContent = productNum + 1;
	}
	else {
		localStorage.setItem('cartNum', 1);
		document.querySelector('.navigation span').textContent = 1;
	}

	
	setItems(products);
}

function setItems(products) {
	let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);
	
	if (cartItems != null) {
		if (cartItems[products.tag] == undefined) {
			cartItems = {
				...cartItems,
				[products.tag]: products
			}
		}
		cartItems[products.tag].inCart += 1;
	}
	else {
		products.inCart = 1;
		cartItems = {
			[products.tag]: products
		}
	}
	localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(products, action) {
	let cartCost = localStorage.getItem('totalCost');

	if (action == "decrease") {
		cartCost = parseInt(cartCost);
		localStorage.setItem('totalCost', cartCost - products.price);
	}
	else if (cartCost != null) {
		cartCost = parseInt(cartCost);
		localStorage.setItem("totalCost", cartCost + products.price);
	}
	else {
		localStorage.setItem("totalCost", products.price);
	}
}

function displayCart() {
	let cartItems = localStorage.getItem("productsInCart");
	cartItems = JSON.parse(cartItems);
	let productContainer = document.querySelector(".cart-list");
	let cartCost = localStorage.getItem('totalCost');

	if (cartItems && productContainer) {
		productContainer.innerHTML = '';
		Object.values(cartItems).map(item => {
			productContainer.innerHTML += `
				<tr>
					<td class="prd-title">
						<i class="fa-solid fa-circle-xmark"></i>
						<img src="img/products/${item.tag}.png">
						<span>${item.name}</span>
					</td>
					<td class="prd-price"><span>Php ${item.price}.00</span></td>
					<td class="prd-qty">
						<i class="fa-solid fa-circle-chevron-left" id="decrease"></i>
						<span>${item.inCart}</span>
						<i class="fa-solid fa-circle-chevron-right" id="increase"></i>
					</td>
					<td class="prd-total">
						<span>Php ${item.inCart * item.price}.00</span>
					</td>
				</tr>
			`;
		});

		productContainer.innerHTML += `
			<tr>
				<td class="prd-title"></td>
				<td class="prd-price"></td>
				<td class="prd-qty"><h4>Total Price</h4></td>
				<td class="prd-total">Php ${cartCost}.00</td>
			</tr>
		`;
	}
	deleteButtons();
	manageQty();
}

function deleteButtons() {
	let deleteButtons = document.querySelectorAll('.prd-title i');
	let productName;
	let productNum = localStorage.getItem('cartNum');
	let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);
	let cartCost = localStorage.getItem('totalCost');

	for (let i = 0; i < deleteButtons.length; i++) {
		deleteButtons[i].addEventListener('click', () => {
			productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');

			localStorage.setItem('cartNum', productNum - cartItems[productName].inCart);
			localStorage.setItem('totalCost', cartCost - (cartItems[productName].price * cartItems[productName].inCart));

			delete cartItems[productName];
			localStorage.setItem('productsInCart', JSON.stringify(cartItems));

			displayCart();
			onLoadCartNum();
		});
	}
}

function manageQty() {
	let decreaseButtons = document.querySelectorAll('#decrease');
	let increaseButtons = document.querySelectorAll('#increase');
	let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);
	let currentQuantity = 0;
	let currentProduct = "";

	for (let i = 0; i < decreaseButtons.length; i++) {
		decreaseButtons[i].addEventListener('click', () => {
			currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
			currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
			console.log(currentProduct);

			if (cartItems[currentProduct].inCart > 1) {
				cartItems[currentProduct].inCart--;
				cartNum(cartItems[currentProduct], "decrease");
				totalCost(cartItems[currentProduct], "decrease");
				localStorage.setItem('productsInCart', JSON.stringify(cartItems));
				displayCart();
			}
		});
	}
	for (let i = 0; i < increaseButtons.length; i++) {
		increaseButtons[i].addEventListener('click', () => {
			currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
			currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
			console.log(currentProduct);

			cartItems[currentProduct].inCart++;
			cartNum(cartItems[currentProduct]);
			totalCost(cartItems[currentProduct]);
			localStorage.setItem('productsInCart', JSON.stringify(cartItems));
			displayCart();
		});
	}
}

onLoadCartNum();
displayCart();