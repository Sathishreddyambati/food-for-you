// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCQd4MFvO1q-6Rtr9GrvyyIoO3VF5ibLK0",
  authDomain: "foodforyou-52955.firebaseapp.com",
  databaseURL: "https://foodforyou-52955-default-rtdb.firebaseio.com",
  projectId: "foodforyou-52955",
  storageBucket: "foodforyou-52955.appspot.com",
  messagingSenderId: "992651702910",
  appId: "1:992651702910:web:5cdebc9f90e90701371e2f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Product list
const products = [
  { id: 1, name: "Chicken Biryani", price: 180 },
  { id: 2, name: "Veg Biryani", price: 150 },
  { id: 3, name: "Idly", price: 40 },
  { id: 4, name: "Masala Dosa", price: 60 },
  { id: 5, name: "Puri", price: 50 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render all products
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

// Add to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
  renderCart(); // update view if on cart page
}

// Render cart page
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("totalAmount");

  if (!container || !totalDisplay) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span>${item.name} × 
        <button onclick="changeQty(${index}, -1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${index}, 1)">+</button>
        = ₹${item.qty * item.price}
      </span>
    `;
    container.appendChild(itemDiv);
    total += item.qty * item.price;
  });

  totalDisplay.textContent = `Total: ₹${total}`;
}

// Change quantity
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Submit Order
function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const mapLink = document.getElementById("mapLink").value || "Not Provided";
  const payment = document.querySelector("input[name='payment']:checked").value;

  const orderId = generateOrderID();
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const msg = `*New Order* 🚨\n🧾 Order ID: ${orderId}\n👤 Name: ${name}\n📍 Address: ${address}\n📌 Map: ${mapLink}\n\n🛒 Items:\n` +
    cart.map(i => `- ${i.name} × ${i.qty} = ₹${i.qty * i.price}`).join("\n") +
    `\n\n💰 Total: ₹${total}\n💳 Payment: ${payment}`;

  const encodedMsg = encodeURIComponent(msg);
  const whatsappURL = `https://wa.me/916309091558?text=${encodedMsg}`;
  window.open(whatsappURL, "_blank");

  saveOrderToFirebase(orderId, name, address, mapLink, cart, total, payment);

  setTimeout(() => {
    localStorage.removeItem("cart");
    window.location.href = "success.html?orderId=" + orderId;
  }, 3000);
}

// Save to Firebase
function saveOrderToFirebase(orderId, name, address, mapLink, cart, total, payment) {
  const timestamp = new Date().toLocaleString();
  const orderData = {
    name,
    address,
    mapLink,
    items: cart,
    total,
    payment,
    status: "Confirmed",
    timestamp
  };

  firebase.database().ref("orders/" + orderId).set(orderData)
    .then(() => console.log("✅ Order saved"))
    .catch(err => console.error("❌ Firebase error:", err));
}

// Generate Order ID
function generateOrderID() {
  return "ORD" + Math.floor(100000 + Math.random() * 900000);
}

// Init
window.onload = function () {
  renderProducts();
  renderCart();

  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", submitOrder);
  }
};
