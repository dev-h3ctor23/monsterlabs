fetch("/monsterlabs/index.php", {})
  .catch(error => {
    console.error("Error en la solicitud (update):", error);
    console.log("Ocurrió un error al enviar los datos. Inténtalo de nuevo.");
  });
