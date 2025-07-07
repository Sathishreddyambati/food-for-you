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

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('order');

const container = document.getElementById("status-container");

if (!orderId) {
  container.innerHTML = "<p>No order ID found in link.</p>";
} else {
  db.ref('orders/' + orderId).on('value', snapshot => {
    const data = snapshot.val();
    if (!data) {
      container.innerHTML = "<p>Order not found.</p>";
      return;
    }

    container.innerHTML = `
      <h3>Order for ${data.name}</h3>
      <p><strong>Items:</strong> ${data.items}</p>
      <p><strong>Status:</strong> <span style="color:#ff6f00;font-weight:bold">${data.status}</span></p>
    `;
  });
}
