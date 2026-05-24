// Aguarda o documento HTML carregar completamente antes de rodar o script
document.addEventListener("DOMContentLoaded", () => {
    const feed = document.getElementById('feed');

    // 1. Função para buscar os dados do arquivo JSON externo
    async function inicializarApp() {
        try {
            const resposta = await fetch('receitas.json');
            if (!resposta.ok) {
                throw new Error('Não foi possível carregar o arquivo de receitas.');
            }
            const receitas = await resposta.json();
            renderizarFeed(receitas);
        } catch (erro) {
            console.error('Erro:', erro);
            feed.innerHTML = `
                <div class="flex items-center justify-center h-full p-6 text-center">
                    <p class="text-red-400">Ops! Erro ao carregar as receitas. Certifique-se de usar um servidor local.</p>
                </div>
            `;
        }
    }

    // 2. Função para injetar o HTML das receitas no feed
    function renderizarFeed(listaDeReceitas) {
        feed.innerHTML = listaDeReceitas.map(receita => {
            const jaCurtido = localStorage.getItem(`curtido-${receita.id}`) === 'true';
            const corCoracao = jaCurtido ? 'text-red-500' : 'text-white';

            return `
                <section class="recipe-card relative w-full flex flex-col justify-end p-6 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent border-b border-gray-800">
                    <img class = "imagem" src="${receita.imagem}"> 
                    <!-- Conteúdo Textual da Receita -->
                    <div class="mb-16 pr-14">
                        <span class="bg-amber-500 text-xs font-bold px-2.5 py-1 rounded-full text-black uppercase tracking-wider">${receita.tempo}</span>
                        <h2 class="text-2xl font-black mt-3 mb-4 tracking-tight leading-tight">${receita.titulo}</h2>
                        
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ingredientes</h3>
                        <ul class="text-sm space-y-1 text-gray-200 mb-4 list-disc pl-4">
                            ${receita.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>

                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Modo de Preparo</h3>
                        <p class="text-sm text-gray-300 leading-relaxed font-light">${receita.preparo}</p>
                    </div>

                    <!-- Menu de Interação Lateral -->
                    <div class="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                        <button data-id="${receita.id}" class="btn-curtir focus:outline-none transform active:scale-125 transition-transform duration-100 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 ${corCoracao} transition-colors duration-200">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>
                        <span class="text-xs text-gray-400">Salvar</span>
                    </div>

                </section>
            `;
        }).join('');

        // Configura os ouvintes de clique para os botões de curtir gerados dinamicamente
        configurarBotoesCurtir();
    }

    // 3. Função para gerenciar os cliques no botão de curtir (LocalStorage)
    function configurarBotoesCurtir() {
        const botoes = document.querySelectorAll('.btn-curtir');
        
        botoes.forEach(botao => {
            botao.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const svg = this.querySelector('svg');
                const chave = `curtido-${id}`;
                const statusAtual = localStorage.getItem(chave) === 'true';

                if (statusAtual) {
                    localStorage.setItem(chave, 'false');
                    svg.classList.remove('text-red-500');
                    svg.classList.add('text-white');
                } else {
                    localStorage.setItem(chave, 'true');
                    svg.classList.remove('text-white');
                    svg.classList.add('text-red-500');
                }
            });
        });
    }

    // Executa a inicialização do app
    inicializarApp();
});