var express = require("express");
var fs = require("fs").promises;
const admin = require("firebase-admin");
const cors = require("cors");

var app = express();

// Use cors middleware
app.use(cors());
// Use express.json() middleware
app.use(express.json());

// Configure Firebase Admin com suas credenciais
const serviceAccount = require("./services/programa-reconhecer-firebase-adminsdk-bc6wr-ee5e2a9528.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Rota para obter todos os dados
app.get("/", async (req, res) => {
  try {
    // Leia o conteúdo do arquivo 'data.json'
    const rawData = await fs.readFile("./data.json");
    const data = JSON.parse(rawData);

    res.json(data);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao ler dados do arquivo" });
  }
});

// Rota para obter dados por identificador único
app.get("/api/dados/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Leia o conteúdo do arquivo 'data.json'
    const rawData = await fs.readFile('./data.json');
    const data = JSON.parse(rawData);

    const result = data[id];

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ mensagem: "Identificador não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao ler dados do arquivo" });
  }
});

// Rota para inserir dados no banco
app.post('/envio/response/:doc', async (req, res) => {
  const docId = req.params.doc;
  const data = req.body;

  try {
    // Referência ao nó do banco de dados usando o documento fornecido
    const db = admin.firestore();
    const dbRef = db.collection(docId).doc(); // Usei doc() para gerar um ID automático, você pode modificar conforme necessário

    // Define os dados no nó específico
    await dbRef.set(data);

    res.status(200).json({ mensagem: "Dados inseridos com sucesso" });
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
    res.status(500).json({ mensagem: "Erro ao inserir dados" });
  }
});

// Inicie o servidor
var port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});