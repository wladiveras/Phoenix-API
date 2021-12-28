# Phoenix API Boilerplate // MongoDB // JWT

  Node.js REST API com Autenticação para seu projeto.\
  \
  *Antes de iniciar o projeto renomeio o arquivo default.example.ts para default.ts e configure conforme sua necessidade.*

## Rotas

### > Autenticação
  
  **{POST}** - /auth/login\
  **{POST}** - /auth/register\
  **{POST}** - /auth/logout

#### > Users (CRUD)

  **{GET}** - /users/{userID}\
  **{GET}** - /users/{userID}/posts\

#### > Posts (CRUD)

  **{POST}** - /posts\
  **{GET}** - /posts\
  **{PATCH}** - /posts/{postID}\
  **{GET}** - /posts/{postID}\
  **{DELETE}** - /posts/{postID}
  
## A fazer

- [ ] module :: Criação/Edição Cartões
- [ ] docs :: Finalizar markdown