import express from 'express';


// router
import userRouters from './routes/user/index' 


const app = express();

// middlaware
app.use(express.json())
app.use('/user', userRouters)
// Server setup
const port = 5000;

app.get('/ping', (_req, res)=>{
    res.send('pong')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
