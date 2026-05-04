const express = require('express');
const cors = require('cors');

const productosRouter = require('./routes/productos');
const clientesRouter = require('./routes/clientes');
const ventasRouter = require('./routes/ventas');
const reportesRouter = require('./routes/reportes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/reportes', reportesRouter);

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});