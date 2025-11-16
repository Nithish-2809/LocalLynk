const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const User = require("./Models/User")
const userRouter = require("./Routes/User")
const Product = require("./Models/Product")
const app = express()
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const ConnectToDataBase = require("./Connect")
const productRouter = require("./Routes/Product")
const DATABASE_URL = process.env.DATABASE_URL;
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});


ConnectToDataBase(DATABASE_URL)
.then(()=> console.log("Connected to database!!"))
.catch((err)=>console.log(`Error connecting to do database : ${err}`))


app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.get('/' , (req , res)=>{
   res.send('hello from simple server :)')
})

app.use('/user',userRouter)
app.use('/product',productRouter)















const onlineUsers = new Map(); 

io.on("connection", (socket)=> {
    console.log("User connected:", socket.id);

    
    socket.on("addUser", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("User added:", userId, "->", socket.id);
    })

    socket.on("sendMessage",({senderId,receiverId,message})=> {
        const receiverSocketId = onlineUsers.get(receiverId)

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage",{senderId,message,createdAt: new Date().toISOString()})
        }

        socket.emit("messageSent",{receiverId,message,createdAt: new Date().toISOString()})
    })

    socket.on("disconnect",() => {
        console.log("User disconnected",socket.id)

        for(let [uId,sId] of onlineUsers.entries()) {
            if(socket.id==sId) {
                onlineUsers.delete(uId)
                break
            }
        }
    
    })

})


const PORT = process.env.PORT
server.listen(PORT,()=>console.log(`Server running on port ${PORT} sucessfully`))