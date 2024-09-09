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
    
    const { nome, carteira, plano, especialidade } = req.body;

     // Verifica duplicidade
    const existPaciente = await prisma.paciente.findFirst({
        where: {
             carteira: carteira,
            plano: plano,
            especialidade: especialidade,
            },
        });

        if (existPaciente) {
            return res.status(400).json({
            message: `Esta especialidade ${especialidade} já foi utilizada para o plano ${plano}`,
            });
        }

    await  prisma.paciente.create({
        data: {
           nome: req.body.nome,
           carteira: req.body.carteira,
           plano: req.body.plano,
           especialidade: req.body.especialidade
        } 
    })
    
    return res.status(201).json({
        message: 'Paciente cadastrado com sucesso!',
        paciente: { nome, carteira, plano, especialidade },
    });
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




app.get('/especialidades', async (req, res) => {

    try{
        const especialidades = await prisma.especialidade.findMany();
        res.status(200).json(especialidades)
    }catch(error){
        res.status(500).json({ error: "Erro ao buscar especialidades"})
    }
})

app.get('/planos', async (req, res) => {

    try{
        const planos = await prisma.plano.findMany();
        res.status(200).json(planos)
    }catch(error){
        res.status(500).json({ error: "Erro ao buscar planos"})
    }
})


app.listen(3000)

