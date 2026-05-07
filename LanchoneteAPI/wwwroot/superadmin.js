async function carregarAdms() {

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/usuario/adms`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    const adms = data.dados || [];

    const div = document.getElementById("listaAdms");

    div.innerHTML = "";

    if (adms.length === 0) {

        div.innerHTML = `
            <div class="text-muted">

                Nenhum administrador encontrado.

            </div>
        `;

        return;
    }

    adms.forEach(a => {

        div.innerHTML += `
            <div class="admin-item">

                <div>

                    <strong>
                        ${a.email}
                    </strong>

                    <br>

                    <small class="text-muted">
                        Administrador do sistema
                    </small>

                </div>

                <button class="btn btn-sm btn-outline-danger"
                        onclick="removerAdm(${a.id})">

                    Remover

                </button>

            </div>
        `;
    });
}

async function criarAdm() {

    try {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Faça login novamente.");
            return;
        }

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!email || !senha) {
            alert("Preencha email e senha.");
            return;
        }

        const res = await fetch(`${api}/usuario/criar-adm`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                email,
                senha
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.mensagem || "Erro ao criar administrador.");
            return;
        }

        alert("Administrador criado com sucesso!");

        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";

        carregarAdms();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com API.");
    }
}