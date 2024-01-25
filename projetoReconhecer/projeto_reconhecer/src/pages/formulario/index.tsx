import React, { useState, FormEvent } from 'react';

const Formulario: React.FC = () => {
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/envio/response/123456', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dados_pessoais: {
          nome,
          função: funcao,
        },
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome:
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <br />
      <label>
        Função:
        <input type="text" value={funcao} onChange={(e) => setFuncao(e.target.value)} />
      </label>
      <br />
      {/* Adicione mais campos do formulário conforme necessário */}
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
