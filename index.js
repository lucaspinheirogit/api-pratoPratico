const app = require('./config/custom-express');

app.listen(5000, () => {
    console.log("Escutando na porta 5000");
})