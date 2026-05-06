const api = "https://localhost:7200/api";

// Verifica se é ADM ao carregar a página
function verificarAdm() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1])); // payload antes de usar
    const perfil = payload["role"]; // corrigido

    if (perfil !== "ADM") {
        alert("Acesso negado!");
        window.location.href = "index.html";
    }
}

async function carregarProdutos() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto`, {
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.status === 401) {
        alert("Sem acesso!");
        window.location.href = "login.html";
        return;
    }

    const data = await res.json();
    const produtos = Array.isArray(data) ? data : data.dados || [];

    const ul = document.getElementById("listaProdutos");
    ul.innerHTML = "";

    produtos.forEach(p => {
        ul.innerHTML += `
            <li class="mb-2">
                ${p.nome} - R$ ${p.preco}
                <button class="btn btn-sm btn-warning ms-2" onclick="editarProduto(${p.id}, '${p.nome}', '${p.tipo}', ${p.preco})">✏️</button>
                <button class="btn btn-sm btn-danger ms-1" onclick="deletar(${p.id})">🗑</button>
            </li>
        `;
    });
}

async function criarProduto() {
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;
    const preco = parseFloat(document.getElementById("preco").value);

    if (!nome || !tipo || isNaN(preco)) {
        alert("Preencha todos os campos!");
        return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nome, tipo, preco })
    });

    if (res.ok) {
        alert("Produto criado!");
        document.getElementById("nome").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("preco").value = "";
        carregarProdutos();
    } else {
        alert("Erro ao criar produto");
    }
}

function editarProduto(id, nomeAtual, tipoAtual, precoAtual) {
    // Preenche o formulário com os dados atuais
    document.getElementById("nome").value = nomeAtual;
    document.getElementById("tipo").value = tipoAtual;
    document.getElementById("preco").value = precoAtual;

    // Troca o botão Cadastrar por Salvar
    const btn = document.querySelector("button[onclick='criarProduto()']");
    btn.textContent = "Salvar Alterações";
    btn.setAttribute("onclick", `salvarEdicao(${id})`);
}

async function salvarEdicao(id) {
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;
    const preco = parseFloat(document.getElementById("preco").value);

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nome, tipo, preco })
    });

    if (res.ok) {
        alert("Produto atualizado!");

        // Volta o botão para Cadastrar
        const btn = document.querySelector(`button[onclick='salvarEdicao(${id})']`);
        btn.textContent = "Cadastrar";
        btn.setAttribute("onclick", "criarProduto()");

        document.getElementById("nome").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("preco").value = "";

        carregarProdutos();
    } else {
        alert("Erro ao atualizar produto");
    }
}

async function deletar(id) {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
        alert("Produto removido!");
        carregarProdutos();
    } else {
        alert("Erro ao deletar");
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Inicializar
verificarAdm();
carregarProdutos();