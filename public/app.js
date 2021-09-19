$(document).ready(() => {
  let _name;
  let ValidName = false;
  let URL = 'http://localhost:8080'; 

  do{
      _name = prompt("Welcome, What is your name?");
      if(_name.length < 1){
          ValidName = false;
      }
      else{
          ValidName = true;
      }
  }while(ValidName === false)
  
  const socket = io(`${ URL }`, { path: '/dev' });

  // creating variables for getting data from frontend
  const message = document.querySelector("#text-message");
  const messagePanel = document.querySelector("#message-panel");
  const sendButton = document.querySelector("#send-btn");
  const errorStatus = document.querySelector("#text-status");
  const connectionList = document.querySelector("#connection-list");

  // initialize variables
  message.value = ''

  // add click addEventListener
  sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    SendMessage(); // call send message
  });

  // add keyup event listener
  message.addEventListener("keyup", () => {
    socket.emit("typing", { username: _name });
  });

  message.addEventListener("focusout", () => {
    socket.emit("done-typing", {});
  });

  socket.on("typing", (data) => {
    const { username } = data;
    // set text status
    errorStatus.innerHTML = `${username} is typing...`;
  });

  socket.on("done-typing", () => {
    // set text status to empty 
    errorStatus.innerHTML = " ";
  });

  socket.on("send", (data) => {
    const { message, username } = data;

    // creating a new li element for messages 
    let elem = document.createElement("div");
    let breakElem = document.createElement("br");
    //elem.style ="list-style-type : none;";

    // if you are not the sender
    if (username != _name) {
      elem.className = `balon1 p-2 m-0 position-relative mb-2`;
      const atag = document.createElement("a");
      atag.className = "float-right"
      atag.innerHTML = `${username}: ${message}`;
      elem.appendChild(atag);
    } else {
      elem.className = `balon2 p-2 m-0 position-relative mt-2`;
      const atag = document.createElement("a");
      atag.className = "float-left";
      atag.innerHTML = `${message}`;
      elem.appendChild(atag);
    }

    messagePanel.appendChild(elem);
    messagePanel.appendChild(breakElem);
  });

  socket.on("available-rooms", (data)=> {
    data.forEach(room => {
      const li = document.createElement("li");
      const br = document.createElement("br"); 
      const span = document.createElement("span");
      span.style= "cursor: pointer"
      room.connected == false ? span.className = "badge badge-dark badge-pill": span.className = "badge badge-success badge-pill"
      span.innerHTML = 'Connect'
      span.onclick= RoomConnect(room.roomId)
      li.className = 'list-group-item d-flex justify-content-between align-items-center'; 
      li.innerHTML = `${room.name}`;
      li.appendChild(span);
      connectionList.appendChild(li);
    })
  })

  
  const SendMessage = () => {
    // validate message length
    if (message.value.length == 0 || message.value == '') {
      errorStatus.innerHTML = `
            <i style="color: red">Missing message, please enter a message first</i> `;
    }else {
      socket.emit("send", { message: message.value, username: _name });
      message.value = '';
    }
  }

  const RoomConnect = (id)=> event => {
    event.preventDefault();
    socket.emit('room-connected', {id})
  };

});

