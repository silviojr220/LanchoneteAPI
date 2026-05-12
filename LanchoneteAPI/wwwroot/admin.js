const api = "/api";

// Verifica se é ADM ao carregar a página
function verificarAdm() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const perfil = payload["role"];

    if (perfil !== "ADM" && perfil !== "SUPERADM") {
        mostrarToast("Acesso negado!");
        window.location.href = "index.html";
    }
}

async function carregarProdutos() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (res.status === 401) {
        window.location.href = "login.html";
        return;
    }

    let data = {}; try {   data = await res.json();} catch {}
    const produtos = Array.isArray(data) ? data : data.dados || [];

    const tbody = document.getElementById("listaProdutos");
    tbody.innerHTML = "";

    produtos.forEach(p => {
        tbody.innerHTML += `
    <tr>

        <td>
            <strong>${p.nome}</strong>
        </td>

        <td>
            <span class="badge bg-dark">
                ${p.tipo}
            </span>
        </td>

        <td>
            R$ ${Number(p.preco).toFixed(2)}
        </td>

        <td>
            ${p.descricao || "-"}
        </td>

        <td>

            <button class="btn btn-sm btn-warning"
                onclick="editarProduto(
                    ${p.id},
                    '${p.nome}',
                    '${p.tipo}',
                    ${p.preco},
                    \`${p.descricao || ""}\`
                )">

                ✏️
            </button>

            <button class="btn btn-sm btn-danger"
                onclick="deletar(${p.id})">

                🗑
            </button>

        </td>

    </tr>
`;
    });
}

async function criarProduto() {
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const descricao = document.getElementById("descricao").value;

    if (!nome || !tipo || isNaN(preco)) {
        mostrarToast("Preencha todos os campos!");
        return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nome, tipo, preco, descricao })
    });

    if (res.ok) {
        mostrarToast("Produto criado!");
        document.getElementById("nome").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("descricao").value = "";
        carregarProdutos();
    } else {
        mostrarToast("Erro ao criar produto");
    }
}

function editarProduto(id, nomeAtual, tipoAtual, precoAtual, descricaoAtual) {
    // Preenche o formulário com os dados atuais
    document.getElementById("nome").value = nomeAtual;
    document.getElementById("tipo").value = tipoAtual;
    document.getElementById("preco").value = precoAtual;
    document.getElementById("descricao").value = descricaoAtual;

    // Troca o botão Cadastrar por Salvar
    const btn = document.getElementById("btnProduto");
    btn.textContent = "Salvar Alterações";
    btn.setAttribute("onclick", `salvarEdicao(${id})`);
}

async function salvarEdicao(id) {
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const descricao = document.getElementById("descricao").value;

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produto/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nome, tipo, preco, descricao })
    });

    if (res.ok) {
        mostrarToast("Produto atualizado!");

        // Volta o botão para Cadastrar
        const btn = document.querySelector(`button[onclick='salvarEdicao(${id})']`);
        btn.textContent = "Cadastrar";
        btn.setAttribute("onclick", "criarProduto()");

        document.getElementById("nome").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("descricao").value = "";

        carregarProdutos();
    } else {
        mostrarToast("Erro ao atualizar produto");
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
        mostrarToast("Produto removido!");
        carregarProdutos();
    } else {
       mostrarToast("Erro ao deletar");
    }
}

function mostrarToast(msg) {
    const toastEl = document.getElementById("toast");

    toastEl.querySelector(".toast-body").innerText = msg;

    new bootstrap.Toast(toastEl).show();
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Inicializar
verificarAdm();
carregarProdutos();