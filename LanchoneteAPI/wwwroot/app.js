const api = "https://localhost:7200/api";

let carrinho = [];

// carregar produtos
async function carregarProdutos() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${api}/produto`, {
            headers: token ? {
                "Authorization": "Bearer " + token
            } : {}
        });

        if (res.status === 401) {
            alert("Faça login primeiro!");
            window.location.href = "login.html";
            return;
        }

        if (!res.ok) {
            console.error("Erro:", res.status);
            const text = await res.text();
            console.error(text);
            return;
        }

        const data = await res.json();
        console.log("Resposta produtos:", data);

        const produtos = Array.isArray(data)
            ? data
            : data.dados || [];

        const div = document.getElementById("produtos");
        div.innerHTML = "";

        produtos.forEach(p => {
            div.innerHTML += `
                <div class="col-3">
                    <div class="card p-2">
                        <h5>${p.nome}</h5>
                        <p>R$ ${Number(p.preco).toFixed(2)}</p>
                        <button class="btn btn-primary" onclick="addCarrinho(${p.id})">
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
        });

    } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
}

// adicionar ao carrinho
function addCarrinho(id) {
    const item = carrinho.find(i => i.produtoId === id);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({ produtoId: id, quantidade: 1 });
    }

    atualizarCarrinho();
}

// atualizar carrinho
function atualizarCarrinho() {
    const ul = document.getElementById("carrinho");
    ul.innerHTML = "";

    carrinho.forEach(i => {
        ul.innerHTML += `<li>Produto ${i.produtoId} - Qtd: ${i.quantidade}</li>`;
    });
}

// finalizar pedido
async function finalizarPedido() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa fazer login!");
        window.location.href = "login.html";
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

function logout() {
    localStorage.removeItem("token");
    alert("Você saiu do sistema");
    window.location.href = "login.html";
}

// inicializar
carregarProdutos();