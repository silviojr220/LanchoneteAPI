const api = "https://localhost:7200/api";

let produtosCache = [];
let carrinho = [];

let produtoAtual = null;
let quantidadeAtual = 1;

/* INIT */

carregarUsuario();
carregarProdutos();

/* SIDEBAR */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList
        .toggle("closed");
}

/* USER */

function carregarUsuario() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

        return;
    }

    const payload = JSON.parse(
        atob(token.split(".")[1])
    );

    document.getElementById("nomeUsuario")
        .innerText = payload.email || "Cliente";
}

/* PRODUTOS */

async function carregarProdutos() {

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    produtosCache = Array.isArray(data)
        ? data
        : data.dados || [];

    renderSidebar();

    renderCarousel();
}

/* SIDEBAR */

function renderSidebar() {

    const div = document.getElementById("menuProdutos");

    div.innerHTML = "";

    produtosCache.forEach(p => {

        const item = document.createElement("div");

        item.className = "menu-item";

        item.innerHTML = `
            <span class="menu-icon">
                🍔
            </span>

            <span class="menu-text">
                ${p.nome}
            </span>
        `;

        item.addEventListener("click", () => {
            abrirProduto(p.id);
        });

        div.appendChild(item);
    });
}

/* CAROUSEL */

function renderCarousel() {

    const div = document.getElementById("carouselProdutos");

    div.innerHTML = "";

    produtosCache.forEach(p => {

        div.innerHTML += `
            <div class="carousel-card"
                 onclick="abrirProduto(${p.id})">

                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd">

                <div class="carousel-info">

                    <h5>${p.nome}</h5>

                    <small>${p.tipo}</small>

                    <div class="preco">
                        R$ ${p.preco.toFixed(2)}
                    </div>

                </div>

            </div>
        `;
    });
}

/* ABRIR PRODUTO */

function abrirProduto(id) {

    produtoAtual = produtosCache.find(
        p => p.id === id
    );

    if (!produtoAtual) {

        console.error("Produto não encontrado");

        return;
    }

    quantidadeAtual = 1;

    renderProduto();
}

function renderProduto() {

    if (!produtoAtual) return;

    const div = document.getElementById(
        "produtoSelecionado"
    );

    div.innerHTML = `
        <div class="produto-card fade-in">

            <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
            >

            <div class="produto-info">

                <h2>
                    ${produtoAtual.nome}
                </h2>

                <p>
                    Produto delicioso da nossa lanchonete 🍔
                </p>

                <div class="preco">

                    R$ ${Number(produtoAtual.preco).toFixed(2)}

                </div>

                <div class="quantidade">

                    <button onclick="diminuirQtd()">
                        -
                    </button>

                    <h4 id="qtdAtual">
                        ${quantidadeAtual}
                    </h4>

                    <button onclick="aumentarQtd()">
                        +
                    </button>

                </div>

                <button class="btn-finalizar"
                        onclick="adicionarCarrinho()">

                    Adicionar ao Carrinho

                </button>

            </div>

        </div>
    `;
}

/* QUANTIDADE */

function aumentarQtd() {

    quantidadeAtual++;

    renderProduto();
}

function diminuirQtd() {

    if (quantidadeAtual > 1) {

        quantidadeAtual--;

        renderProduto();
    }
}

/* CARRINHO */

function adicionarCarrinho() {

    const item = carrinho.find(
        i => i.produtoId === produtoAtual.id
    );

    if (item) {

        item.quantidade += quantidadeAtual;

    } else {

        carrinho.push({
            produtoId: produtoAtual.id,
            nome: produtoAtual.nome,
            preco: produtoAtual.preco,
            quantidade: quantidadeAtual
        });
    }

    renderCarrinho();
}

function renderCarrinho() {

    const div = document.getElementById("carrinho");

    const totalDiv = document.getElementById("total");

    div.innerHTML = "";

    let total = 0;

    carrinho.forEach((i, index) => {

        total += i.preco * i.quantidade;

        div.innerHTML += `
            <div class="carrinho-item">

                <div>

                    <strong>${i.nome}</strong>

                    <br>

                    <small>
                        ${i.quantidade}x
                    </small>

                </div>

                <div>

                    R$ ${(i.preco * i.quantidade).toFixed(2)}

                    <br>

                    <button class="btn btn-sm btn-danger mt-2"
                            onclick="removerItem(${index})">

                        ✕

                    </button>

                </div>

            </div>
        `;
    });

    totalDiv.innerHTML = `
        Total: R$ ${total.toFixed(2)}
    `;
}

/* REMOVER */

function removerItem(index) {

    carrinho.splice(index, 1);

    renderCarrinho();
}

/* FINALIZAR */

async function finalizarPedido() {

    const token = localStorage.getItem("token");

    if (carrinho.length === 0) {

        alert("Carrinho vazio");

        return;
    }

    const res = await fetch(`${api}/pedido`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({
            itens: carrinho
        })
    });

    if (res.ok) {

        alert("Pedido realizado!");

        carrinho = [];

        renderCarrinho();

    } else {

        alert("Erro ao finalizar");
    }
}

/* LOGOUT */

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}