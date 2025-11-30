let quantidadePokemonsPagina = 20;
let limitePokemons = 100;
let percentualMaximo = 100;
let status = 255;
let metros = 10;
let quilogramas = 10;
let paginaInicial = 1;
let textoVazio = '';
let semFiltro = textoVazio;
let descricaoVazia = textoVazio;
let apiPokemon = 'https://pokeapi.co/api/v2/pokemon';
let apiTipo = 'https://pokeapi.co/api/v2/type';
let listaPokemonAPI = []; //a
let listaVazia = []; // b
let paginaAtual = 1; // c
let pokemonPorPagina = 20;
let filtroNome = textoVazio; // e
let filtroTipo = textoVazio;  // f1  

// i/iniciarPagina
async function iniciarPagina() {
    document.getElementById('loading').innerHTML = '';
    for(let loop = 0; loop < quantidadePokemonsPagina; loop++) {
        document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
    }
    
    try {
        let requisicao = await fetch(apiTipo);
        let requisicaoJson = await requisicao.json();
        let filtro = document.getElementById('typeFilter');
        if (!filtro) {
            console.warn('Elemento #typeFilter ausente');
            return;
        }
        for(let loop = 0; loop < requisicaoJson.results.length; loop++) {
            let option = document.createElement('option');
            option.value = requisicaoJson.results[loop].name;
            option.textContent = requisicaoJson.results[loop].name.charAt(0).toUpperCase() + requisicaoJson.results[loop].name.slice(1);
            filtro.appendChild(option);
        }
    } catch(erro) {
        console.log('Erro ao carregar tipos:', erro);
    }
    carregarListaPokemons();
}

// l/carregarListaPokemons
async function carregarListaPokemons() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';
    
    try {
        let pularElementos = (paginaAtual - 1) * pokemonPorPagina;
        let urlMontada = apiPokemon + '?limit=' + pokemonPorPagina + '&offset=' + pularElementos;
        let resposta = await fetch(urlMontada);
        let jsonResposta = await resposta.json();
        
        let requisicaoPokemon = [];
        for(let loop = 0; loop < jsonResposta.results.length; loop++) {
            requisicaoPokemon.push(fetch(jsonResposta.results[loop].url));
        }
        let listaRequisicao = await Promise.all(requisicaoPokemon);
        listaPokemonAPI = [];
        for(let loop = 0; loop < listaRequisicao.length; loop++) {
            let pokemon = await listaRequisicao[loop].json();
            listaPokemonAPI.push(pokemon);
        }
        
        listaVazia = [...listaPokemonAPI];
        UNIFOR();
    } catch(erro) {
        console.log('Erro ao carregar lista:', erro);
        alert('Erro ao carregar Pokémons!');
    }
}

// lbt/carregarFiltroTipo
async function carregarFiltroTipo() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        let urlMontada = apiTipo + '/' + filtroTipo;
        let resposta = await fetch(urlMontada);
        let jsonResposta = await resposta.json();
        let requisicaoPokemon = [];
        let limite = jsonResposta.pokemon.length > limitePokemons ? limitePokemons : jsonResposta.pokemon.length;
        for(let loop = 0; loop < limite; loop++) {
            requisicaoPokemon.push(fetch(jsonResposta.pokemon[loop].pokemon.url));
        }

        let listaRequisicao = await Promise.all(requisicaoPokemon);
        listaPokemonAPI = [];
        for(let loop = 0; loop < listaRequisicao.length; loop++) {
            let pokemon = await listaRequisicao[loop].json();
            listaPokemonAPI.push(pokemon);
        }

        listaVazia = [...listaPokemonAPI];
        UNIFOR();
    } catch(error) {
        console.log('erro ao carregar tipo', error);
        alert('Erro ao carregar Pokémons do tipo!');
    }
}

function UNIFOR() {
    let matrispokemon = document.getElementById('pokemonGrid');
    matrispokemon.innerHTML = '';

    let listapokemon = listaVazia;
    if(filtroNome !== textoVazio) { 
        listapokemon = listapokemon.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(filtroNome.toLowerCase()) ||
                   pokemon.id.toString().includes(filtroNome);
        });
    }

    for(let loop = 0; loop < listapokemon.length; loop++) {
        let pokemon = listapokemon[loop];
        let forDivPokemonn = document.createElement('div');
        forDivPokemonn.className = 'col-md-3';
        
        let html = '<div class="c" onclick="DetalhesPokemon(' + pokemon.id + ')">';
        html = html + '<img src="' + pokemon.sprites.front_default + '" class="i" alt="' + pokemon.name + '">';
        html = html + '<h5 class="text-center">#' + pokemon.id + ' ' + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + '</h5>';
        html = html + '<div class="text-center">';
        
        for(let loop2 = 0; loop2 < pokemon.types.length; loop2++) {
            let typeName = pokemon.types[loop2].type.name;
            html = html + '<span class="badge type-' + typeName + '">' + typeName + '</span> ';
        }
        
        html = html + '</div></div>';
        forDivPokemonn.innerHTML = html;
        matrispokemon.appendChild(forDivPokemonn);
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    if(filtroTipo !== textoVazio) {
        document.getElementById('pageInfo').textContent = 'Mostrando ' + listapokemon.length + ' pokémons';
    } else {
        document.getElementById('pageInfo').textContent = 'Página ' + paginaAtual;
    }

    document.getElementById('prevBtn').disabled = paginaAtual === paginaInicial || filtroTipo !== textoVazio; 
    document.getElementById('nextBtn').disabled = filtroTipo !== textoVazio;
}

// f/adicionarFiltros
async function adicionarFiltros() {
    filtroNome = document.getElementById('s').value;
    filtroTipo = document.getElementById('typeFilter').value;

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if (filtroTipo !== textoVazio) {
        return carregarFiltroTipo();
    }
    return UNIFOR();
}

// r/apagarFiltros
function apagarFiltros() {
    document.getElementById('s').value = textoVazio;
    document.getElementById('typeFilter').value = textoVazio;
    filtroNome = textoVazio;
    filtroTipo = textoVazio;
    paginaAtual = paginaInicial;
    carregarListaPokemons();
}

// p1/voltarPagina
function voltarPagina() {
    if (paginaAtual <= paginaInicial) {
        return;
    }
    paginaAtual--;
    if (filtroTipo !== textoVazio) {
        return UNIFOR();
    }
    return carregarListaPokemons();
}

// p2/pularPagina
function pularPagina() {
    paginaAtual++;
    if (filtroTipo !== textoVazio) {
        return UNIFOR();
    }
    return carregarListaPokemons();
}

// x/mudarTema
function mudarTema() {
    document.body.classList.toggle('dark');
}

// showDetails/detalhesPokemon
async function DetalhesPokemon(id) {
    try {
        let resposta = await fetch(apiPokemon + '/' + id);
        let jsonResposta = await resposta.json();
        let respostaEspecie = await fetch(jsonResposta.species.url);
        let jsonEspecie = await respostaEspecie.json();
        let descricao = descricaoVazia;
        for(let loop = 0; loop < jsonEspecie.flavor_text_entries.length; loop++) {
            if(jsonEspecie.flavor_text_entries[loop].language.name === 'en') {
                descricao = jsonEspecie.flavor_text_entries[loop].flavor_text;
                break;
            }
        }
        
        document.getElementById('modalTitle').textContent = '#' + jsonResposta.id + ' ' + jsonResposta.name.charAt(0).toUpperCase() + jsonResposta.name.slice(1);
        
        let html = '<div class="row"><div class="col-md-6">';
        html += '<div class="sprite-container">';
        html += '<div><img src="' + jsonResposta.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        html += '<div><img src="' + jsonResposta.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        html += '</div>';
        
        html += '<p><strong>Tipo:</strong> ';
        for(let loop = 0; loop < jsonResposta.types.length; loop++) {
            html += '<span class="badge type-' + jsonResposta.types[loop].type.name + '">' + jsonResposta.types[loop].type.name + '</span> ';
        }
        html += '</p>';
        html += '<p><strong>Altura:</strong> ' + (jsonResposta.height / metros) + ' m</p>';
        html += '<p><strong>Peso:</strong> ' + (jsonResposta.weight / quilogramas) + ' kg</p>';
        html += '<p><strong>Habilidades:</strong> ';
        for(let loop = 0; loop < jsonResposta.abilities.length; loop++) {
            html += jsonResposta.abilities[loop].ability.name;
            if(loop < jsonResposta.abilities.length - 1) html += ', ';
        }
        html += '</p>';
        html += '</div><div class="col-md-6">';
        html += '<p><strong>Descrição:</strong></p>';
        html += '<p>' + descricao.replace(/\f/g, ' ') + '</p>';
        html += '<h6>Estatísticas:</h6>';
        for(let loop = 0; loop < jsonResposta.stats.length; loop++) {
            let statusPokemon = jsonResposta.stats[loop];
            let percentage = Math.max(0, Math.min(percentualMaximo, (statusPokemon.base_stat / status) * percentualMaximo));
            html += '<div><small>' + statusPokemon.stat.name + ': ' + statusPokemon.base_stat + '</small>';
            html += '<div class="stat-bar"><div class="stat-fill" style="width: ' + percentage + '%"></div></div></div>';
        }
        
        html += '</div></div>';
        
        document.getElementById('modalBody').innerHTML = html;
        
        let mod = new bootstrap.Modal(document.getElementById('m'));
        mod.show();
        
    } catch(error) {
        console.log('erro');
        alert('Erro ao carregar detalhes!');
    }
}

window.onload = function() {
    iniciarPagina();
};
