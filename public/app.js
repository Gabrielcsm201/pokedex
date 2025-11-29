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
    var matrispokemon = document.getElementById('pokemonGrid');
    matrispokemon.innerHTML = '';

    var listapokemon = listaVazia;
    if(filtroNome !== '') {
        listapokemon = listapokemon.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(filtroNome.toLowerCase()) ||
                   pokemon.id.toString().includes(filtroNome);
        });
    }

    for(var loop = 0; loop < listapokemon.length; loop++) {
        var pokemon = listapokemon[loop];
        var forDivPokemonn = document.createElement('div');
        forDivPokemonn.className = 'col-md-3';
        
        var html = '<div class="c" onclick="DetalhesPokemon(' + pokemon.id + ')">';
        html = html + '<img src="' + pokemon.sprites.front_default + '" class="i" alt="' + pokemon.name + '">';
        html = html + '<h5 class="text-center">#' + pokemon.id + ' ' + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + '</h5>';
        html = html + '<div class="text-center">';
        
        for(var loop2 = 0; loop2 < pokemon.types.length; loop2++) {
            var typeName = pokemon.types[loop2].type.name;
            html = html + '<span class="badge type-' + typeName + '">' + typeName + '</span> ';
        }
        
        html = html + '</div></div>';
        forDivPokemonn.innerHTML = html;
        matrispokemon.appendChild(forDivPokemonn);
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    if(filtroTipo !== '') {
        document.getElementById('pageInfo').textContent = 'Mostrando ' + listapokemon.length + ' pokémons';
    } else {
        document.getElementById('pageInfo').textContent = 'Página ' + paginaAtual;
    }

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

// showDetails/detalhesPokemon
async function DetalhesPokemon(id) {
    try {
        var resposta = await fetch(API + '/' + id);
        var jsonResposta = await resposta.json();
        
        var respostaEspecie = await fetch(jsonResposta.species.url);
        var jsonEspecie = await respostaEspecie.json();
        
        var descricao = '';
        for(var loop = 0; loop < jsonEspecie.flavor_text_entries.length; loop++) {
            if(jsonEspecie.flavor_text_entries[loop].language.name === 'en') {
                descricao = jsonEspecie.flavor_text_entries[loop].flavor_text;
                break;
            }
        }
        
        document.getElementById('modalTitle').textContent = '#' + jsonResposta.id + ' ' + jsonResposta.name.charAt(0).toUpperCase() + jsonResposta.name.slice(1);
        
        var html = '<div class="row"><div class="col-md-6">';
        html += '<div class="sprite-container">';
        html += '<div><img src="' + jsonResposta.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        html += '<div><img src="' + jsonResposta.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        html += '</div>';
        
        html += '<p><strong>Tipo:</strong> ';
        for(var loop = 0; loop < jsonResposta.types.length; loop++) {
            html += '<span class="badge type-' + jsonResposta.types[loop].type.name + '">' + jsonResposta.types[loop].type.name + '</span> ';
        }
        html += '</p>';
        
        html += '<p><strong>Altura:</strong> ' + (jsonResposta.height / 10) + ' m</p>';
        html += '<p><strong>Peso:</strong> ' + (jsonResposta.weight / 10) + ' kg</p>';
        
        html += '<p><strong>Habilidades:</strong> ';
        for(var loop = 0; loop < jsonResposta.abilities.length; loop++) {
            html += jsonResposta.abilities[loop].ability.name;
            if(loop < jsonResposta.abilities.length - 1) html += ', ';
        }
        html += '</p>';
        
        html += '</div><div class="col-md-6">';
        
        html += '<p><strong>Descrição:</strong></p>';
        html += '<p>' + descricao.replace(/\f/g, ' ') + '</p>';
        
        html += '<h6>Estatísticas:</h6>';
        for(var loop = 0; loop < jsonResposta.stats.length; loop++) {
            var statusPokemon = jsonResposta.stats[loop];
            var percentage = (statusPokemon.base_stat / 255) * 100;
            html += '<div><small>' + statusPokemon.stat.name + ': ' + statusPokemon.base_stat + '</small>';
            html += '<div class="stat-bar"><div class="stat-fill" style="width: ' + percentage + '%"></div></div></div>';
        }
        
        html += '</div></div>';
        
        document.getElementById('modalBody').innerHTML = html;
        
        var mod = new bootstrap.Modal(document.getElementById('m'));
        mod.show();
        
    } catch(error) {
        console.log('erro');
        alert('Erro ao carregar detalhes!');
    }
}

window.onload = function() {
    iniciarPagina();
};
