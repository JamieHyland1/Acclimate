import io  from 'socket.io-client'
const socket = io("http://localhost:4000");


socket.on("connection",(connect)=>{
  connect.emit("id","whats ip")
})

//this function takes a callback function as a parameter
function getMessages(cb){
  socket.on("recieved",data=> cb(null, data))
  socket.on('disconnect', function() {
        alert('Got disconnect!');})
}
function sendMessageToServer(data){
  socket.emit("chat",data)
}

export { getMessages, sendMessageToServer };
