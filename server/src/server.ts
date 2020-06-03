/*
    start na aplicacao
*/

// request param --> obrigatorio
// query param --> opcional (usado em filtros, paginação)
// request body --> parâmetros para criação/atualização de informações

import express from 'express'
import routes from './routes'

const app = express()

app.use(routes)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}) 