const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

function calculartemp(valor_original){
    const numGraus = parseFloat(valor_original);
    const tempCalculada = (numGraus * 9 / 5) + 32
    const valor_convertido = parseFloat(tempCalculada.toFixed(2));

    let classificacao = ""
    if(valor_convertido < 50){
        classificacao = "O clima esta frio"
    }else if(valor_convertido >= 50 && valor_convertido <= 70){
        classificacao = "O clima está favoravel"
    }else{
        classificacao = "O clima esta quente"
    }
    return {valor_convertido,classificacao};
}

function calcularVel(valor_original){
    const numKm = parseFloat(valor_original);
    const velCalcu = numKm / 3.6
    const valor_convertido = parseFloat(velCalcu.toFixed(2));

    let classificacao = ""
    if(valor_convertido < 40){
        classificacao = "Baixa Velocidade"
    }else if(valor_convertido >= 40 && valor_convertido <= 90){
        classificacao = "Velocidade Moderada"
    }else{
        classificacao = "Alta Velocidade"
    }
    return {valor_convertido,classificacao};
}

function calcularCom(valor_original){
    const numMetros = parseFloat(valor_original);
    const comCalcu = numMetros * 3.28084
    const valor_convertido = parseFloat(comCalcu.toFixed(2));

    let classificacao = ""
    if(numMetros < 5){
        classificacao = "Curto"
    }else if(numMetros >= 5 && numMetros <= 50){
        classificacao = "Médio"
    }else{
        classificacao = "Longo"
    }
    return {valor_convertido,classificacao};
}

app.get('/', async (req, res) => {
  try {
    res.send("API está operacional");
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.get('/medicoes', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM medicoes');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.get('/medicoes/alta-velocidade', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM medicoes WHERE classificacao = "Alta Velocidade"');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.get('/medicoes/:id', async (req, res) => {
    const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM medicoes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Medições não encontrada" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
});

app.post('/medicoes', async (req, res) =>{
    const {descricao, tipo, valor_original,unidade_original,unidade_convertida} = req.body;

    if(!descricao || !tipo || !valor_original || !unidade_original || !valor_convertido || !unidade_convertida, classificacao) {
        return res.status(400).json({mensagem: "Verifique se todos os campos estão preenchidos"});
    }

    let valor_convertido;
    let classificacao;

    if(tipo == "temperatura" || tipo == "Temperatura"){
        const{valor_convertido,classificacao} =calculartemp(Number(valor_original));
    }else if(tipo == "velocidade" || tipo == "Velocidade"){
        const{valor_convertido,classificacao} =calcularVel(Number(valor_original));
    }else if(tipo == "comprimento" || tipo == "Comprimento"){
        const{valor_convertido,classificacao} =calcularCom(Number(valor_original));
    }else{
        return res.status(404).json({ mensagem: "Tipo invalido", detalhes: error.message });
    }

    try {
    const query = `
      INSERT INTO medicoes (descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida,classificacao) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida,classificacao]);
    res.status(201).json({
        id: result.insertId,
        descricao,
        tipo,
        valor_original,
        unidade_original,
        valor_convertido,
        unidade_convertida,
        classificacao,
});
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor", detalhes: error.message 
        });
    };
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});