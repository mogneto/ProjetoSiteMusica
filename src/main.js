document.addEventListener('DOMContentLoaded', () => {

  // 1. Controle global de áudios (Página Index)
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach(audio => {
    audio.addEventListener('play', () => {
      audioElements.forEach(otherAudio => {
        if (otherAudio !== audio) {
          otherAudio.pause();
        }
      });
    });
  });

  // 2. Sistema Dinâmico do Livro de Visitas (Página Recados)
  const recadoForm = document.querySelector('.recado-form');
  if (recadoForm) {
    const inputs = recadoForm.querySelectorAll('.retro-input-field');
    const nomeInput = inputs[0];
    const cidadeInput = inputs[1];
    const mensagemInput = recadoForm.querySelector('textarea');
    const enviarBtn = recadoForm.querySelector('.retro-btn');
    const recadosList = document.querySelector('.recados-list');

    const recadosSalvos = JSON.parse(localStorage.getItem('mogneto_recados') || '[]');
    recadosSalvos.forEach(recado => {
      adicionarRecadoNaTela(recado.nome, recado.mensagem, recado.data, false);
    });

    enviarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nome = nomeInput.value.trim();
      const cidade = cidadeInput.value.trim();
      const mensagem = mensagemInput.value.trim();

      if (!nome || !mensagem) {
        alert('Por favor, preencha pelo menos seu nome e a mensagem!');
        return;
      }

      const agora = new Date();
      const dia = String(agora.getDate()).padStart(2, '0');
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const ano = agora.getFullYear();
      const hora = String(agora.getHours()).padStart(2, '0');
      const min = String(agora.getMinutes()).padStart(2, '0');
      const dataFormatada = `${dia}/${mes}/${ano} - ${hora}:${min}`;

      const autorFinal = cidade ? `${nome} (${cidade})` : nome;

      const novoRecado = {
        nome: autorFinal,
        mensagem: mensagem,
        data: dataFormatada
      };

      recadosSalvos.unshift(novoRecado);
      localStorage.setItem('mogneto_recados', JSON.stringify(recadosSalvos));

      adicionarRecadoNaTela(novoRecado.nome, novoRecado.mensagem, novoRecado.data, true);

      nomeInput.value = '';
      cidadeInput.value = '';
      mensagemInput.value = '';
      
      alert('Recado enviado com sucesso para o mural de Mogneto!');
    });

    function adicionarRecadoNaTela(autor, texto, data, prepend = false) {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'recado-item';
      itemDiv.style.opacity = '0';
      itemDiv.style.transition = 'opacity 0.4s ease-in';

      const authorDiv = document.createElement('div');
      authorDiv.className = 'recado-author';
      
      const spanAutor = document.createElement('span');
      spanAutor.textContent = autor;
      
      const spanData = document.createElement('span');
      spanData.className = 'recado-date';
      spanData.textContent = data;

      authorDiv.appendChild(spanAutor);
      authorDiv.appendChild(spanData);

      const textDiv = document.createElement('div');
      textDiv.className = 'recado-text';
      textDiv.textContent = texto;

      itemDiv.appendChild(authorDiv);
      itemDiv.appendChild(textDiv);

      if (prepend && recadosList.firstChild) {
        recadosList.insertBefore(itemDiv, recadosList.firstChild);
      } else {
        recadosList.appendChild(itemDiv);
      }

      setTimeout(() => { itemDiv.style.opacity = '1'; }, 50);
    }
  }

  // 3. Filtro em Tempo Real (Página de Vídeos / Catálogo)
  const searchInput = document.getElementById('search-input');
  const genreFilter = document.getElementById('genre-filter');
  const catalogGrid = document.getElementById('catalog-grid');

  if (searchInput && catalogGrid) {
    const cards = catalogGrid.querySelectorAll('.catalog-card');

    function filtrarCatalogo() {
      const termo = searchInput.value.toLowerCase();
      const filtroGenero = genreFilter ? genreFilter.value : 'todos';

      cards.forEach(card => {
        const titulo = card.querySelector('.card-title').textContent.toLowerCase();
        const artista = card.querySelector('.card-artist').textContent.toLowerCase();
        const generoCard = card.getAttribute('data-genre') || 'all';

        const matchTexto = titulo.includes(termo) || artista.includes(termo);
        const matchGenero = filtroGenero === 'todos' || generoCard === filtroGenero;

        if (matchTexto && matchGenero) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    searchInput.addEventListener('input', filtrarCatalogo);
    if (genreFilter) {
      genreFilter.addEventListener('change', filtrarCatalogo);
    }
  }

});