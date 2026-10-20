const express = require('express');
const db = require('./db');
const port = 3000;
const app = express();
app.use(express.json());

function calcularTEMP(valor_original, unidade_original){
    const tempCelsius = parseFloat(valor_original);
    let tempCalculada = 0
    let classificacao = ""
    let unidade_convertida = ""
    if(unidade_original === "c"){
        tempCalculada = (tempCelsius * 9 / 5) + 32
        unidade_convertida = "f";

        if(tempCalculada < 50){
            classificacao = "O clima esta frio"
        }else if(tempCalculada >= 50 && tempCalculada <= 70){
            classificacao = "O clima esta agradavel"
        }else{
            classificacao = "O clima esta quente"
        }
    }else{
        tempCalculada = (tempCelsius - 32) * 5 / 9
        unidade_convertida = "c";

        if(tempCalculada < 10){
            classificacao = "O clima esta frio"
        }else if(tempCalculada >= 10 && tempCalculada <= 21){
            classificacao = "O clima esta agradavel"
        }else{
            classificacao = "O clima esta quente"
        }
    }
    const valor_convertido = parseFloat(tempCalculada.toFixed(2));
    return {valor_convertido,classificacao, unidade_convertida};
}

function calcularVelo(valor_original, unidade_original){
    const velocidadeBase = parseFloat(valor_original);
    let velocidadeConvertida = 0;
    let classificacao = ""
    let unidade_convertida = ""
    
    if(unidade_original === "km/h"){
        velocidadeConvertida = velocidadeBase / 3.6
        unidade_convertida = "m/s";

        if(velocidadeConvertida < 11.1){
            classificacao = "Baixa Velocidade"
        }else if (velocidadeConvertida >= 11.1 && velocidadeConvertida <= 25){
            classificacao = "Velocidade Moderada"
        }else{
            classificacao = "Alta Velocidade"
        }
    }else{
        velocidadeConvertida = velocidadeBase * 3.6
        unidade_convertida = "km/h";
        if(velocidadeConvertida < 5){
            classificacao = "Baixa Velocidade"
        }else if (velocidadeConvertida >= 5 && velocidadeConvertida <= 90){
            classificacao = "Velocidade Moderada"
        }else{
            classificacao = "Alta Velocidade"
        }
    }
    const valor_convertido = parseFloat(velocidadeConvertida.toFixed(2));
    return {valor_convertido,classificacao, unidade_convertida};
}

function calcularCom(valor_original, unidade_original){
    const comprimentoM = parseFloat(valor_original);
    let comprimentoConvertido
    let classificacao = ""
    let unidade_convertida = ""
    if(unidade_original === "m"){
        comprimentoConvertido = comprimentoM * 3.28084
        unidade_convertida = "ft";
        if(comprimentoConvertido < 16.40){
            classificacao = "Curto"
        }else if(comprimentoConvertido >=16.40 && comprimentoConvertido <= 164){
            classificacao = "Médio"
        }else{
            classificacao = "Longo"
        }

    }else{
        comprimentoConvertido = comprimentoM * 0.3048
        unidade_convertida = "m";
        if(comprimentoConvertido < 5){
            classificacao = "Curto"
        }else if(comprimentoConvertido >=5 && comprimentoConvertido <= 50){
            classificacao = "Médio"
        }else{
            classificacao = "Longo"
        }
    }
    const valor_convertido = parseFloat(comprimentoConvertido.toFixed(2));
    return {valor_convertido, classificacao, unidade_convertida};


}

function resultadoConv(tipo,valor_original, unidade_original){
    tipo = tipo.toLowerCase()
    unidade_original = unidade_original.toLowerCase()
    
    if(tipo !== "temperatura" && tipo !== "velocidade" && tipo !== "comprimento"){
        return { erro: "Tipo inválido! Os tipos aceitos são: temperatura, velocidade ou comprimento." };
    }

    if(tipo == "temperatura"){
        if(unidade_original !== "c" && unidade_original !== "f"){
            return { erro: `Unidade '${unidade_original}' incompatível para temperatura. Use 'C' ou 'F'.` };
        }else{
            return calcularTEMP(Number(valor_original), unidade_original);
        }

    }else if(tipo === "velocidade"){
        if(unidade_original !== "km/h" && unidade_original !== "m/s"){
            return { erro: `Unidade '${unidade_original}' incompatível para velocidade. Use 'km/h' ou 'm/s'.` };
        }else{
            return calcularVelo(Number(valor_original), unidade_original);
        }
       
    }else if(tipo == "comprimento"){
        if(unidade_original !== "m" && unidade_original !== "ft"){
            return { erro: `Unidade '${unidade_original}' incompatível para comprimento. Use 'm' ou 'ft'.` };
        }else{
            return calcularCom(Number(valor_original), unidade_original)
        }
    }
}

module.exports = {resultadoConv};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/medicao', async(req,res) => {
    try {
        const[rows] = await db.execute('SELECT * FROM medicoes');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message
        });  
    }
})

app.get('/medicao/alta-velocidade', async(req,res) => {
    try {
        const[rows] = await db.execute('select * from medicoes where classificacao = "Alta Velocidade"');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message
        });  
    }
})

app.get('/medicao/:id', async(req,res) => {
    const {id} = req.params;
    try {
        const[rows] = await db.execute('select * from medicoes where id=?',[id]);
        if(rows.length ===0){
            return res.status(404).json({
                mensagem:"Medicao nao encontrado",
                detalhes:"error.message"            
            });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message
        });  
    }
});

app.post('/medicao', async(req,res) => {
    const {descricao, valor: valor_original, unidade_original, tipo} = req.body

    if(!descricao || descricao.trim() === "" || !valor_original || !unidade_original || !tipo){
        return res.status(400).json({
            mensagem: "Verifique se todos os dados foram preenchidos (incluindo a descrição)!"
        });
    }

    if(isNaN(Number(valor_original))){
        return res.status(400).json({
            mensagem: "O campo 'valor_original' precisa ser um número válido!"
        });
    }

    const result = resultadoConv(tipo, valor_original, unidade_original);
    if(result.erro){
        return res.status(400).json({
            mensagem:"Tipo ou unidade invalido", 
        })
    }
    const {valor_convertido, classificacao, unidade_convertida} = result;
    try {
        const[rows] = await db.execute('INSERT INTO `medicoes` (`descricao`, `tipo`, `valor_original`, `unidade_original`, `valor_convertido`, `unidade_convertida`,`classificacao`) VALUES (?,?,?,?,?,?,?);', [descricao,tipo,valor_original,unidade_original,valor_convertido,unidade_convertida,classificacao]);
        res.status(201).json({
        id:rows.insertId,
        descricao,
        tipo,
        valor_original,
        unidade_original,
        valor_convertido,
        unidade_convertida,
        classificacao
    });
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message,
            return: null
        });  
    }
})

app.put('/medicao/:id', async (req,res) => {
    const { id } = req.params;
    const {descricao, valor: valor_original, unidade_original, tipo} = req.body

    if(!descricao || descricao.trim() === "" || !valor_original || !unidade_original || !tipo){
        return res.status(400).json({
            mensagem: "Verifique se todos os dados foram preenchidos (incluindo a descrição)!"
        });
    }

    if(isNaN(Number(valor_original))){
        return res.status(400).json({
            mensagem: "O campo 'valor_original' precisa ser um número válido!"
        });
    }

    const result = resultadoConv(tipo, valor_original, unidade_original);
    if(result.erro){
        return res.status(400).json({
            mensagem:"Tipo ou unidade invalido", 
        })
    }
    const {valor_convertido, classificacao, unidade_convertida} = result;

    try {
        const [rows] = await db.execute('UPDATE `medicoes` SET `descricao` = ?, `tipo` = ?, `valor_original` = ?, `unidade_original` = ?, `valor_convertido` = ?, `unidade_convertida` = ?, `classificacao` = ? WHERE `medicoes`.`id` = ?;', [descricao,tipo,valor_original,unidade_original,valor_convertido,unidade_convertida,classificacao,id]);
        if(rows.affectedRows === 0){
            return res.status(404).json({
                mensagem: "Medição não encontrada para atualização"
            });
        }

        res.status(200).json({
            id:rows.insertId,
            descricao,
            tipo,
            valor_original,
            unidade_original,
            valor_convertido,
            unidade_convertida,
            classificacao,
            mensagem: "Medição atualizada com sucesso"
        });
    }catch (error) {
        res.status(500).json({
        mensagem:"Erro interno do servidor",
        detalhes:error.message
        })
    }

})
app.delete('/medicao/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const[rows] = await db.execute('delete from medicoes where id=?',[id]);
    if(rows.affectedRows === 0){
      return res.status(404).json({
        mensagem:"medicao nao encontrada",
      })
    }
    res.status(200).json({
        mensagem: `Medicao de id ${id} deletada com sucesso`
    });
  } catch (error) {
    res.status(500).json({
    mensagem:"Erro interno do servidor",
    detalhes:error.message
    });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

