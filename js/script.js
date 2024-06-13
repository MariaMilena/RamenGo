const apiKey = "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf";
let selectedBrothId = null;
let selectedProteinId = null;

async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


// Função para criar um card HTML com base nos dados
function createCard(data, container) {
  const card = document.createElement('div');
  card.classList.add('card');
  
  // Imagem
  const image = document.createElement('img');
  image.src = data.imageInactive;
  image.dataset.original = data.imageInactive; // URL da imagem original
  image.dataset.active = data.imageActive; 
  image.alt = data.name;
  card.appendChild(image);
  
  // Título
  const title = document.createElement('p');
  title.className = 'title-card';
  title.textContent = data.name;
  card.appendChild(title);
  
  // Descrição
  const description = document.createElement('p');
  description.className = 'description-card';
  description.textContent = data.description;
  card.appendChild(description);
  
  // Preço
  const price = document.createElement('p');
  price.className = 'price-card';
  price.textContent = `US$ ${data.price}`;
  card.appendChild(price);

  card.addEventListener('click', () => {
    const activeCard = container.querySelector('.card.active');
    if (activeCard && activeCard !== card) {
      activeCard.classList.remove('active');
      const activeImage = activeCard.querySelector('img');
      activeImage.src = activeImage.dataset.original; 
    }
    card.classList.toggle('active');
    const isBroth = container.classList.contains('broths');
    if (isBroth) {
      selectedBrothId = data.id;
    } else {
      selectedProteinId = data.id;
    }
    const cardImage = card.querySelector('img');
    if (card.classList.contains('active')) {
      cardImage.src = cardImage.dataset.active; // Define a imagem ativa
    } else {
      cardImage.src = cardImage.dataset.original; // Restaura a imagem original
    }

    updateButtonState();
  });
  
  return card;
}

async function loadBroths() {
  const broths = await fetchData('https://api.tech.redventures.com.br/broths');
  const brothsContainer = document.getElementById('broths');
  if (broths && Array.isArray(broths)) {
    broths.forEach(broth => {
      const card = createCard(broth, brothsContainer);
      brothsContainer.appendChild(card);
    });
  }
}

async function loadProteins() {
  const proteins = await fetchData('https://api.tech.redventures.com.br/proteins');
  const proteinsContainer = document.getElementById('proteins');
  if (proteins && Array.isArray(proteins)) {
    proteins.forEach(protein => {
      const card = createCard(protein, proteinsContainer);
      proteinsContainer.appendChild(card);
    });
  }
}

// Função para atualizar o estado do botão
function updateButtonState() {
  const brothsActive = document.querySelector('#broths .card.active');
  const proteinsActive = document.querySelector('#proteins .card.active');
  const button = document.getElementById('orderButton');
  if (brothsActive && proteinsActive) {
    button.disabled = false;
    button.textContent = 'Order Now ';
    const arrowSpan = document.createElement('span');
    arrowSpan.innerHTML = '&rarr;';
    button.appendChild(arrowSpan);
  } else {
    button.disabled = true;
    button.textContent = 'Place my order ';
    const arrowSpan = document.createElement('span');
    arrowSpan.innerHTML = '&rarr;';
    button.appendChild(arrowSpan);
  }
}

// Event listener para o botão de pedido
document.getElementById('orderButton').addEventListener('click', async () => {
  const orderData = {
    brothId: selectedBrothId,
    proteinId: selectedProteinId
  };

  const response = await fetch('https://api.tech.redventures.com.br/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf'
    },
    body: JSON.stringify(orderData)
  });

  if (response.ok) {
    const responseData = await response.json();
    localStorage.setItem('orderResponse', JSON.stringify(responseData));
    window.location.href = 'order.html'; // Redireciona para a nova página
  } else {
    alert('Failed to place order');
  }
});

// Carregar broths e proteins quando a página carregar
loadBroths();
loadProteins();
