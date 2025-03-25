# Teclado Virtual 

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15.0-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

  Demo:
![Tarefas](https://img.shields.io/badge/Tarefas-Organizadas-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)

🚀 Recursos Principais
  Sugestões Inteligentes: Combina palavras frequentemente usadas com sugestões de um dicionário
  Teclado Customizável: Layouts alternativos e tema escuro/claro
  To-Do List Integrada: Adicione e gerencie tarefas diretamente pelo teclado
  Otimizado para Mobile: Design responsivo que se adapta a qualquer tamanho de tela
  Acessível: Suporte a navegação por teclado físico

📦 Estrutura do Projeto

![image](https://github.com/user-attachments/assets/3f9c3324-1b68-4906-9e4a-2aff2bc4dd78)

O Teclado Virtual é uma aplicação web que simula um teclado físico, permitindo que os usuários digitem texto em um campo de entrada. Ele foi criado como parte de um portfólio de programação, com o objetivo de demonstrar habilidades em React, Material-UI, CSS responsivo, e boas práticas de desenvolvimento.

🛠️ Bibliotecas Utilizadas

Biblioteca	Uso	Documentação

  React	Framework principal	reactjs.org
  Fuse.js	Busca difusa para sugestões	fusejs.io
  Material Icons	Ícones do teclado	material.io
  
🔧 Configuração do Ambiente

  Node.js (v14+)
  
  npm
  

![image](https://github.com/user-attachments/assets/01b4f1d6-c1c8-4774-9371-3cab01353949)


Clone o repositório:
     
      ```git clone https://github.com/leodigory/teclado-virtual.git
       cd teclado-virtual
       ```

🔗 Documentação: https://reactjs.org/

Instale as dependências: Certifique-se de ter o Node.js instalado.
   
   
     npm install
   

2. Fuse.js (para busca difusa de sugestões)
   
🔗 Documentação: https://fusejs.io/

📦 Instalação:

```
npm install fuse.js
```

3. Material Icons (ícones do teclado)
🔗 Documentação: https://mui.com/material-ui/material-icons/

📦 Instalação (via CDN - já configurada no CSS do projeto):

html
No seu public/index.html -->
        
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

Execução:

    npm start

Build para produção:

    npm run build

🎨 Personalização

Temas
O teclado suporta temas claro e escuro. Para modificar as cores:

    /* No arquivo Key.css */
    .key {
      background: var(--key-bg-color);
      color: var(--key-text-color);
    }

  - **Temas Claro/Escuro**: Alterne entre temas claro e escuro com um botão estilizado (ícones de sol e lua).
  - 
  ![image](https://github.com/user-attachments/assets/cedaae25-98da-49a6-808f-76e57c0aa903)  ![image](https://github.com/user-attachments/assets/8a6128de-e8eb-4c10-87c3-e1fdab7f8339)


- **Ícones do Material-UI**: Teclas especiais como `Enter`, `Shift`, `Backspace`, e `Space` possuem ícones correspondentes.
- **Transparência**: O teclado e os botões possuem transparência para um visual moderno.
- **Transições Suaves**: Todas as mudanças de layout e tema são animadas com transições CSS suaves.


  Layouts
Modifique os layouts em useKeyboardLayout.js:
```
  const alphaLayoutBase = [
  ['q', 'w', 'e', 'r', 't', 'y', ...],
  // ... outros layouts
  ];
```
 - **Modo de Símbolos**: Alterne entre letras e números/símbolos com o botão `?123`.

  📱 Responsividade
O teclado se adapta automaticamente a diferentes tamanhos de tela. Pontos de quebra podem ser ajustados em Key.css:
   ```
    @media (max-width: 600px) {
      .key {
        height: 40px;
        font-size: 0.9rem;
      }
    }
  ```

- **Layout Responsivo**: O teclado se adapta a diferentes tamanhos de tela (desktop e celular) com transições suaves e graduais.
![image](https://github.com/user-attachments/assets/9d2017ad-e3e6-4c32-8087-9f5a672bfde2) ![image](https://github.com/user-attachments/assets/d904ba20-f8ed-40d2-bc5f-0f6322fa8080)

📝 Sistema de To-Do List
✨ Visão Geral
Componente integrado que permite:

  Criar tarefas diretamente do teclado virtual
  Editar/Excluir itens com confirmação visual
  Persistência local (dados salvos no localStorage)
  Design responsivo que se adapta ao tema (claro/escuro)

🧩 Componente: ToDoList.js
Localização:
/src/components/ToDoList.js

Props Recebidas:

Prop	Tipo	Descrição
  items	Array	Lista de tarefas
  onEdit	Function	Callback para editar um item
  onDelete	Function	Callback para excluir um item

🔧 Funcionalidades Principais
1. Adição de Tarefas
  Acionado pelo botão "Done" no teclado

Validação: Ignora textos vazios

  Animação: Mensagem de confirmação aparece por 2 segundos

```
// Exemplo de uso no App.js
const handleDone = () => {
  if (value.trim()) {
    setTodoItems([...todoItems, value.trim()]);
    setValue('');
  }
};
```

💾 Persistência de Dados
Os itens são salvos automaticamente no localStorage:

```
// No App.js
useEffect(() => {
  localStorage.setItem('todoItems', JSON.stringify(todoItems));
}, [todoItems]);
```

📱 Responsividade
  Layout compacto em mobile
  Botões redimensionáveis
  Espaçamento adaptativo

```
@media (max-width: 600px) {
  .task-item {
    padding: 8px 12px;
  }
}
```

Este sistema foi projetado para ser:
✅ Intuitivo (UX simples)
✅ Extensível (facilmente modificável)
✅ Performance (otimizado com React.memo)

Para customizações avançadas, edite o arquivo ToDoList.js.

🧠 Sistema de Sugestões
O sistema combina:

  Palavras frequentemente usadas (rastreadas automaticamente)
  Sugestões do dicionário (arquivos .txt em /public)
  Para adicionar mais palavras ao dicionário, edite os arquivos:
  
  ```
  public/br-utf8.txt
  public/br-sem-acentos.txt
  ```

  📸 Screenshots
  ![image](https://github.com/user-attachments/assets/0aae0319-df5f-4952-84a0-1d263df723b4)
  ![image](https://github.com/user-attachments/assets/a4aee23e-adf1-42cc-a9fd-593a76532b2d)

  

📜 Licença
Este projeto está licenciado sob a MIT License. Sinta-se à vontade para usá-lo, modificá-lo e distribuí-lo conforme necessário.


📧 Contato
Se você tiver dúvidas ou precisar de ajuda, entre em contato comigo:
```
GitHub: leodigory
E-mail: leodigory@gmail.com
```
Feito com 💻 e ☕ por Leonardo Araujo.
