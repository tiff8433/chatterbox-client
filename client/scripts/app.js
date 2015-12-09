var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};

$(document).ready( function(){
  $('form').on('submit', function(){
    event.preventDefault();
    message.text = document.getElementById('messageText').value;
    message.username = window.location.search.substr(10);
    if (document.getElementById('newRoom') && document.getElementById('newRoom').value){
      message.roomname = document.getElementById('newRoom').value;
    } else {
      message.roomname = document.getElementById('roomsList').value;
    }
    app.addMessage(message);
    app.clearMessages();
    app.fetch(message);
  });
  
});

var app = {
  friends: {},
  roomsList: [],
  roomMessages: [],
  server: 'https://api.parse.com/1/classes/chatterbox',
   init: function(){
    $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: 'order=-createdAt',
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
              app.roomsList.push(app.escapeHTML(data.results[i].roomname));
            }
          }
        }
        for(var j = 0; j < app.roomsList.length; j++){
          $('#roomsList').append('<option value="' + app.roomsList[j] + '">' + app.roomsList[j] + '</option>');
        }  
        $('#roomsList').append('<option id="newRoomOption" value="x">New Room...</option>');
        $('#roomsList').change(function(){
          if($(this).val() === "x"){
            $('#rooms').after('<br><input id="newRoom" type="text" placeholder="new room name here...">');
          }
        });
    },
    error: function (data) {
      console.error('chatterbox: Failed to recieve. Error: ', data);
    },
  });
  },
  send: function(message){
    $.ajax({
      url: app.server,
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
    //console.log(message);
    $.ajax({
    url: app.server,
    type: 'GET',
    data: 'where={"roomname":"'+message.roomname+'"}',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Info recieved. Data: ', data);
      for(var i = 0; i < data.results.length; i++){
        app.roomMessages.push(data.results[i]);
      }
      for(var i = 0; i < app.roomMessages.length; i++){
        var found = false;
        for (var key in app.friends){
          if(app.friends[app.roomMessages[i].username] === true) {
            found = true;
          }
        }
          if(found === true){
            $('#chats').append('<a href = "" data ='+app.roomMessages[i].username+'>' + app.escapeHTML(app.roomMessages[i].username) + ': </a><p class="friend">' + app.escapeHTML(app.roomMessages[i].text) + '</p>');
          } else {
            $('#chats').append('<a href = "" data ='+app.roomMessages[i].username+'>' + app.escapeHTML(app.roomMessages[i].username) + ': </a><p>' + app.escapeHTML(app.roomMessages[i].text) + '</p>')
          }
      }
      $('a').on('click', function(){
        event.preventDefault();
        app.addFriend($(this).attr('data'));
      });
    },
    error: function (data) {
      console.error('chatterbox: Failed to recieve. Error: ', data);
    }
  });
  },
  clearMessages: function(){
     app.roomMessages = [];
    $('#chats').empty();
  },
  addMessage: function(message){
  app.send(message);
  },
  addRoom: function(){

  },
  addFriend: function(friend){
    app.friends[friend] = true;
    app.clearMessages();
    app.fetch(message);
    // $('#chats').children().attr('data', friend).addClass('friend');
  },
  escapeHTML: function(text){
    'use strict';
    return text.replace(/[\"&<>]/g, function (a) {
        return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
    });
  }
};

app.init();