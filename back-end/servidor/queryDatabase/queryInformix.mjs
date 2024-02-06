import odbc from "odbc";

export default async function queryInformix() {
  let connection;

  try {
    // Estabelecer a conexão
    connection = await odbc.connect('DSN=uccx01_uccx');

    // Executar a consulta
    const data = await connection.query('SELECT csqname, oldestcontact, callshandled, callswaiting, totalcalls, loggedinagents, callsabandoned, availableagents, talkingagents FROM rtcsqssummary');

    console.log(data);

    return data;
  } catch (error) {
    console.error("Erro na consulta:", error);
    throw error; // Rejeitar o erro para o chamador, se houver algum problema
  } finally {
    // Certificar-se de fechar a conexão, independentemente de sucesso ou falha
    if (connection) {
      try {
        await connection.close();
        console.log("Conexão fechada com sucesso.");
      } catch (closeError) {
        console.error("Erro ao fechar a conexão:", closeError);
      }
    }
  }
}
