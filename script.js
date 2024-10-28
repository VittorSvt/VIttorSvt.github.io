document.addEventListener('DOMContentLoaded', () => {
    // Página Inicial - Exibir Produtos
    if (document.getElementById('produtos')) {
        fetch('https://dummyjson.com/products')
            .then(response => response.json())
            .then(data => {
                const produtos = data.products;
                const produtosContainer = document.getElementById('produtos');
                produtos.forEach(produto => {
                    const produtoDiv = document.createElement('div');
                    produtoDiv.classList.add('produto');
                    produtoDiv.innerHTML = `
                        <h2>${produto.title}</h2>
                        <p>Preço: R$ ${produto.price.toFixed(2)}</p>
                        <img src="${produto.thumbnail}" alt="${produto.title}" style="width: 100%; height: auto;">
                        <a href="produto.html?id=${produto.id}">Ver Detalhes</a>
                        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                    `;
                    produtosContainer.appendChild(produtoDiv);
                });
            })
            .catch(error => console.error('Erro ao carregar produtos:', error));
    }

    // Página de Produto - Exibir Detalhes do Produto
    if (document.getElementById('produto-detalhe')) {
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = parseInt(urlParams.get('id'));

        fetch('https://dummyjson.com/products/' + produtoId)
            .then(response => response.json())
            .then(produto => {
                const produtoContainer = document.getElementById('produto-detalhe');
                produtoContainer.innerHTML = `
                    <h1>${produto.title}</h1>
                    <p>Categoria: ${produto.category}</p>
                    <p>Marca: ${produto.brand}</p>
                    <p>Preço: R$ ${produto.price.toFixed(2)}</p>
                    <p>Descrição: ${produto.description}</p>
                    <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                `;
            })
            .catch(error => console.error('Erro ao carregar detalhes do produto:', error));
    }

    // Página de Carrinho - Exibir Produtos do Carrinho
    if (document.getElementById('produtos-carrinho')) {
        atualizarCarrinho();
    }
});

// Função para adicionar ao carrinho
function adicionarAoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtoExistente = carrinho.find(produto => produto.id === produtoId);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({ id: produtoId, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`Produto ${produtoId} adicionado ao carrinho!`);
}

// Função para atualizar o carrinho visualmente
function atualizarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoContainer = document.getElementById('produtos-carrinho');
    const totalContainer = document.getElementById('total-carrinho');
    carrinhoContainer.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        fetch(`https://dummyjson.com/products/${item.id}`)
            .then(response => response.json())
            .then(produto => {
                total += produto.price * item.quantidade;

                const produtoDiv = document.createElement('div');
                produtoDiv.classList.add('produto-carrinho');
                produtoDiv.innerHTML = `
                    <img src="${produto.thumbnail}" alt="${produto.title}">
                    <div class="produto-carrinho-info">
                        <h2>${produto.title}</h2>
                        <p>Preço: R$ ${produto.price.toFixed(2)}</p>
                        <label>Quantidade: 
                            <input type="number" min="1" value="${item.quantidade}" data-id="${item.id}" class="quantidade-input">
                        </label>
                    </div>
                    <button onclick="removerDoCarrinho(${item.id})">Remover</button>
                `;
                carrinhoContainer.appendChild(produtoDiv);
                totalContainer.textContent = `Total: R$ ${total.toFixed(2)}`;

                // Adicionar evento de mudança na quantidade
                produtoDiv.querySelector('.quantidade-input').addEventListener('change', (event) => {
                    alterarQuantidade(event.target.dataset.id, event.target.value);
                });
            })
            .catch(error => console.error('Erro ao carregar produto do carrinho:', error));
    });
}

// Função para alterar quantidade no carrinho
function alterarQuantidade(produtoId, quantidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produto = carrinho.find(p => p.id === parseInt(produtoId));
    if (produto && quantidade > 0) {
        produto.quantidade = parseInt(quantidade);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    }
}

// Função para remover do carrinho
function removerDoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(produto => produto.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}
