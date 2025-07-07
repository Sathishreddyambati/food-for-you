// Firebase configuration
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

// Load cart on page load
document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  displayCart(cart);

  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const mapLink = document.getElementById("mapLink").value || "Not Provided";
      const payment = document.querySelector('input[name="payment"]:checked').value;

      const orderId = generateOrderID();
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

      let message = `*New Order* 🚨\n`;
      message += `🧾 Order ID: ${orderId}\n`;
      message += `👤 Name: ${name}\n`;
      message += `📍 Address: ${address}\n`;
      message += `📌 Map: ${mapLink}\n\n`;
      message += `🛒 Items:\n`;

      cart.forEach(item => {
        message += `- ${item.name} × ${item.qty} = ₹${item.qty * item.price}\n`;
      });

      message += `\n💰 Total: ₹${total}\n`;
      message += `💳 Payment: ${payment}`;

      const whatsappURL = `https://wa.me/916309091558?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      window.open(whatsappURL, '_blank');

      // Save to Firebase
      saveOrderToFirebase(orderId, name, address, mapLink, cart, total, payment);

      // Redirect to success after short delay
      setTimeout(() => {
        localStorage.removeItem("cart");
        window.location.href = "success.html?orderId=" + orderId;
      }, 3000);
    });
  }
});

// Generate random Order ID
function generateOrderID() {
  return 'ORD' + Math.floor(Math.random() * 1000000);
}

// Display cart items on order page
function displayCart(cart) {
  const cartContainer = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("totalAmount");

  if (!cartContainer || !totalDisplay) return;

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    `;
    cartContainer.appendChild(itemDiv);
    total += item.price * item.qty;
  });

  totalDisplay.textContent = `Total: ₹${total}`;
}

// Save order to Firebase
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

  const db = firebase.database();
  db.ref("orders/" + orderId).set(orderData)
    .then(() => {
      console.log("✅ Order saved to Firebase");
    })
    .catch((error) => {
      console.error("❌ Error saving order:", error);
    });
        }
