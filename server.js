import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()



const app = express()
app.use(express.json())
//app.use(cors('http://localhost:5173/'))
app.use(cors())

//POST
app.post('/pacientes', async (req, res) => {
    
    await  prisma.paciente.create({
        data: {
           nome: req.body.nome,
           carteira: req.body.carteira,
           plano: req.body.plano,
           especialidade: req.body.especialidade
        } 
    })
    
    res.status(201).json(req.body)
})

//GET
app.get('/pacientes', async (req, res) => {

    let users = []

    if(req.query){
        users = await prisma.paciente.findMany({
        where:{
            nome: req.query.nome
        }
    })
    
    } else {
        users = await prisma.paciente.findMany()
    }
    
    

    res.status(200).json(users)
})

//PUT
app.put('/pacientes/:id', async (req, res) => {
    
    await  prisma.paciente.update({
        where: {
            id:  req.params.id
        },
        data: {
            nome: req.body.nome,
            carteira: req.body.carteira,
            plano: req.body.plano,
            especialidade: req.body.especialidade
        } 
    })
    
    res.status(201).json(req.body)
})

//delete
app.delete('/pacientes/:id', async (req, res) => {

    await prisma.paciente.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({message: 'Usuário deletado com sucesso!'})
})




app.listen(3000)

