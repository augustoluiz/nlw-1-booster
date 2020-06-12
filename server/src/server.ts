/*
    start na aplicacao
*/

// request param --> obrigatorio
// query param --> opcional (usado em filtros, paginação)
// request body --> parâmetros para criação/atualização de informações

import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'

const app = express()

// O módulo cors define quais urls podem acessar a nossa API
app.use(cors())
app.use(express.json())
app.use(routes)

//middleware de arquivos estáticos
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}) 