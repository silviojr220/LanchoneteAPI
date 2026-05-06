const api = "https://localhost:7200/api";

let carrinho = [];
let produtosCache = [];

async function carregarProdutos() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${api}/produto`, {
            headers: token ? { "Authorization": "Bearer " + token } : {}
        });

        if (res.status === 401) {
            alert("Faça login primeiro!");
            window.location.href = "login.html";
            return;
        }

        if (!res.ok) {
            const text = await res.text();
            console.error("Erro:", res.status, text);
            return;
        }

        const data = await res.json();
        const produtos = Array.isArray(data) ? data : data.dados || [];
        produtosCache = produtos;

        const div = document.getElementById("produtos");
        div.innerHTML = "";

        // 🔥 cria tudo em memória primeiro (performance melhor)
        const fragment = document.createDocumentFragment();

        produtos.forEach(p => {
            const col = document.createElement("div");
            col.className = "col-md-4 col-sm-6";

            col.innerHTML = `
                <div class="card h-100 produto-card">
                    <div class="card-body d-flex flex-column">
                        
                        <h6 class="fw-bold">${p.nome}</h6>
                        <small class="text-muted mb-2">${p.tipo}</small>

                        <div class="price mb-3">
                            R$ ${Number(p.preco).toFixed(2)}
                        </div>

                        <button class="btn btn-primary btn-sm mt-auto">
                            + Adicionar
                        </button>
                    </div>
                </div>
            `;

            // 🔥 evita onclick inline (mais profissional)
            col.querySelector("button").addEventListener("click", () => {
                addCarrinho(p.id);
            });

            fragment.appendChild(col);
        });

        div.appendChild(fragment);

    } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
}

function addCarrinho(id) {
    const produto = produtosCache.find(p => p.id === id);

    if (!produto) {
        console.error("Produto não encontrado no cache");
        return;
    }

    const item = carrinho.find(i => i.produtoId === id);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({
            produtoId: id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

function atualizarCarrinho() {
    const ul = document.getElementById("carrinho");
    const totalDiv = document.getElementById("total");

    ul.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {
        ul.innerHTML = `<li class="list-group-item text-muted">Nenhum item</li>`;
        totalDiv.innerHTML = "Total: R$ 0,00";
        return;
    }

    carrinho.forEach((i, index) => {
        const subtotal = i.preco * i.quantidade;
        total += subtotal;

        ul.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${i.nome}</strong><br>
                    <small>R$ ${i.preco.toFixed(2)}</small>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <span class="badge badge-qtd">${i.quantidade}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="removerItem(${index})">✕</button>
                </div>
            </li>
        `;
    });

    totalDiv.innerHTML = `Total: R$ ${total.toFixed(2)}`;
}

async function finalizarPedido() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa fazer login!");
        window.location.href = "login.html";
        return;
    }

    if (carrinho.length === 0) {
        alert("Adicione itens ao carrinho antes de finalizar!");
        return;
    }

    try {
        const res = await fetch(`${api}/pedido`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ itens: carrinho })
        });

        if (res.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        if (!res.ok) {
            const text = await res.text();
            console.error("Erro pedido:", text);
            alert("Erro ao finalizar pedido");
            return;
        }

        alert("Pedido realizado com sucesso!");
        carrinho = [];
        atualizarCarrinho();

    } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function logout() {
    localStorage.removeItem("token");
    alert("Você saiu do sistema");
    window.location.href = "login.html";
}

carregarProdutos();