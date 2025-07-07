const firebaseConfig = {
  apiKey: "AIzaSyCQd4MFvO1q-6Rtr9GrvyyIoO3VF5ibLK0",
  authDomain: "foodforyou-52955.firebaseapp.com",
  projectId: "foodforyou-52955",
  databaseURL: "https://foodforyou-52955-default-rtdb.firebaseio.com",
  storageBucket: "foodforyou-52955.appspot.com",
  messagingSenderId: "992651702910",
  appId: "1:992651702910:web:5cdebc9f90e90701371e2f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function checkPassword() {
  const pass = document.getElementById("admin-pass").value;
  if (pass === "sathishadmin123") {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("orders").style.display = "block";
    loadOrders();
  } else {
    alert("Incorrect password");
  }
}

function updateStatus(orderId, newStatus) {
  db.ref('orders/' + orderId).update({ status: newStatus });
}

function loadOrders() {
  const ordersDiv = document.getElementById("orders");
  db.ref('orders').on('value', snapshot => {
    ordersDiv.innerHTML = "";
    const orders = snapshot.val();
    for (let id in orders) {
      const o = orders[id];
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>Order ID: ${id}</h3>
        <p><strong>Name:</strong> ${o.name}</p>
        <p><strong>Items:</strong> ${o.items}</p>
        <p><strong>Status:</strong> ${o.status}</p>
        <button onclick="updateStatus('${id}', 'Confirmed')">Confirm</button>
        <button onclick="updateStatus('${id}', 'Preparing')">Preparing</button>
        <button onclick="updateStatus('${id}', 'Out for Delivery')">Out for Delivery</button>
        <button onclick="updateStatus('${id}', 'Delivered')">Delivered</button>
        <hr/>
      `;
      ordersDiv.appendChild(div);
    }
  });
}
