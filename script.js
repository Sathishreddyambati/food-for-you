document.getElementById("order-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const items = document.getElementById("items").value;
  const address = document.getElementById("address").value;
  const maplink = document.getElementById("maplink").value;
  const payment = document.getElementById("payment").value;
  const orderId = "ORD_" + Date.now();

  const orderMessage = \`New Order ID: \${orderId}\nName: \${name}\nItems: \${items}\nAddress: \${address}\nMap: \${maplink}\nPayment: \${payment}\`;

  const phoneNumber = "91XXXXXXXXXX"; // replace with your WhatsApp number
  const whatsappLink = \`https://wa.me/\${phoneNumber}?text=\${encodeURIComponent(orderMessage)}\`;

  // Save to Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCQd4MFvO1q-6Rtr9GrvyyIoO3VF5ibLK0",
    authDomain: "foodforyou-52955.firebaseapp.com",
    projectId: "foodforyou-52955",
    databaseURL: "https://foodforyou-52955-default-rtdb.firebaseio.com",
    storageBucket: "foodforyou-52955.appspot.com",
    messagingSenderId: "992651702910",
    appId: "1:992651702910:web:5cdebc9f90e90701371e2f"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  db.ref("orders/" + orderId).set({
    name,
    items,
    address,
    maplink,
    payment,
    status: "Pending"
  });

  // Redirect to success page
  window.location.href = \`success.html?id=\${orderId}\`;

  // Optional: trigger WhatsApp (if needed)
  // window.open(whatsappLink, "_blank");
});
