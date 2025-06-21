# ⌨️ Teclado Virtual

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.10-0081CB?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://tecladovirtualtodolist.netlify.app/)

> Um teclado virtual moderno e acessível com sugestões inteligentes e sistema integrado de to-do list

## 🌟 Demo

**[Acesse o Demo Online](https://tecladovirtualtodolist.netlify.app/)**

## ✨ Características Principais

### 🎯 **Funcionalidades Core**
- **Teclado Virtual Responsivo** - Adapta-se perfeitamente a qualquer dispositivo
- **Sugestões Inteligentes** - Combina palavras frequentes com dicionário português
- **To-Do List Integrada** - Gerencie tarefas diretamente pelo teclado
- **Temas Dinâmicos** - Alternância suave entre modo claro e escuro
- **Acessibilidade Total** - Suporte completo a navegação por teclado e leitores de tela

### 🚀 **Recursos Avançados**
- **Layouts Múltiplos** - Alfabético, numérico e símbolos
- **Persistência Local** - Dados salvos automaticamente no localStorage
- **Sons de Feedback** - Experiência auditiva imersiva
- **Atalhos de Teclado** - Ctrl+A, Ctrl+C, Ctrl+V, etc.
- **Detecção de Caps Lock** - Sincronização com teclado físico
- **Otimização Mobile** - Interface otimizada para touch

### 🎨 **Design & UX**
- **Interface Moderna** - Design glassmorphism com gradientes
- **Animações Suaves** - Transições fluidas e responsivas
- **Responsividade Total** - Funciona perfeitamente em desktop, tablet e mobile
- **Tema Adaptativo** - Respeita preferências do sistema

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.2.0 | Framework principal |
| **Material-UI** | 5.15.10 | Componentes e design system |
| **Fuse.js** | 7.0.0 | Busca difusa para sugestões |
| **CSS3** | - | Estilos e animações |
| **LocalStorage** | - | Persistência de dados |

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 16.0.0 ou superior
- npm 8.0.0 ou superior

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/leodigory/virtual_teclado.git
cd virtual_teclado
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

4. **Acesse no navegador**
```
http://localhost:3000
```

### Scripts Disponíveis

```bash
npm start          # Inicia servidor de desenvolvimento
npm run build      # Gera build de produção
npm test           # Executa testes
npm run lint       # Verifica código com ESLint
npm run lint:fix   # Corrige problemas de linting automaticamente
npm run format     # Formata código com Prettier
npm run analyze    # Analisa bundle de produção
```

## 🎮 Como Usar

### **Digitação Básica**
1. Clique na área de texto para abrir o teclado virtual
2. Digite normalmente usando o teclado virtual ou físico
3. Use o botão "Limpar" para apagar todo o texto

### **Sugestões Inteligentes**
- Digite 2+ caracteres para ver sugestões
- Clique em uma sugestão para completar a palavra
- Sugestões combinam palavras frequentes + dicionário

### **To-Do List**
1. Digite sua tarefa na área de texto
2. Clique no botão "Done" no teclado virtual
3. Edite ou exclua tarefas usando os botões correspondentes

### **Atalhos de Teclado**
- `Ctrl+A` - Selecionar todo o texto
- `Ctrl+C` - Copiar texto selecionado
- `Ctrl+V` - Colar texto
- `Enter` - Salvar edição de tarefa
- `Esc` - Cancelar edição de tarefa

## 🏗️ Arquitetura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Keyboard/        # Componentes do teclado virtual
│   ├── TextArea.js      # Área de texto principal
│   ├── ToDoList.js      # Sistema de tarefas
│   └── Message.js       # Componente de mensagens
├── hooks/               # Hooks customizados
│   ├── useKeyboard.js   # Lógica do teclado
│   ├── useSuggestions.js # Sistema de sugestões
│   ├── useWordList.js   # Carregamento de dicionário
│   └── useTheme.js      # Gerenciamento de temas
├── css/                 # Estilos globais
└── App.jsx             # Componente principal
```

## 🎨 Personalização

### **Temas**
O teclado suporta temas claro e escuro. Para modificar:

```css
/* Em Key.css */
.key {
  background: var(--key-bg-color);
  color: var(--key-text-color);
}
```

### **Layouts**
Modifique os layouts em `useKeyboardLayout.js`:

```javascript
const alphaLayoutBase = [
  ['q', 'w', 'e', 'r', 't', 'y', ...],
  // ... outros layouts
];
```

### **Dicionário**
Adicione palavras aos arquivos:
- `public/br-utf8.txt` - Palavras com acentos
- `public/br-sem-acentos.txt` - Palavras sem acentos

## 📱 Responsividade

O teclado se adapta automaticamente:

```css
@media (max-width: 600px) {
  .key {
    height: 40px;
    font-size: 0.9rem;
  }
}
```

## 🔧 Configurações Avançadas

### **Performance**
- Lazy loading de componentes
- Memoização de sugestões
- Debounce em inputs
- Otimização de re-renders

### **Acessibilidade**
- Navegação por teclado
- Suporte a leitores de tela
- Contraste adequado
- Foco visível

### **SEO**
- Meta tags otimizadas
- Estrutura semântica
- Performance Core Web Vitals

## 🐛 Solução de Problemas

### **Problemas Comuns**

1. **Teclado não aparece**
   - Verifique se clicou na área de texto
   - Recarregue a página

2. **Sugestões não funcionam**
   - Verifique conexão com internet
   - Aguarde carregamento do dicionário

3. **Tarefas não salvam**
   - Verifique se localStorage está habilitado
   - Limpe cache do navegador

### **Logs de Debug**
```bash
npm run lint        # Verifica problemas de código
npm run build       # Testa build de produção
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Diretrizes de Contribuição**
- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Mantenha a acessibilidade
- Documente mudanças importantes

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Leonardo Araujo**
- GitHub: [@leodigory](https://github.com/leodigory)
- Email: leodigory@gmail.com

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Framework incrível
- [Material-UI](https://mui.com/) - Componentes de qualidade
- [Fuse.js](https://fusejs.io/) - Busca difusa poderosa
- Comunidade open source

## 📈 Roadmap

- [ ] Suporte a múltiplos idiomas
- [ ] Integração com APIs de tradução
- [ ] Modo offline completo
- [ ] PWA (Progressive Web App)
- [ ] Sincronização em nuvem
- [ ] Temas customizáveis
- [ ] Atalhos personalizáveis

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**

Feito com ❤️ e ☕ por Leonardo Araujo
