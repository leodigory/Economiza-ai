# Teclado Virtual 

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15.0-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

![image](https://github.com/user-attachments/assets/01b4f1d6-c1c8-4774-9371-3cab01353949)

📌 Visão Geral
Este projeto é um teclado virtual inteligente para aplicações web, com recursos de:

Sugestões de palavras baseadas em uso frequente e dicionário
Suporte a temas claro/escuro
Layouts alternativos (alfabético/numerico)
Integração com lista de tarefas
Totalmente responsivo para dispositivos móveis e desktop

🚀 Recursos Principais
Sugestões Inteligentes: Combina palavras frequentemente usadas com sugestões de um dicionário
Teclado Customizável: Layouts alternativos e tema escuro/claro
To-Do List Integrada: Adicione e gerencie tarefas diretamente pelo teclado
Otimizado para Mobile: Design responsivo que se adapta a qualquer tamanho de tela
Acessível: Suporte a navegação por teclado físico

📦 Estrutura do Projeto
![image](https://github.com/user-attachments/assets/0aae0319-df5f-4952-84a0-1d263df723b4)


O Teclado Virtual é uma aplicação web que simula um teclado físico, permitindo que os usuários digitem texto em um campo de entrada. Ele foi criado como parte de um portfólio de programação, com o objetivo de demonstrar habilidades em React, Material-UI, CSS responsivo, e boas práticas de desenvolvimento.

### 🎯 Funcionalidades Principais

- **Layout Responsivo**: O teclado se adapta a diferentes tamanhos de tela (desktop e celular) com transições suaves e graduais.
![image](https://github.com/user-attachments/assets/9d2017ad-e3e6-4c32-8087-9f5a672bfde2)



- **Temas Claro/Escuro**: Alterne entre temas claro e escuro com um botão estilizado (ícones de sol e lua).
  ![image](https://github.com/user-attachments/assets/cedaae25-98da-49a6-808f-76e57c0aa903)
![image](https://github.com/user-attachments/assets/8a6128de-e8eb-4c10-87c3-e1fdab7f8339)


 - **Modo de Símbolos**: Alterne entre letras e números/símbolos com o botão `?123`.
- **Ícones do Material-UI**: Teclas especiais como `Enter`, `Shift`, `Backspace`, e `Space` possuem ícones correspondentes.
- **Transparência**: O teclado e os botões possuem transparência para um visual moderno.
- **Transições Suaves**: Todas as mudanças de layout e tema são animadas com transições CSS suaves.

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Material-UI (MUI)**: Biblioteca de componentes para estilização e ícones.
- **CSS**: Estilização responsiva com transições suaves.
- **Git/GitHub**: Controle de versão e hospedagem do código.

## 📦 Instalação

Siga os passos abaixo para executar o projeto localmente:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/leodigory/teclado-virtual.git
   cd teclado-virtual

   Instale as dependências: Certifique-se de ter o Node.js instalado. Em seguida, execute:
bash

npm install

Adicione o som de tecla (opcional):
Baixe um arquivo de som de clique de teclado (por exemplo, key-click.mp3) e coloque-o na pasta public/.
O som será reproduzido automaticamente ao clicar nas teclas.

Inicie o projeto:

bash

npm start

O projeto será aberto no seu navegador padrão em http://localhost:3000.
🚀 Como Usar
Digite texto:
Clique nas teclas do teclado virtual para digitar no campo de entrada.
Use a tecla Enter para adicionar uma nova linha.
Use a tecla Backspace para apagar o último caractere.
Use a tecla Space para adicionar um espaço.
Alterne entre letras e símbolos:
Clique no botão ?123 para mudar para o modo de números e símbolos.
Clique no botão ABC para voltar ao modo de letras.
Mude o tema:
Clique no botão com o ícone de sol (tema escuro) ou lua (tema claro) para alternar entre os temas.
Teste a responsividade:
Redimensione a janela do navegador para ver as transições suaves do layout.
O teclado se ajusta automaticamente para telas de desktop e celular.
📐 Estrutura do Projeto
A estrutura do projeto é organizada da seguinte forma:

![image](https://github.com/user-attachments/assets/5d0edb56-d3df-4e91-a753-b5427f0c5afc)



🎨 Estilização e Responsividade
Transições Suaves: O layout usa transições CSS (transition: all 0.3s ease-in-out) para animar mudanças de tamanho, margem, padding, e cores.
Responsividade Gradativa: Media queries intermediárias garantem que o layout se ajuste gradualmente entre breakpoints (desktop e celular).
Transparência: O contêiner, o campo de entrada, e os botões possuem transparência (opacidade de 0.8) para um visual moderno.
Ícones do Material-UI: Teclas especiais usam ícones do MUI, como KeyboardReturnIcon para Enter e ArrowUpwardIcon para Shift.
🖥️ Demonstração
Aqui está uma prévia do teclado virtual em diferentes tamanhos de tela:

Desktop:
Layout fixo com teclas arredondadas e bordas suaves.
Transições suaves ao redimensionar a tela.
Celular:
Layout compacto com teclas bem espaçadas.
Tecla Space maior para facilitar o uso em telas pequenas.
📝 Notas Adicionais
Som de Tecla: Certifique-se de que o arquivo key-click.mp3 está na pasta public/. Você pode substituir o arquivo por outro som de sua preferência.
Personalização: O projeto é altamente personalizável. Você pode adicionar mais teclas, alterar as cores, ou incluir novos temas.
Melhorias Futuras:
Adicionar suporte a múltiplos idiomas (tecla US).
Implementar um modo de voz para digitação por comando de voz.
Adicionar animações de clique nas teclas.
📜 Licença
Este projeto está licenciado sob a MIT License. Sinta-se à vontade para usá-lo, modificá-lo e distribuí-lo conforme necessário.

🤝 Contribuições
Contribuições são bem-vindas! Se você tiver sugestões, melhorias ou correções, siga os passos abaixo:

Faça um fork do repositório.
Crie uma branch para sua feature (git checkout -b feature/nova-feature).
Faça commit das suas alterações (git commit -m "Adiciona nova feature").
Envie para o repositório remoto (git push origin feature/nova-feature).
Abra um Pull Request.
📧 Contato
Se você tiver dúvidas ou precisar de ajuda, entre em contato comigo:

GitHub: leodigory
E-mail: leodigory@gmail.com
Feito com 💻 e ☕ por Leonardo Araujo.
