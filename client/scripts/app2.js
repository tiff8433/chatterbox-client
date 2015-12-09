var message = {};

var app = {
  roomsList: [],
  roomMessages: [],
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function(){
    $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    //data: JSON.stringify(message),
    success: function (data) {
      console.log('chatterbox: Info recieved. Data: ', data);
        for (var i = 0; i < data.results.length; i++){
          if (data.results[i].roomname){
            var exists = false;
            for (var k = 0; k < app.roomsList.length; k++){
              if(data.results[i].roomname === app.roomsList[k]){
                exists = true;
              }
            }
            if (exists === false){
              app.roomsList.push(data.results[i].roomname);
            }
          }
        }
        for(var j = 0; j < app.roomsList.length; j++){
          $('#roomsList').append('<option value="' + app.roomsList[j] + '">' + app.roomsList[j] + '</option>');
        }  
    },
    error: function (data) {
      console.error('chatterbox: Failed to recieve. Error: ', data);
    },
  });
  },
  send: function(message){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  },
  fetch: function(message){
    $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Info recieved. Data: ', data);
      for(var i = 0; i < data.results.length; i++){
        if(data.results[i].roomname ===  message.roomname){
          app.roomMessages.push(data.results[i]);
        }
      }
      console.log(app.roomMessages);
     // app.clearMessages();
      app.addMessage();
    },
    error: function (data) {
      console.error('chatterbox: Failed to recieve. Error: ', data);
    }
  });
  },
  clearMessages: function(){
    app.roomMessages = [];
    //document.getElementById('chats').innerHTML = '';
    $('#chats').empty();
  },
  addMessage: function(){
    for(var i = 0; i < app.roomMessages.length; i++){
      $('#chats').append('<h5>' + app.roomMessages[i].username + ': </h5><p>' + app.roomMessages[i].text + '</p>')
    };
  },
  addRoom: function(){},
  addFriend: function(){}
};

app.init();
$(document).ready( function(){
  $('form').on('submit', function(){
    event.preventDefault();
    message.text = document.getElementById('messageText').value;
    message.username = 'anonymous';
    if (document.getElementById('newRoom').value){
      message.roomname = document.getElementById('newRoom').value;
    } else {
      message.roomname = document.getElementById('roomsList').value;
    }
    app.send(message);
    app.clearMessages();
    app.fetch(message);
    console.log(message);
  });
});

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };


