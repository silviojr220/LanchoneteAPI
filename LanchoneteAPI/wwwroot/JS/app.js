const api = "/api";

let produtosCache = [];
let carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;

/* INIT */

carregarUsuario();
carregarProdutos();


/* TOAST */

function mostrarToast(mensagem, tipo = "success") {

    const toast = document.getElementById("toast");

    const toastBody = document.getElementById("toastBody");

    toast.className = "toast border-0 text-white";

    if (tipo === "success") {

        toast.classList.add("bg-success");

    } else if (tipo === "error") {

        toast.classList.add("bg-danger");

    } else if (tipo === "warning") {

        toast.classList.add("bg-warning");
        toast.classList.remove("text-white");
        toast.classList.add("text-dark");

    } else {

        toast.classList.add("bg-primary");
    }

    toastBody.innerHTML = mensagem;

    const bsToast = new bootstrap.Toast(toast);

    bsToast.show();
}

/* SIDEBAR */

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("closed");
}

function renderSidebar() {

    const div = document.getElementById("menuProdutos");

    div.innerHTML = "";

    produtosCache.forEach(p => {

        const item = document.createElement("div");

        item.className = "menu-item";

        item.innerHTML = `
            <span class="menu-icon">
                <i class="bi bi-bag-fill"></i>
            </span>

            <span class="menu-text">
                ${p.nome}
            </span>
        `;

        item.addEventListener("click", () => abrirProduto(p.id));

        div.appendChild(item);
    });
}

/* USER */

function carregarUsuario() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    document.getElementById("nomeUsuario").innerText =
        payload.email || "Cliente";
}

/* PRODUTOS */

async function carregarProdutos() {

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    let data = {};

    try {
        data = await res.json();
    } catch { }

    produtosCache = Array.isArray(data)
        ? data
        : data.dados || [];

    renderSidebar();
    renderCarousel();
}

/* CAROUSEL */

function renderCarousel() {

    const div = document.getElementById("carouselProdutos");

    div.innerHTML = "";

    produtosCache.forEach(p => {

        const card = document.createElement("div");

        card.className = "carousel-card";

        card.addEventListener("click", () => abrirProduto(p.id));

        card.innerHTML = `

            <!-- IMAGEM DO PRODUTO -->
            <img 
                src="${p.imagemUrl || '/img/default.png'}"
                alt="${p.nome}"
            >

            <div class="carousel-info">

                <h5>
                    <i class="bi bi-bag-fill"></i>
                    ${p.nome}
                </h5>

                <small>
                    <i class="bi bi-tag-fill"></i>
                    ${p.tipo}
                </small>

                <div class="preco">

                    <i class="bi bi-cash-coin"></i>

                    R$ ${Number(p.preco).toFixed(2)}

                </div>

            </div>
        `;

        div.appendChild(card);
    });
}

function scrollCarousel(direction) {

    document.getElementById("carouselProdutos").scrollBy({
        left: 260 * direction,
        behavior: "smooth"
    });
}

/* ABRIR PRODUTO */

function abrirProduto(id) {

    produtoAtual = produtosCache.find(p => p.id === id);

    if (!produtoAtual) {
        console.error("Produto não encontrado");
        return;
    }

    quantidadeAtual = 1;

    renderProduto();
}

/* RENDER PRODUTO */

function renderProduto() {

    if (!produtoAtual) return;

    const div = document.getElementById("produtoSelecionado");

    div.innerHTML = `

        <div class="produto-card fade-in">

            <!-- IMAGEM PRINCIPAL -->
            <img 
                src="${produtoAtual.imagemUrl || '/img/default.png'}"
                alt="${produtoAtual.nome}"
            >

            <div class="produto-info">

                <h2>

                    <i class="bi bi-bag-fill"></i>

                    ${produtoAtual.nome}

                </h2>

                <p>

                    ${produtoAtual.descricao || 'Produto delicioso da nossa lanchonete'}

                </p>

                <div class="preco">

                    R$ ${Number(produtoAtual.preco).toFixed(2)}

                </div>

                <div class="quantidade">

                    <button onclick="diminuirQtd()">
                        <i class="bi bi-dash-lg"></i>
                    </button>

                    <h4 id="qtdAtual">
                        ${quantidadeAtual}
                    </h4>

                    <button onclick="aumentarQtd()">
                        <i class="bi bi-plus-lg"></i>
                    </button>

                </div>

                <button 
                    class="btn-finalizar"
                    onclick="adicionarCarrinho()"
                >

                    <i class="bi bi-cart-plus-fill"></i>

                    Adicionar ao Carrinho

                </button>

            </div>

        </div>
    `;
}

/* QUANTIDADE */

function aumentarQtd() {

    quantidadeAtual++;

    document.getElementById("qtdAtual").innerText =
        quantidadeAtual;
}

function diminuirQtd() {

    if (quantidadeAtual > 1) {

        quantidadeAtual--;

        document.getElementById("qtdAtual").innerText =
            quantidadeAtual;
    }
}

/* CARRINHO */

function adicionarCarrinho() {

    const item = carrinho.find(i =>
        i.produtoId === produtoAtual.id
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

        div.insertAdjacentHTML("beforeend", `

            <div class="carrinho-item">

                <div>

                    <strong>${i.nome}</strong><br>

                    <small>${i.quantidade}x</small>

                </div>

                <div>

                    R$ ${(i.preco * i.quantidade).toFixed(2)}

                    <br>

                    <button 
                        class="btn btn-sm btn-danger mt-2"
                        onclick="removerItem(${index})"
                    >

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            </div>
        `);
    });

    totalDiv.innerHTML =
        `Total: R$ ${total.toFixed(2)}`;
}

/* REMOVER ITEM */

function removerItem(index) {

    carrinho.splice(index, 1);

    renderCarrinho();
}

/* FINALIZAR PEDIDO */

async function finalizarPedido() {

    const token = localStorage.getItem("token");

    if (carrinho.length === 0) {

        mostrarToast(
            '<i class="bi bi-cart-x-fill"></i> Carrinho vazio',
            'warning'
        );

        return;
    }

    try {

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

            mostrarToast(
                '<i class="bi bi-check-circle-fill"></i> Pedido realizado com sucesso!',
                'success'
            );

            carrinho = [];

            renderCarrinho();

        } else {

            mostrarToast(
                '<i class="bi bi-x-circle-fill"></i> Erro ao finalizar pedido',
                'error'
            );
        }

    } catch {

        mostrarToast(
            '<i class="bi bi-wifi-off"></i> Erro de conexão com servidor',
            'error'
        );
    }
}

/* LOGOUT */

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}