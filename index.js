const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/database');

const orderRoutes = require('./Orders/Order Route/OrderRoute')
const RunningCostRoutes = require('./RunningCost/RunningCostRoute')

const app = express();
app.use(express.json());

app.use((req,res,next)=>{
  console.log('backend 1 accesed!')
  next();
})

app.use(cors({
  origin:'http://localhost:5173',
  methods:['GET','POST','PUT','DELETE'],
  credential:true
}));

app.use((req,res,next)=>{
  console.log('backend 2 accesed!')
  next();
})


app.use('/api/order', orderRoutes);
app.use('/api/running-costs', RunningCostRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
connectDB();