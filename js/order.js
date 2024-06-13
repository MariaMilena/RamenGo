document.addEventListener('DOMContentLoaded', () => {
    const orderData = JSON.parse(localStorage.getItem('orderResponse'));
    if (orderData) {
      const orderSummary = document.getElementById('order');
      orderSummary.innerHTML = `
        <div class="order-container">
            <div class="order-image">
                <img src="${orderData.image}" alt="${orderData.description}" class="food-img">
                <img src="./img/background-azul.png" alt="Fixed Image" class="fixed-image">
            </div>
            <div class="order-details">
                <h2>Your Order:</h2>
                <h1>${orderData.description}</h1>
            </div>
        </div>
      `;
    } else {
      alert('No order data found');
    }
  });
  