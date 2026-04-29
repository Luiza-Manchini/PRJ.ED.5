"use strict";
class No {
    constructor(valor) {
        this.valor = valor;
        this.proximo = null;
    }
}
class Pilha {
    constructor() {
        this.topo = null;
        this.tamanho = 0;
    }
    estaVazia() {
        return this.tamanho === 0;
    }
    empilhar(valor) {
        const novoNo = new No(valor);
        novoNo.proximo = this.topo;
        this.topo = novoNo;
        this.tamanho += 1;
    }
    desempilhar() {
        if (this.estaVazia() || this.topo === null) {
            return null;
        }
        const valor = this.topo.valor;
        this.topo = this.topo.proximo;
        this.tamanho -= 1;
        return valor;
    }
}
class ListaEncadeada {
    constructor() {
        this.inicio = null;
        this.tamanho = 0;
    }
    inserir(valor) {
        const novoNo = new No(valor);
        if (this.inicio === null) {
            this.inicio = novoNo;
            this.tamanho += 1;
            return;
        }
        let atual = this.inicio;
        while (atual.proximo !== null) {
            atual = atual.proximo;
        }
        atual.proximo = novoNo;
        this.tamanho += 1;
    }
    removerPorIndice(indice) {
        if (indice < 0 || indice >= this.tamanho || this.inicio === null) {
            return false;
        }
        if (indice === 0) {
            this.inicio = this.inicio.proximo;
            this.tamanho -= 1;
            return true;
        }
        let anterior = this.inicio;
        let posicao = 0;
        while (anterior.proximo !== null && posicao < indice - 1) {
            anterior = anterior.proximo;
            posicao += 1;
        }
        if (anterior.proximo === null) {
            return false;
        }
        anterior.proximo = anterior.proximo.proximo;
        this.tamanho -= 1;
        return true;
    }
    contem(comparador) {
        let atual = this.inicio;
        while (atual !== null) {
            if (comparador(atual.valor)) {
                return true;
            }
            atual = atual.proximo;
        }
        return false;
    }
    listar() {
        const valores = [];
        let atual = this.inicio;
        while (atual !== null) {
            valores.push(atual.valor);
            atual = atual.proximo;
        }
        return valores;
    }
}
function obterElemento(seletor) {
    const elemento = document.querySelector(seletor);
    if (elemento === null) {
        throw new Error(`Nao foi possivel encontrar o elemento ${seletor}.`);
    }
    return elemento;
}
const formNavegacao = obterElemento("#form-navegacao");
const campoUrl = obterElemento("#campo-url");
const iframe = obterElemento("#visualizador");
const botaoVoltar = obterElemento("#botao-voltar");
const botaoFavoritar = obterElemento("#botao-favoritar");
const mensagem = obterElemento("#mensagem");
const listaHistorico = obterElemento("#lista-historico");
const listaFavoritos = obterElemento("#lista-favoritos");
const contadorHistorico = obterElemento("#contador-historico");
const contadorFavoritos = obterElemento("#contador-favoritos");
const historico = new ListaEncadeada();
const favoritos = new ListaEncadeada();
const pilhaVoltar = new Pilha();
let urlAtual = null;
function normalizarUrl(url) {
    const urlLimpa = url.trim();
    if (urlLimpa.startsWith("http://") || urlLimpa.startsWith("https://")) {
        return urlLimpa;
    }
    if (urlLimpa.endsWith(".html") ||
        urlLimpa.startsWith("./") ||
        urlLimpa.startsWith("../") ||
        urlLimpa.startsWith("/")) {
        return urlLimpa;
    }
    return `https://${urlLimpa}`;
}
function obterDataHoraAtual() {
    return new Date().toLocaleString("pt-BR");
}
function informar(texto) {
    mensagem.textContent = texto;
}
function adicionarAoHistorico(url) {
    historico.inserir({
        url,
        dataHora: obterDataHoraAtual(),
    });
    renderizarHistorico();
}
function navegarPara(url, deveEmpilharAtual = true) {
    const urlNormalizada = normalizarUrl(url);
    if (urlNormalizada === "https://") {
        informar("Digite uma URL valida.");
        return;
    }
    if (urlAtual !== null && deveEmpilharAtual) {
        pilhaVoltar.empilhar(urlAtual);
    }
    urlAtual = urlNormalizada;
    iframe.src = urlNormalizada;
    campoUrl.value = urlNormalizada;
    adicionarAoHistorico(urlNormalizada);
    informar(`Pagina carregada: ${urlNormalizada}`);
}
function voltar() {
    const urlAnterior = pilhaVoltar.desempilhar();
    if (urlAnterior === null) {
        informar("Nao ha paginas anteriores na pilha de navegacao.");
        return;
    }
    navegarPara(urlAnterior, false);
}
function favoritarAtual() {
    if (urlAtual === null) {
        informar("Acesse uma pagina antes de criar um favorito.");
        return;
    }
    const jaExiste = favoritos.contem((favorito) => favorito.url === urlAtual);
    if (jaExiste) {
        informar("Esta pagina ja esta nos favoritos.");
        return;
    }
    favoritos.inserir({
        url: urlAtual,
        dataHora: obterDataHoraAtual(),
    });
    renderizarFavoritos();
    informar("Favorito criado com sucesso.");
}
function limparLista(elemento) {
    while (elemento.firstChild !== null) {
        elemento.removeChild(elemento.firstChild);
    }
}
function criarBotao(texto, aoClicar) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.className = "secundario";
    botao.addEventListener("click", aoClicar);
    return botao;
}
function renderizarHistorico() {
    const itens = historico.listar();
    limparLista(listaHistorico);
    contadorHistorico.textContent = `${itens.length} ${itens.length === 1 ? "item" : "itens"}`;
    if (itens.length === 0) {
        listaHistorico.className = "lista-vazia";
        const item = document.createElement("li");
        item.textContent = "Nenhuma pagina visitada.";
        listaHistorico.appendChild(item);
        return;
    }
    listaHistorico.className = "";
    itens.forEach((itemHistorico, indice) => {
        const item = document.createElement("li");
        item.className = "item-lista";
        const url = document.createElement("span");
        url.className = "url-item";
        url.textContent = itemHistorico.url;
        url.addEventListener("click", () => navegarPara(itemHistorico.url));
        const data = document.createElement("span");
        data.className = "data-item";
        data.textContent = itemHistorico.dataHora;
        const acoes = document.createElement("div");
        acoes.className = "acoes-item";
        acoes.appendChild(criarBotao("Abrir", () => navegarPara(itemHistorico.url)));
        acoes.appendChild(criarBotao("Excluir", () => {
            historico.removerPorIndice(indice);
            renderizarHistorico();
            informar("Item removido do historico.");
        }));
        item.appendChild(url);
        item.appendChild(data);
        item.appendChild(acoes);
        listaHistorico.appendChild(item);
    });
}
function renderizarFavoritos() {
    const itens = favoritos.listar();
    limparLista(listaFavoritos);
    contadorFavoritos.textContent = `${itens.length} ${itens.length === 1 ? "item" : "itens"}`;
    if (itens.length === 0) {
        listaFavoritos.className = "lista-vazia";
        const item = document.createElement("li");
        item.textContent = "Nenhum favorito salvo.";
        listaFavoritos.appendChild(item);
        return;
    }
    listaFavoritos.className = "";
    itens.forEach((favorito) => {
        const item = document.createElement("li");
        item.className = "item-lista";
        const url = document.createElement("span");
        url.className = "url-item";
        url.textContent = favorito.url;
        url.addEventListener("click", () => navegarPara(favorito.url));
        const data = document.createElement("span");
        data.className = "data-item";
        data.textContent = `Criado em ${favorito.dataHora}`;
        const acoes = document.createElement("div");
        acoes.className = "acoes-item";
        acoes.appendChild(criarBotao("Abrir", () => navegarPara(favorito.url)));
        item.appendChild(url);
        item.appendChild(data);
        item.appendChild(acoes);
        listaFavoritos.appendChild(item);
    });
}
formNavegacao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    navegarPara(campoUrl.value);
});
botaoVoltar.addEventListener("click", voltar);
botaoFavoritar.addEventListener("click", favoritarAtual);
renderizarHistorico();
renderizarFavoritos();
