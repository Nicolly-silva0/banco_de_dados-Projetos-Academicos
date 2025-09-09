const urlBase = "http://localhost:3000/tarefas";

// Função para carregar tarefas do backend
async function carregarTarefas() {
  try {
    const resposta = await fetch(urlBase);
    const tarefas = await resposta.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // limpa lista atual

    tarefas.forEach(tarefa => {
      criarElementoTarefa(tarefa.texto, tarefa.completa);
    });
  } catch (erro) {
    console.error("Erro ao carregar tarefas:", erro);
  }
}

// Função para criar o elemento da tarefa na lista
function criarElementoTarefa(texto, completa = false) {
  const lista = document.getElementById("lista");

  const li = document.createElement("li");
  li.textContent = texto;

  if (completa) {
    li.classList.add("completed");
  }

  li.addEventListener("click", async () => {
    li.classList.toggle("completed");
    await atualizarTarefaNoServidor();
  });

  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "Excluir";
  btnExcluir.onclick = async () => {
    lista.removeChild(li);
    await atualizarTarefaNoServidor();
  };

  li.appendChild(btnExcluir);
  lista.appendChild(li);
}

// Função para atualizar todas as tarefas no backend
async function atualizarTarefaNoServidor() {
  const lista = document.getElementById("lista");
  const tarefas = [];

  lista.querySelectorAll("li").forEach(li => {
    tarefas.push({
      texto: li.firstChild.textContent.trim(), // <-- Aqui está o segredo!
      completa: li.classList.contains("completed")
    });
  });

  try {
    await fetch("http://localhost:3000/tarefas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarefas)
    });
  } catch (erro) {
    console.error("Erro ao salvar tarefas:", erro);
  }
}


function adicionarTarefa() {
  const input = document.getElementById("novaTarefa");
  const texto = input.value.trim();

  if (texto === "") return;

  criarElementoTarefa(texto);
  atualizarTarefaNoServidor();

  input.value = "";
}

window.onload = carregarTarefas;
