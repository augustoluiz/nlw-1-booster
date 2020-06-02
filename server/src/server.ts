import express from 'express'

const app = express()

app.get('/users', (req, res) => {
    res.json([
        'Aluno 1',
        'Aluno 2',
        'Aluno 3'
    ])
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})