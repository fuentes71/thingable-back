########################
## CONSTRÓI APLICAÇÃO ##
########################

FROM node:18.15-alpine AS builder


## Cria o diretório da aplicação
##
WORKDIR /usr/src/app

## Copia os arquivos do repositório
##
COPY . .

## Instala dependências
##
RUN npm install

## Gera schema do Prisma
##
RUN npx prisma generate

## Compila a aplicação gerando os arquivos de distribuição
##
RUN npm run build



##########################
## AMBIENTE DE PRODUÇÃO ##
##########################

FROM node:18.15-alpine AS production

## Utiliza o usuário node da imagem [ao em vez do root]
##
USER node

## Cria o diretório da aplicação
##
WORKDIR /usr/src/app

## Copia o código compilado do builder para a imagem de produção
##
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

## Inicia o servidor
##
CMD [ "npm", "run", "start:prod" ]
