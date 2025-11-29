var listaPokemonAPI = []; //a
var listaVazia = []; // b
var paginaAtual = 1; // c
var pokemonPorPagina = 20; //d 
var filtroNome = ''; // e
var filtroTipo = '';  // f1

const API = 'https://pokeapi.co/api/v2/pokemon';
const API2 = 'https://pokeapi.co/api/v2/type';

async function i() {
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
    
    l();
}

async function l() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';
    
    try {
        var pularElementos = (paginaAtual - 1) * pokemonPorPagina;
        var urlMontada = API + '?limit=' + pokemonPorPagina + '&offset=' + pularElementos;
        var resposta = await fetch(urlMontada);
        var jsonResposta = await resposta.json();
        
        var pro = [];
        for(var loop = 0; loop < jsonResposta.results.length; loop++) {
            pro.push(fetch(jsonResposta.results[loop].url));
        }
        
        var requisicao = await Promise.all(pro);
        listaPokemonAPI = [];
        for(var loop = 0; loop < requisicao.length; loop++) {
            var pokemon = await requisicao[loop].json();
            listaPokemonAPI.push(pokemon);
        }
        
        listaVazia = [...listaPokemonAPI];
        UNIFOR();
    } catch(erro) {
        console.log('erro ao carregar');
        alert('Erro ao carregar Pokémons!');
    }
}

async function lbt() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        var urlMontada = API2 + '/' + filtroTipo;
        var resposta = await fetch(urlMontada);
        var jsonResposta = await resposta.json();

        var listaPokemonTipo = [];
        var li = jsonResposta.pokemon.length > 100 ? 100 : jsonResposta.pokemon.length; // Limita a 100
        for(var i = 0; i < li; i++) {
            listaPokemonTipo.push(fetch(jsonResposta.pokemon[i].pokemon.url));
        }

        var listaPromise = await Promise.all(listaPokemonTipo);
        listaPokemonAPI = [];
        for(var i = 0; i < listaPromise.length; i++) {
            var p = await listaPromise[i].json();
            listaPokemonAPI.push(p);
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

    for(var i = 0; i < listapokemon.length; i++) {
        var pokemon = listapokemon[i];
        var forDivPokemonn = document.createElement('div');
        forDivPokemonn.className = 'col-md-3';
        
        var html = '<div class="c" onclick="showDetails(' + pokemon.id + ')">';
        html = html + '<img src="' + pokemon.sprites.front_default + '" class="i" alt="' + pokemon.name + '">';
        html = html + '<h5 class="text-center">#' + pokemon.id + ' ' + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + '</h5>';
        html = html + '<div class="text-center">';
        
        for(var j = 0; j < pokemon.types.length; j++) {
            var typeName = pokemon.types[j].type.name;
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

async function f() {
    filtroNome = document.getElementById('s').value;
    filtroTipo = document.getElementById('typeFilter').value;

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if(filtroTipo !== '') {
        await lbt();
    } else {
        UNIFOR();
    }
}

function r() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    filtroNome = '';
    filtroTipo = '';
    paginaAtual = 1;
    l();
}

function p1() {
    if(paginaAtual > 1) {
        paginaAtual--;
        if(filtroTipo !== '') {
            UNIFOR();
        } else {
            l();
        }
    }
}

function p2() {
    paginaAtual++;
    if(filtroTipo !== '') {
        UNIFOR();
    } else {
        l();
    }
}

function x() {
    document.body.classList.toggle('dark');
}

async function showDetails(id) {
    try {
        var xpto = await fetch(API + '/' + id);
        var p = await xpto.json();
        
        var zyz = await fetch(p.species.url);
        var m = await zyz.json();
        
        var desc = '';
        for(var i = 0; i < m.flavor_text_entries.length; i++) {
            if(m.flavor_text_entries[i].language.name === 'en') {
                desc = m.flavor_text_entries[i].flavor_text;
                break;
            }
        }
        
        document.getElementById('modalTitle').textContent = '#' + p.id + ' ' + p.name.charAt(0).toUpperCase() + p.name.slice(1);
        
        var ph = '<div class="row"><div class="col-md-6">';
        ph += '<div class="sprite-container">';
        ph += '<div><img src="' + p.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        ph += '<div><img src="' + p.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        ph += '</div>';
        
        ph += '<p><strong>Tipo:</strong> ';
        for(var i = 0; i < p.types.length; i++) {
            ph += '<span class="badge type-' + p.types[i].type.name + '">' + p.types[i].type.name + '</span> ';
        }
        ph += '</p>';
        
        ph += '<p><strong>Altura:</strong> ' + (p.height / 10) + ' m</p>';
        ph += '<p><strong>Peso:</strong> ' + (p.weight / 10) + ' kg</p>';
        
        ph += '<p><strong>Habilidades:</strong> ';
        for(var i = 0; i < p.abilities.length; i++) {
            ph += p.abilities[i].ability.name;
            if(i < p.abilities.length - 1) ph += ', ';
        }
        ph += '</p>';
        
        ph += '</div><div class="col-md-6">';
        
        ph += '<p><strong>Descrição:</strong></p>';
        ph += '<p>' + desc.replace(/\f/g, ' ') + '</p>';
        
        ph += '<h6>Estatísticas:</h6>';
        for(var i = 0; i < p.stats.length; i++) {
            var stat = p.stats[i];
            var percentage = (stat.base_stat / 255) * 100;
            ph += '<div><small>' + stat.stat.name + ': ' + stat.base_stat + '</small>';
            ph += '<div class="stat-bar"><div class="stat-fill" style="width: ' + percentage + '%"></div></div></div>';
        }
        
        ph += '</div></div>';
        
        document.getElementById('modalBody').innerHTML = ph;
        
        var mod = new bootstrap.Modal(document.getElementById('m'));
        mod.show();
        
    } catch(error) {
        console.log('erro');
        alert('Erro ao carregar detalhes!');
    }
}

window.onload = function() {
    i();
};
