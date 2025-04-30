document.querySelector("button").addEventListener("click", () => {
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;

    // Verificação se os campos não estão vazios
    if (!nome || !idade) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Enviando os dados para o servidor
    fetch("/pessoas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, idade })
    })
    .then(response => response.json())
    .then(data => {
        alert("Pessoa cadastrada com ID: " + data.id);
        document.getElementById("nome").value = "";
        document.getElementById("idade").value = "";
    })
    .catch(error => {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar pessoa.");
    });
});
