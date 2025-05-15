// 🌟 Seleção dos elementos principais
const galeria = document.getElementById("galeria");
const filtros = document.querySelectorAll(".filtro");
const mensagemVazio = document.getElementById("mensagem-vazio");

// 🗂️ Armazena os dados do JSON
let dadosFotos = [];

// 📌 Cria um card de imagem
function criarCard(foto) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <img src="${foto.imagem}" alt="${foto.titulo}" loading="lazy" />
    <div class="info">
      <span class="tag">${foto.categoria}</span>
      <h3 class="titulo">${foto.titulo}</h3>
      <p class="descricao">${foto.descricao}</p>
    </div>
  `;

  galeria.appendChild(card);
}

// 🌙 Lightbox funcional
const lightbox = document.getElementById("lightbox");
const imagemAmpliada = document.getElementById("imagem-ampliada");
const tituloLightbox = document.getElementById("titulo-lightbox");
const descricaoLightbox = document.getElementById("descricao-lightbox");
const fecharLightbox = document.getElementById("fechar-lightbox");

function adicionarEventosLightbox() {
  const imagens = document.querySelectorAll(".card img");

  imagens.forEach((img) => {
    img.addEventListener("click", () => {
      const card = img.closest(".card");
      const titulo = card.querySelector(".titulo").textContent;
      const descricao = card.querySelector(".descricao").textContent;
      const src = img.getAttribute("src");
      const alt = img.getAttribute("alt");

      imagemAmpliada.src = src;
      imagemAmpliada.alt = alt;
      tituloLightbox.textContent = titulo;
      descricaoLightbox.textContent = descricao;

      lightbox.classList.remove("escondido");
    });
  });
}

// Botão fechar
fecharLightbox.addEventListener("click", () => {
  lightbox.classList.add("escondido");
});

// Tecla ESC para fechar
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.classList.add("escondido");
  }
});

// 🖼️ Exibe os cards filtrados na galeria
function renderizarGaleria(categoria = "todas") {
  galeria.innerHTML = "";
  mensagemVazio.classList.add("escondido");

  const categoriaNormalizada = categoria.toLowerCase();

  const fotosFiltradas =
    categoriaNormalizada === "todas"
      ? dadosFotos
      : dadosFotos.filter(
          (foto) => foto.categoria.toLowerCase() === categoriaNormalizada
        );

  if (fotosFiltradas.length === 0) {
    mensagemVazio.classList.remove("escondido");
    return;
  }

  fotosFiltradas.forEach(criarCard);
  adicionarEventosLightbox(); // ✅ Chama o lightbox após renderizar os cards
}

// 🎯 Adiciona evento de clique nos botões de filtro
filtros.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtros.forEach((f) => f.classList.remove("ativo"));
    botao.classList.add("ativo");

    const categoria = botao.dataset.categoria;
    renderizarGaleria(categoria);
  });
});

// 📦 Busca os dados do arquivo fotos.json ao carregar
fetch("data/fotos.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then((dados) => {
    dadosFotos = dados;
    renderizarGaleria(); // Exibe todas as imagens inicialmente
  })
  .catch((error) => {
    console.error("Erro ao carregar o JSON:", error);
    mensagemVazio.classList.remove("escondido");
    mensagemVazio.querySelector("p").textContent = "Erro ao carregar imagens.";
  });
