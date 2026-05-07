const api = "https://localhost:7200/api";

async function carregarPedidos() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const res = await fetch(`${api}/pedido`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            alert("Erro ao carregar pedidos");
            return;
        }

        const response = await res.json();
        const pedidos = response.dados || [];

        const div = document.getElementById("pedidos");

        div.innerHTML = "";

        if (pedidos.length === 0) {

            div.innerHTML = `
                <div class="col-12">

                    <div class="alert alert-warning text-center p-4 rounded-4">

                        Nenhum pedido encontrado

                    </div>

                </div>
            `;

            return;
        }

        pedidos.forEach(p => {

            let itensHTML = "";

            p.itens.forEach(i => {

                itensHTML += `
                    <div class="item d-flex justify-content-between">

                        <div>
                            <strong>${i.produto.nome}</strong>
                            <br>
                            <small class="text-muted">
                                Quantidade: ${i.quantidade}
                            </small>
                        </div>

                        <div>
                            R$ ${(i.produto.preco * i.quantidade).toFixed(2)}
                        </div>

                    </div>
                `;
            });

            div.innerHTML += `
                <div class="col-lg-6">

                    <div class="card pedido-card p-4">

                        <div class="pedido-header mb-3">

                            <h4>
                                Pedido #${p.id}
                            </h4>

                            <span class="badge-status">
                                Finalizado
                            </span>

                        </div>

                        ${itensHTML}

                        <div class="d-flex justify-content-between align-items-center mt-4">

                            <span class="text-muted">
                                ${new Date().toLocaleDateString()}
                            </span>

                            <div class="total">
                                R$ ${Number(p.total).toFixed(2)}
                            </div>

                        </div>

                    </div>

                </div>
            `;
        });

    } catch (erro) {

        console.error(erro);

    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

carregarPedidos();