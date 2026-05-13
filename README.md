# 🍔 NetLanches

> Sistema completo de lanchonete com gerenciamento de produtos, pedidos e usuários por perfis de acesso.

<br>

## 📑 Índice

* [Requisitos](#-requisitos)
* [Configuração do Banco de Dados](#️-configuração-do-banco-de-dados)
* [Como Rodar o Projeto](#-como-rodar-o-projeto)
* [Recuperação do Banco](#️-recuperação-do-banco-migrations)
* [Usuário Padrão](#-usuário-padrão-superadm)
* [Perfis de Usuário](#-perfis-de-usuário)
* [Autenticação](#-autenticação)
* [Documentação da API](#-documentação-da-api-swagger)
* [Estrutura do Projeto](#-estrutura-do-projeto)
* [Futuras Adições](#-futuras-adições)
* [Problemas Comuns](#-problemas-comuns)

<br>

---

## 📋 Requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

| Ferramenta                                                    | Versão recomendada      | Obrigatório |
| ------------------------------------------------------------- | ----------------------- | :---------: |
| [.NET SDK](https://dotnet.microsoft.com/download)             | 9.0 ou superior         |      ✅      |
| [MySQL Server](https://dev.mysql.com/downloads/mysql/)        | 8.0 ou superior         |      ✅      |
| [Git](https://git-scm.com/)                                   | Qualquer versão recente |      ✅      |
| [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) | Qualquer versão recente |  ⬜ Opcional |

<br>

---

## ⚙️ Configuração do Banco de Dados

### 1. Crie o banco no MySQL

Abra o **MySQL Workbench** ou o terminal do MySQL e execute:

```sql
CREATE DATABASE LanchoneteDB;
```

### 2. Ajuste as credenciais no `appsettings.json`

Localize o arquivo `appsettings.json` na raiz do projeto e edite a connection string com as suas credenciais:

```json
"ConnectionStrings": {
  "MySQL": "server=localhost;port=3306;database=LanchoneteDB;user=root;password=SUA_SENHA"
}
```

> ⚠️ **Atenção:** substitua `SUA_SENHA` pela senha do seu MySQL local. O projeto vem configurado com a senha `cimatec` por padrão.

<br>

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo na ordem:

### 1. Clone o repositório

```bash
git clone https://github.com/silviojr220/LanchoneteAPI.git
cd LanchoneteAPI
```

### 2. Restaure as dependências

```bash
dotnet restore
```

### 3. Aplique as migrations

```bash
dotnet ef database update
```

> 💡 Esse comando cria todas as tabelas automaticamente, na ordem correta. Não é necessário executar nenhum script SQL manualmente.

Caso o comando `dotnet ef` não seja reconhecido, instale a ferramenta globalmente primeiro:

```bash
dotnet tool install --global dotnet-ef
```

### 4. Inicie a aplicação

```bash
dotnet run
```

A porta exata depende do seu `launchSettings.json` (pasta `Properties/`). Por padrão, o projeto costuma iniciar em:

```txt
http://localhost:5000
https://localhost:7200
```

Verifique o arquivo caso a aplicação não abra nessas portas. O **frontend é servido automaticamente** — acesse pelo navegador na mesma porta da API.

<br>

---

## 🗄️ Recuperação do Banco (Migrations)

As migrations estão versionadas no projeto e representam o histórico completo do banco de dados:

|  #  | Migration            | O que faz                                                         |
| :-: | -------------------- | ----------------------------------------------------------------- |
|  1  | `InitialCreate`      | Cria as tabelas `Produtos`, `Pedidos`, `ItensPedido` e `Usuarios` |
|  2  | `AdicionarTelefone`  | Adiciona o campo `Telefone` na tabela `Usuarios`                  |
|  3  | `AddStatusPedido`    | Adiciona os campos `Status` e `DataCriacao` na tabela `Pedidos`   |
|  4  | `AddImagemDescricao` | Adiciona os campos `Imagem` e `Descricao` na tabela `Produtos`    |
|  5  | `UpdateDescricao`    | Torna `ImagemUrl` opcional (`nullable`)                           |

### Aplicar todas as migrations de uma vez

```bash
dotnet ef database update
```

### Voltar para uma migration específica

```bash
dotnet ef database update NomeDaMigration
```

### Remover o banco e recriar do zero

```bash
dotnet ef database drop
dotnet ef database update
```

<br>

---

## 👤 Usuário Padrão (SUPERADM)

Ao iniciar a aplicação pela **primeira vez**, um usuário administrador master é criado automaticamente:

| Campo     | Valor             |
| --------- | ----------------- |
| 📧 Email  | `admin@gmail.com` |
| 🔑 Senha  | `adm123`          |
| 👑 Perfil | `SUPERADM`        |

> ⚠️ **Recomendado:** altere a senha imediatamente após o primeiro acesso.

<br>

---

## 👥 Perfis de Usuário

O sistema possui quatro níveis de acesso:

| Perfil              | Descrição                                                                            |
| ------------------- | ------------------------------------------------------------------------------------ |
| 👑 `SUPERADM`       | Gerencia administradores, funcionários e clientes. Possui acesso a todos os pedidos. |
| 🛠️ `ADM`           | Gerencia produtos e visualiza pedidos.                                               |
| 🧑‍💼 `FUNCIONARIO` | Visualiza o cardápio e os pedidos, além de confirmar preparos.                       |
| 🙋 `CLIENTE`        | Monta e finaliza pedidos pelo cardápio.                                              |

<br>

---

## 🔑 Autenticação

O sistema utiliza **JWT Bearer Token**. Após realizar o login, inclua o token retornado no header de todas as requisições protegidas:

```txt
Authorization: Bearer {seu_token}
```

> ⏱️ O token expira em **2 horas**.

<br>

---

## 📖 Documentação da API (Swagger)

Com a aplicação rodando, acesse a documentação interativa no navegador:

```txt
{sua-url-local}/swagger
```

> Disponível apenas em ambiente de desenvolvimento.

<br>

---

## 📁 Estrutura do Projeto

```txt
LanchoneteAPI/
│
├── Controllers/        # Endpoints da API (rotas e respostas HTTP)
├── Data/               # AppDbContext — configuração do EF Core
├── DTOs/               # Objetos de transferência de dados
├── Migrations/         # Histórico de versões do banco de dados
├── Models/             # Entidades mapeadas para o banco
├── Repositories/       # Camada de acesso a dados
├── Services/           # Regras de negócio
├── wwwroot/            # Frontend estático (HTML, CSS e JS)
│
└── appsettings.json    # Configurações gerais da aplicação
```

<br>

---

## 🚧 Futuras Adições

### 👤 Usuário

```txt
Implementação de carrossel automático na tela principal.
Implementação de uma tela específica do usuário, exibindo suas respectivas informações.
Criação do status "Premium" para usuários específicos.
```

### 👑 Super Admin

```txt
Atualização do front-end.
Permitir acesso à tela de criação de produtos.
Implementação de um melhor gerenciamento de administradores e funcionários.
```

### 🛠️ Admin

```txt
Botão para indicar que o produto não está disponível (atualizando para os funcionários).
Adição de campo para inserção de imagens dos produtos.
Possibilidade de marcar pedidos específicos com urgência.
```

### 🧑‍💼 Funcionário

```txt
Atualização do front-end.
Implementação de um sistema de prioridade em produtos, consistindo em uma seção exclusiva para isso.
```

<br>

---

## ❗ Problemas Comuns

<details>
<summary><strong>Erro de conexão com o banco de dados</strong></summary>

Verifique se o MySQL está em execução e se as credenciais no `appsettings.json` estão corretas (usuário, senha e nome do banco).

</details>

<details>
<summary><strong><code>dotnet ef</code> não é reconhecido</strong></summary>

Instale a ferramenta globalmente:

```bash
dotnet tool install --global dotnet-ef
```

</details>

<details>
<summary><strong>Porta já em uso</strong></summary>

Abra o arquivo `Properties/launchSettings.json` e altere o número da porta nos campos `applicationUrl`.

</details>

<details>
<summary><strong>Token inválido ou acesso negado (401/403)</strong></summary>

* Verifique se está enviando o header `Authorization: Bearer {token}` corretamente.
* Confirme se o token não expirou (validade de 2 horas).
* Certifique-se de que o perfil do usuário possui permissão para acessar o endpoint.

</details>

<br>

---

<p align="center">
  Desenvolvido por Silvio Cláudio Junior
</p>
