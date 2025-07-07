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
    li.textContent = `${item} - ₹${price}`;
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
  document.querySelector("main").style.display = "none";
  document.getElementById("confirmation").classList.remove("hidden");
}
