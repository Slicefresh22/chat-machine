$(document).ready(() => {
  let _name;
  let ValidName = false;
  do{
      _name = prompt("Welcome, What is your name?");
      if(_name.length < 1){
          ValidName = false;
      }
      else{
          ValidName = true;
      }
  }while(ValidName === false)

  const socket = io.connect("http://192.168.1.124:3000/");

  // creating variables for getting data from frontend
  const message = document.querySelector("#text-message");
  const textPanel = document.querySelector("#message-panel");
  const sendButton = document.querySelector("#send-btn");
  const textStatus = document.querySelector("#text-status");

  // add click addEventListener
  sendButton.addEventListener("click", (event) => {
    // validate message length
    if (message.value.length == 0) {
      textStatus.innerHTML = `
            <i style="color: red">Missing message, please enter a message first</i>
            `;
    } else {
      event.preventDefault();
      socket.emit("send", { message: message.value, name: _name });
      message.value = "";
    }
  });

  // add keyup addEventListener
  message.addEventListener("keyup", () => {
    socket.emit("typing", { name: _name });
  });

  message.addEventListener("focusout", () => {
    socket.emit("done-typing", {});
  });

  socket.on("typing", (data) => {
    const { name } = data;
    // set text status
    textStatus.innerHTML = `${name} is typing...`;
  });

  socket.on("done-typing", () => {
    textStatus.innerHTML = " ";
  });

  socket.on("send", (data) => {
    const { message, name } = data;

    let elem = document.createElement("li");
    let breakElem = document.createElement("br");
    elem.style ="list-style-type : none;";

    // if you are not the sender
    if (name != _name) {
      elem.className = `badge badge-primary`;
      elem.style = "float: right; font-size: 0.9em;";
      elem.innerHTML = `${name}: ${message}`;
    } else {
      elem.className = `badge badge-success`;
      elem.style = "float: left; font-size: 0.9em; ";
      elem.innerHTML = `${message}`;
    }

    textPanel.appendChild(elem);
    textPanel.appendChild(breakElem);
  });
});
