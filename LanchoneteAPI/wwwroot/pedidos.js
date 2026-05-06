const api = "https://localhost:7200/api";

async function carregarPedidos() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/pedido`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const response = await res.json();
    const pedidos = response.dados;

    const div = document.getElementById("pedidos");
    div.innerHTML = "";

    pedidos.forEach(p => {
        let html = `<div class="card p-3 mb-3">
            <h5>Pedido #${p.id}</h5>
            <ul>`;

        p.itens.forEach(i => {
            html += `<li>${i.produto.nome} - Qtd: ${i.quantidade}</li>`;
        });

        html += `</ul>
            <strong>Total: R$ ${p.total}</strong>
        </div>`;

        div.innerHTML += html;
    });
}

carregarPedidos();