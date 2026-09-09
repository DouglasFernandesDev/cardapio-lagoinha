# Post para LinkedIn — Cardápio Digital Lagoinha

## Versão completa

🍕 Construí um cardápio digital do zero — sem framework, sem bundler, sem `npm install`.

O "Lagoinha" nasceu como um estudo de caso: até onde dá pra levar um projeto de front-end usando só HTML, CSS e JavaScript puro, com as mesmas preocupações de produto e engenharia que um app de delivery real teria?

O que ele faz:
→ Catálogo com 8 categorias e 40+ produtos, gerado 100% via JavaScript a partir de uma única estrutura de dados
→ Busca em tempo real por nome e descrição
→ "Monte sua Pizza": escolha de tamanho, até 4 sabores simultâneos e borda recheada, com preço recalculado ao vivo seguindo a regra real de pizzaria (cobra pelo sabor mais caro)
→ Carrinho persistente via localStorage — o pedido sobrevive a um refresh da página
→ Checkout completo com validação client-side e finalização automática do pedido pelo WhatsApp

Algumas decisões de arquitetura que valeram a pena registrar:
→ Rolagem suave própria com requestAnimationFrame, no lugar do scroll-behavior nativo, que se mostrou inconsistente entre navegadores quando combinado com rolagem disparada via JS
→ position: sticky reforçado por IntersectionObserver, pra garantir a barra de categorias fixa mesmo onde o sticky sozinho falha
→ Modais controlados manualmente (overlay + classe) em vez de <dialog> nativo, pra não competir com o estilo "de fábrica" do navegador
→ Sistema de fallback de imagem à prova de race condition — cobre até o caso de uma foto que já falhou antes do JS conseguir escutar o evento de erro

Stack: HTML5 semântico, CSS3 puro (custom properties, Grid, Flexbox, :has()), JavaScript ES6+ e a API de mensagens do WhatsApp. Três arquivos, zero dependências, roda em qualquer hospedagem estática.

Foi um exercício de fundamentos — e um lembrete de que dá pra resolver problemas reais de produto sem sair correndo pro framework da moda.

🔗 Demo: https://pizzaria-lagoinha.vercel.app/
🔗 Código: https://github.com/DouglasFernandesDev

#javascript #frontend #webdevelopment #desenvolvimentoweb #programacao #css #html #vanillajs

## Versão curta

Construí um cardápio digital completo — busca, montador de pizza com preço dinâmico, carrinho persistente e checkout via WhatsApp — usando só HTML, CSS e JavaScript puro. Sem framework, sem build step, sem dependências.

Foi um exercício deliberado de fundamentos: DOM, eventos, closures, IntersectionObserver, localStorage, resolvendo na mão os problemas que normalmente um framework resolveria por mim.

Demo: https://pizzaria-lagoinha.vercel.app/
Código: https://github.com/DouglasFernandesDev

#javascript #frontend #vanillajs #webdevelopment

## Sugestão de imagem

Pode usar o print do desktop ou o card que já gerei para o Instagram — no LinkedIn a versão desktop (imagens/produtos + tela cheia do cardápio) costuma performar melhor do que o formato vertical de Stories.
