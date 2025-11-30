var listaPokemonAPI = []; //a
var listaVazia = []; // b
var paginaAtual = 1; // c
var pokemonPorPagina = 20; //d 
var filtroNome = ''; // e
var filtroTipo = '';  // f1

const API = 'https://pokeapi.co/api/v2/pokemon';
const API2 = 'https://pokeapi.co/api/v2/type';

// i/iniciarPagina
async function iniciarPagina() {
    document.getElementById('loading').innerHTML = '';
    for(var loop = 0; loop < 20; loop++) {
        document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
    }
    
    try {
        var requisicao = await fetch(API2);
        var requisicaoJson = await requisicao.json();
        var filtro = document.getElementById('typeFilter');
        for(var loop = 0; loop < requisicaoJson.results.length; loop++) {
            var option = document.createElement('option');
            option.value = requisicaoJson.results[loop].name;
            option.textContent = requisicaoJson.results[loop].name.charAt(0).toUpperCase() + requisicaoJson.results[loop].name.slice(1);
            filtro.appendChild(option);
        }
    } catch(erro) {
        console.log('erro');
    }
    
    carregarListaPokemons();
}

// l/carregarListaPokemons
async function carregarListaPokemons() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';
    
    try {
        var pularElementos = (paginaAtual - 1) * pokemonPorPagina;
        var urlMontada = API + '?limit=' + pokemonPorPagina + '&offset=' + pularElementos;
        var resposta = await fetch(urlMontada);
        var jsonResposta = await resposta.json();
        
        var requisicaoPokemon = [];
        for(var loop = 0; loop < jsonResposta.results.length; loop++) {
            requisicaoPokemon.push(fetch(jsonResposta.results[loop].url));
        }
        
        var listaRequisicao = await Promise.all(requisicaoPokemon);
        listaPokemonAPI = [];
        for(var loop = 0; loop < listaRequisicao.length; loop++) {
            var pokemon = await listaRequisicao[loop].json();
            listaPokemonAPI.push(pokemon);
        }
        
        listaVazia = [...listaPokemonAPI];
        UNIFOR();
    } catch(erro) {
        console.log('erro ao carregar');
        alert('Erro ao carregar Pokémons!');
    }
}

// lbt/carregarFiltroTipo
async function carregarFiltroTipo() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        var urlMontada = API2 + '/' + filtroTipo;
        var resposta = await fetch(urlMontada);
        var jsonResposta = await resposta.json();

        var requisicaoPokemon = [];
        var li = jsonResposta.pokemon.length > 100 ? 100 : jsonResposta.pokemon.length; // Limita a 100
        for(var loop = 0; loop < li; loop++) {
            requisicaoPokemon.push(fetch(jsonResposta.pokemon[loop].pokemon.url));
        }

        var listaRequisicao = await Promise.all(requisicaoPokemon);
        listaPokemonAPI = [];
        for(var loop = 0; loop < listaRequisicao.length; loop++) {
            var pokemon = await listaRequisicao[loop].json();
            listaPokemonAPI.push(pokemon);
        }

        listaVazia = [...listaPokemonAPI];
        UNIFOR();
    } catch(error) {
        console.log('erro ao carregar tipo');
        alert('Erro ao carregar Pokémons do tipo!');
    }
}

function UNIFOR() {

    var grid = document.getElementById('pokemonGrid');
    grid.innerHTML = '';

    var lista = listaVazia;

    // ---- FILTRO POR NOME OU ID ----
    if (filtroNome !== '') {
        var termo = filtroNome.toLowerCase();
        lista = lista.filter(function(pokemon) {
            return pokemon.name.toLowerCase().includes(termo) ||
                   pokemon.id.toString().includes(filtroNome);
        });
    }

    // ---- RENDERIZAÇÃO DOS CARDS ----
    for (var i = 0; i < lista.length; i++) {
        var pokemon = lista[i];

        var coluna = document.createElement('div');
        coluna.className = 'col-md-3';

        var htmlCard = '<div class="c" onclick="DetalhesPokemon(' + pokemon.id + ')">';

        // imagem do pokemon
        htmlCard += '<img src="' + pokemon.sprites.front_default + '" class="i" alt="' + pokemon.name + '">';

        // título
        htmlCard += '<h5 class="text-center">#' + pokemon.id + ' ' +
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) +
            '</h5>';

        // tipos
        htmlCard += '<div class="text-center">';
        for (var t = 0; t < pokemon.types.length; t++) {
            var tipo = pokemon.types[t].type.name;
            htmlCard += '<span class="badge type-' + tipo + '">' + tipo + '</span> ';
        }
        htmlCard += '</div>';

        htmlCard += '</div>'; // fim card

        coluna.innerHTML = htmlCard;
        grid.appendChild(coluna);
    }

    // ---- MOSTRA/ESCONDE ELEMENTOS ----
    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    // ---- INFORMAÇÃO DE PÁGINA ----
    var pageInfo = document.getElementById('pageInfo');

    if (filtroTipo !== '') {
        pageInfo.textContent = 'Mostrando ' + lista.length + ' pokémons';
    } else {
        pageInfo.textContent = 'Página ' + paginaAtual;
    }

    // ---- BOTÕES DE PAGINAÇÃO ----
    document.getElementById('prevBtn').disabled = paginaAtual === 1 || filtroTipo !== '';
    document.getElementById('nextBtn').disabled = filtroTipo !== '';
}


// f/adicionarFiltros
async function adicionarFiltros() {
    filtroNome = document.getElementById('s').value;
    filtroTipo = document.getElementById('typeFilter').value;

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if(filtroTipo !== '') {
        await carregarFiltroTipo();
    } else {
        UNIFOR();
    }
}

// r/apagarFiltros
function apagarFiltros() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    filtroNome = '';
    filtroTipo = '';
    paginaAtual = 1;
    carregarListaPokemons();
}

// p1/voltarPagina
function voltarPagina() {
    if(paginaAtual > 1) {
        paginaAtual--;
        if(filtroTipo !== '') {
            UNIFOR();
        } else {
            carregarListaPokemons();
        }
    }
}

// p2/pularPagina
function pularPagina() {
    paginaAtual++;
    if(filtroTipo !== '') {
        UNIFOR();
    } else {
        carregarListaPokemons();
    }
}

// x/mudarTema
function mudarTema() {
    document.body.classList.toggle('dark');
}

// showDetails / DetalhesPokemon
async function DetalhesPokemon(id) {
    try {
        // --- BUSCA PRINCIPAL ---
        var respostaPokemon = await fetch(API + '/' + id);
        var pokemonJson = await respostaPokemon.json();

        // --- BUSCA DA ESPÉCIE (PARA PEGAR DESCRIÇÃO) ---
        var respostaSpecies = await fetch(pokemonJson.species.url);
        var speciesJson = await respostaSpecies.json();

        // --- DESCRIÇÃO EM INGLÊS ---
        var descricao = '';
        for (var i = 0; i < speciesJson.flavor_text_entries.length; i++) {
            var entry = speciesJson.flavor_text_entries[i];
            if (entry.language.name === 'en') {
                descricao = entry.flavor_text;
                break;
            }
        }

        // --- TÍTULO DO MODAL ---
        document.getElementById('modalTitle').textContent =
            '#' + pokemonJson.id + ' ' +
            pokemonJson.name.charAt(0).toUpperCase() +
            pokemonJson.name.slice(1);

        // --- MONTA HTML DO MODAL ---
        var html = '<div class="row">';

        // -------------------------------------------------
        // COLUNA ESQUERDA: SPRITES, TIPOS, ALTURA, PESO, HABILIDADES
        // -------------------------------------------------
        html += '<div class="col-md-6">';

        // Sprites
        html += '<div class="sprite-container">';
        html += '<div><img src="' + pokemonJson.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        html += '<div><img src="' + pokemonJson.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        html += '</div>';

        // Tipos
        html += '<p><strong>Tipo:</strong> ';
        for (var t = 0; t < pokemonJson.types.length; t++) {
            var tipo = pokemonJson.types[t].type.name;
            html += '<span class="badge type-' + tipo + '">' + tipo + '</span> ';
        }
        html += '</p>';

        // Altura e peso
        html += '<p><strong>Altura:</strong> ' + (pokemonJson.height / 10) + ' m</p>';
        html += '<p><strong>Peso:</strong> ' + (pokemonJson.weight / 10) + ' kg</p>';

        // Habilidades
        html += '<p><strong>Habilidades:</strong> ';
        for (var h = 0; h < pokemonJson.abilities.length; h++) {
            html += pokemonJson.abilities[h].ability.name;
            if (h < pokemonJson.abilities.length - 1) {
                html += ', ';
            }
        }
        html += '</p>';

        html += '</div>'; // fim coluna esquerda

        // -------------------------------------------------
        // COLUNA DIREITA: DESCRIÇÃO + STATS
        // -------------------------------------------------
        html += '<div class="col-md-6">';

        // Descrição
        html += '<p><strong>Descrição:</strong></p>';
        html += '<p>' + descricao.replace(/\f/g, ' ') + '</p>';

        // Stats
        html += '<h6>Estatísticas:</h6>';
        for (var s = 0; s < pokemonJson.stats.length; s++) {
            var stat = pokemonJson.stats[s];
            var porcentagem = (stat.base_stat / 255) * 100;

            html += '<div><small>' + stat.stat.name + ': ' + stat.base_stat + '</small>';
            html += '<div class="stat-bar">';
            html += '<div class="stat-fill" style="width: ' + porcentagem + '%"></div>';
            html += '</div></div>';
        }

        html += '</div>'; // fim coluna direita
        html += '</div>'; // fim row

        // --- APLICA HTML NO MODAL ---
        document.getElementById('modalBody').innerHTML = html;

        // --- ABRE MODAL ---
        var modal = new bootstrap.Modal(document.getElementById('m'));
        modal.show();

    } catch (error) {
        console.log('erro ao carregar detalhes:', error);
        alert('Erro ao carregar detalhes!');
    }
}


window.onload = function() {
    iniciarPagina();
};