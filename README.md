# PRJ.ED.5 - Navegador Web Simples

Projeto da disciplina Estrutura de Dados.

## Funcionalidades

- Navegacao em paginas web usando `iframe`.
- Historico de navegacao.
- Botao para voltar usando pilha.
- Visualizacao dos itens do historico.
- Exclusao seletiva de itens do historico.
- Criacao de favoritos para acesso rapido.

## Estruturas De Dados Utilizadas

- `Pilha`: armazena as paginas anteriores para implementar o botao Voltar.
- `ListaEncadeada`: armazena o historico de navegacao.
- `ListaEncadeada`: armazena os favoritos.

## Como Executar

Instale as dependencias:

```bash
npm install
```

Compile o TypeScript:

```bash
npm run build
```

Abra o arquivo `index.html` no navegador.

Para testar sem depender da internet, digite no campo de URL:

```txt
pagina-teste-1.html
```

Depois acesse:

```txt
pagina-teste-2.html
```

Em seguida, clique em `Voltar`.

## Sites Para Teste

Alguns sites externos podem bloquear `iframe`. Estes costumam funcionar melhor:

```txt
https://example.com
https://example.org
https://example.net
https://httpbin.org/html
https://httpbingo.org/html
https://jsonplaceholder.typicode.com
https://www.gutenberg.org
https://nodejs.org
https://www.typescriptlang.org
https://www.sqlite.org
https://www.wikibooks.org
```

## Observacao

Alguns sites bloqueiam exibicao dentro de `iframe` por politicas de seguranca do navegador, como `X-Frame-Options` ou `Content-Security-Policy`.
