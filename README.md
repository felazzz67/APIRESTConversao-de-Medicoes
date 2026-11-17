# 📏 API REST - Conversão de Medições

Uma **API RESTful** desenvolvida em **Node.js** com **Express** e banco de dados **MySQL**, projetada para realizar o cadastro, consulta, atualização, exclusão e a **conversão automática de unidades de medição** (temperatura, velocidade e comprimento) com classificação dos resultados.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express (`^5.3.0`)**: Framework web para gerenciamento de rotas e requisições HTTP.
- **MySQL2 (`^3.24.6`)**: Cliente MySQL com suporte a Promises e gerenciamento por Pool de conexões.
- **Dotenv (`^18.0.8`)**: Carregamento de variáveis de ambiente a partir do arquivo `.env`.
- **Nodemon (`^3.1.14`)**: Ferramenta de desenvolvimento para reinicialização automática do servidor.

---

## 📁 Estrutura Principal dos Arquivos

- **`app.js`**: Arquivo principal da aplicação contendo as regras de conversão, funções utilitárias e definição de todas as rotas da API.
- **`db.js`**: Arquivo responsável por criar e exportar o Pool de conexões com o MySQL utilizando variáveis de ambiente.
- **`package.json`**: Configuração das dependências e scripts do projeto (ex: `npm run dev`).

---

## ⚙️ Configuração e Execução

1. **Instalar as dependências**:
   ```bash
   npm install
Configurar as Variáveis de Ambiente (.env): Crie um arquivo .env na raiz do projeto contendo as credenciais de acesso ao seu banco de dados MySQL:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seu_banco_de_dados
Iniciar o Servidor em Desenvolvimento:
npm run dev
O servidor será iniciado na porta 3000 (http://localhost:3000).
🧮 Regras de Negócio e Conversões Suportadas
O servidor valida os dados e executa os cálculos diretamente no backend:
Temperatura (temperatura):
Converte entre Celsius (c) e Fahrenheit (f).
Classifica o clima como "O clima esta frio", "O clima esta agradavel" ou "O clima esta quente".
Velocidade (velocidade):
Converte entre km/h e m/s.
Classifica a velocidade como "Baixa Velocidade", "Velocidade Moderada" ou "Alta Velocidade".
Comprimento (comprimento):
Converte entre Metros (m) e Pés (ft).
Classifica a medida como "Curto", "Médio" ou "Longo".
📌 Rotas da API (Endpoints)
Método
Endpoint
Descrição
Corpo da Requisição (JSON)
GET
/
Retorna mensagem de teste da API.
N/A
GET
/medicao
Retorna todas as medições cadastradas.
N/A
GET
/medicao/alta-velocidade
Filtra e retorna medições com classificação "Alta Velocidade".
N/A
GET
/medicao/:id
Busca uma medição específica pelo ID.
N/A
POST
/medicao
Cadastra uma nova medição com cálculo e conversão automática.
{ "descricao": "Vento", "valor": 50, "unidade_original": "km/h", "tipo": "velocidade" }
PUT
/medicao/:id
Atualiza os dados de uma medição e recalcula os valores.
{ "descricao": "Vento forte", "valor": 100, "unidade_original": "km/h", "tipo": "velocidade" }
DELETE
/medicao/:id
Exclui a medição correspondente ao ID informado.
N/A
📝 Exemplo de Requisição e Resposta (POST)
Requisição (POST /medicao):
{
  "descricao": "Temperatura ambiente",
  "valor": 25,
  "unidade_original": "c",
  "tipo": "temperatura"
}
Resposta (201 Created):
{
  "id": 1,
  "descricao": "Temperatura ambiente",
  "tipo": "temperatura",
  "valor_original": 25,
  "unidade_original": "c",
  "valor_convertido": 77,
  "unidade_convertida": "f",
  "classificacao": "O clima esta quente"
}

