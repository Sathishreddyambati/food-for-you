const products = [
  { id: 1, name: "Chicken Biryani", price: 180 },
  { id: 2, name: "Veg Biryani", price: 150 },
  { id: 3, name: "Idly", price: 40 },
  { id: 4, name: "Masala Dosa", price: 60 },
  { id: 5, name: "Puri", price: 50 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";
  products.forEach(product => {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(item);
  });
}

function addToCart(id) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("totalAmount");
  if (!container || !totalDisplay) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.qty * item.price;
    container.innerHTML += `
      <div class="cart-item">
        ${item.name} × 
        <button onclick="changeQty(${index}, -1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${index}, 1)">+</button>
        = ₹${item.qty * item.price}
      </div>
    `;
  });

  totalDisplay.innerText = `Total: ₹${total}`;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function submitOrder() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const mapLink = document.getElementById("mapLink").value;
  const payment = document.querySelector("input[name='payment']:checked").value;
  const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const order = {
    name,
    address,
    mapLink,
    payment,
    items: cart,
    total,
    status: "Confirmed",
    timestamp: new Date().toLocaleString()
  };

  const msg = `*New Order* 🚨\n🧾 Order ID: ${orderId}\n👤 Name: ${name}\n📍 Address: ${address}\n📌 Map: ${mapLink || "Not Provided"}\n\n🛒 Items:\n` +
    cart.map(i => `- ${i.name} × ${i.qty} = ₹${i.qty * i.price}`).join("\n") +
    `\n\n💰 Total: ₹${total}\n💳 Payment: ${payment}`;

  const encodedMsg = encodeURIComponent(msg);
  const phoneNumber = "91" + "6309091558";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const whatsappURL = isMobile
    ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMsg}`
    : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMsg}`;

  window.open(whatsappURL, "_blank");

  firebase.database().ref("orders/" + orderId).set(order);

  localStorage.removeItem("cart");
  setTimeout(() => {
    window.location.href = "success.html";
  }, 2000);
}

window.onload = function () {
  renderProducts();
  renderCart();
};
