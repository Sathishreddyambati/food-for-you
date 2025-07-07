// Sample product list – update as needed
const products = [
  { id: 1, name: "Chicken Biryani", price: 180 },
  { id: 2, name: "Veg Biryani", price: 150 },
  { id: 3, name: "Idly", price: 40 },
  { id: 4, name: "Masala Dosa", price: 60 },
  { id: 5, name: "Puri", price: 50 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(product => {
    const item = document.createElement("div");
    item.innerHTML = `
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(item);
  });
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Item added to cart!");
}

function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.qty * item.price;
    container.innerHTML += `
      <div>
        ${item.name} - ₹${item.price} × 
        <button onclick="changeQty(${index}, -1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
    `;
  });
  document.getElementById("total").innerText = total;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
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

  firebase.database().ref("orders/" + orderId).set(order, err => {
    if (!err) {
      localStorage.removeItem("cart");

      const msg = `*New Order Received* 🍽️\n\n🧾 *Order ID:* ${orderId}\n👤 *Customer:* ${name}\n📍 *Address:* ${address}\n🔗 *Map:* ${mapLink || "Not Provided"}\n\n🛒 *Items:*\n` +
        cart.map(i => `- ${i.name} × ${i.qty} = ₹${i.qty * i.price}`).join("\n") +
        `\n\n💰 *Total:* ₹${total}\n💳 *Payment:* ${payment}`;

      const encodedMsg = encodeURIComponent(msg);
      const phoneNumber = "91" + "6309091558";
      window.location.href = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
    } else {
      alert("Order failed. Please try again.");
    }
  });
}

window.onload = function () {
  renderProducts();
  renderCart();
};
