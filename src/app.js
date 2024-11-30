import express from 'express';
import productRouter from './router/productRouter.js'
import cartRouter from './router/cartRouter.js'
import viewRouter from './router/views.js'
import  {engine}  from 'express-handlebars'
import { config } from './config/config.js'
import { conectarDB } from './connDB.js'

const app =express()
const PORT = config.PORT || 8080;


app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static('./src/public'));

app.engine('handlebars', engine());

app.set('view engine', 'handlebars');

app.set('views', './src/views');

app.use('/api/products', productRouter);

app.use('/api/carts', cartRouter);

app.use('/', viewRouter);

app.get('/', (req, res)=>{
    res.send('MongoDB ONLINE!! REALICE SUS REQ');
});

app.listen(PORT, ()=>{
    console.log(` Activos en http://localhost:${PORT}`)
})

conectarDB(config.MOONGODB, config.DBNAME)