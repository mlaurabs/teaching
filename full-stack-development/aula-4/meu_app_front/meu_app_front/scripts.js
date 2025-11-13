/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor));
    })
    .catch((error) => console.error('Error:', error));
};

getList();

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  const table = document.getElementById('myTable');
  const row = table.insertRow();

  row.insertCell(0).textContent = nameProduct;
  row.insertCell(1).textContent = quantity;
  row.insertCell(2).textContent = price;

  // Botão editar
  const editCell = row.insertCell(3);
  const editBtn = document.createElement("button");
  editBtn.textContent = "Editar";
  editBtn.onclick = () => editItem(row);
  editCell.appendChild(editBtn);

  // Botão remover
  const delCell = row.insertCell(4);
  const delBtn = document.createElement("span");
  delBtn.className = "close";
  delBtn.textContent = "×";
  delBtn.onclick = () => removeItem(row);
  delCell.appendChild(delBtn);
};

/*
  --------------------------------------------------------------------------------------
  Editar item (abre prompt simples)
  --------------------------------------------------------------------------------------
*/
function editItem(row) {
  const nomeAtual = row.cells[0].textContent;

  const novoNome = prompt("Novo nome:", nomeAtual);
  const novaQuantidade = prompt("Nova quantidade:", row.cells[1].textContent);
  const novoValor = prompt("Novo valor:", row.cells[2].textContent);

  atualizarProduto(nomeAtual, novoNome, novaQuantidade, novoValor);
}

/*
  --------------------------------------------------------------------------------------
  PUT — Atualizar produto
  --------------------------------------------------------------------------------------
*/
async function atualizarProduto(nome, novoNome, quantidade, valor) {
  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("novo_nome", novoNome);
  formData.append("quantidade", quantidade);
  formData.append("valor", valor);

  try {
    const resposta = await fetch("http://127.0.0.1:5000/produto", {
      method: "PUT",
      body: formData
    });

    const json = await resposta.json();
    console.log(json);

    if (!resposta.ok) {
      alert(json.message || "Erro ao atualizar");
      return;
    }

    alert("Produto atualizado!");
    location.reload();

  } catch (err) {
    console.error(err);
    alert("Falha ao atualizar produto");
  }
}

/*
  --------------------------------------------------------------------------------------
  Remover item
  --------------------------------------------------------------------------------------
*/
function removeItem(row) {
  const nome = row.cells[0].textContent;

  if (!confirm("Deseja remover?")) return;

  fetch("http://127.0.0.1:5000/produto?nome=" + nome, { method: "DELETE" })
    .then(() => {
      alert("Removido!");
      row.remove();
    });
}

/*
  --------------------------------------------------------------------------------------
  Novo item
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  const name = document.getElementById("newInput").value;
  const quantity = document.getElementById("newQuantity").value;
  const price = document.getElementById("newPrice").value;

  const formData = new FormData();
  formData.append("nome", name);
  formData.append("quantidade", quantity);
  formData.append("valor", price);

  fetch("http://127.0.0.1:5000/produto", {
    method: "POST",
    body: formData
  })
    .then((response) => response.json())
    .then(() => {
      insertList(name, quantity, price);
      alert("Item adicionado!");
    });
};
