import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [apiStatus, setApiStatus] = useState("Verificando...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await fetch("http://localhost:3001/api/health");

        if (!response.ok) {
          throw new Error("A API retornou um erro.");
        }

        const data = await response.json();
        setApiStatus(data.message);
      } catch (requestError) {
        console.error(requestError);
        setApiStatus("API indisponível");
        setError("Não foi possível conectar ao backend.");
      }
    }

    checkApi();
  }, []);

  return (
    <main>
      <h1>Sistema de Clientes e Atendimentos</h1>
      <p>Frontend desenvolvido com React.</p>

      <section>
        <h2>Status da API</h2>
        <p>{apiStatus}</p>

        {error && <p>{error}</p>}
      </section>
    </main>
  );
}

export default App;