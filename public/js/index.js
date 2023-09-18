let socket = io();

function scroll(){
  const msg = document.querySelector('#message-list').lastElementChild;
  msg.scrollIntoView();
}

socket.on('connect',()=>{
    console.log('connected to server');
});

socket.on('disconnect',()=>{
    console.log('disconnected from server');
})


  socket.on('newMessage', (message) => {
    // console.log("newMessage", message);

    let ul = document.getElementById('message-list');
    let li = document.createElement('li');

    // Create elements with appropriate classes
    let fromSpan = document.createElement('span');
    fromSpan.innerText = `${message.from} `;
    fromSpan.classList.add('message-from');

    let createdAtSpan = document.createElement('span');
    createdAtSpan.innerText = `${message.createdAt}: `;
    createdAtSpan.classList.add('message-created-at');

    let textSpan = document.createElement('span');
    textSpan.innerText = message.text;
    textSpan.classList.add('message-text');

    // Append spans to the list item
    li.appendChild(fromSpan);
    li.appendChild(createdAtSpan);
    li.appendChild(textSpan);

    // Append the list item to the message list
    ul.appendChild(li);

    // Clear the input field
    document.querySelector('input[name="message"]').value = "";
    scroll();
});

socket.on('newLocationMessage', (message) => {
  // console.log("newLocationMessage", message);

  let ul = document.getElementById('message-list');
  let li = document.createElement('li');

  // Create elements with appropriate classes
  let fromSpan = document.createElement('span');
  fromSpan.innerText = `${message.from} `;
  fromSpan.classList.add('message-from');

  let createdAtSpan = document.createElement('span');
  createdAtSpan.innerText = `${message.createdAt}: `;
  createdAtSpan.classList.add('message-created-at');

  let a = document.createElement('a');
  a.setAttribute('target', '_blank');
  a.setAttribute('href', message.url);
  a.innerText = 'My current location';
  a.classList.add('message-location-link');

  // Append spans and the link to the list item
  li.appendChild(fromSpan);
  li.appendChild(createdAtSpan);
  li.appendChild(a);

  // Append the list item to the message list
  ul.appendChild(li);
  scroll();
});


document.querySelector('#submit-btn').addEventListener('click',(e)=>{
  e.preventDefault();

socket.emit('createMessage',{
from:"User",
text:
document.querySelector('input[name="message"]').value
} , ()=>{
})
})

document.querySelector('#send-location').addEventListener('click',(e)=>{
  if(!navigator.geolocation){
    return alert('Geolocation is not supported by your browser');
  }
//   navigator.geolocation.getcurrentposition takes 2 functions one gives our position and other if any thing goes wrong
    navigator.geolocation.getCurrentPosition(
    (position)=>{
            socket.emit('createLocationMessage',{
            lat:position.coords.latitude,
            lng:position.coords.longitude
        });
    },
    ()=>{
    alert('enable to fetch position');
});
});