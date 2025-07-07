let cart = [];

function addToCart(item, price) {
  cart.push({ item, price });
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-list");
  const totalSpan = document.getElementById("total");
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach(({ item, price }) => {
    const li = document.createElement("li");
    li.textContent = `${item} - â‚¹${price}`;
    cartList.appendChild(li);
    total += price;
  });
  totalSpan.textContent = total;
}

function submitOrder(event) {
  event.preventDefault();
  if (cart.length === 0) {
    alert("Please add items to your cart before placing the order.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  let orderMessage = `*New Order - Food For You*\n`;
  orderMessage += `ðŸ‘¤ Name: ${name}\nðŸ“ž Phone: ${phone}\nðŸ“ Address: ${address}\n\nðŸ§¾ Order:\n`;

  let total = 0;
  cart.forEach(({ item, price }) => {
    orderMessage += `- ${item}: â‚¹${price}\n`;
    total += price;
  });
  orderMessage += `\nðŸ’° Total: â‚¹${total}`;

  const encodedMsg = encodeURIComponent(orderMessage);
  const whatsappURL = `https://wa.me/916309091558?text=${encodedMsg}`; // Replace with your WhatsApp number

  window.open(whatsappURL, '_blank');
}
