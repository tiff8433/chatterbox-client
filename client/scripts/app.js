var app;
$(document).ready(function(){

  app = {

    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'anonymous',
    roomname: 'lobby',

    init: function(){
      app.username = window.location.search.substr(10);
      //cache jquery selectors
      app.$main = $('#main');
      app.$message = $('#message');
      app.$chats = $('#chats');
      app.$roomSelect = $('#roomSelect');
      app.$send = $('#send');

      app.$roomSelect.on('change', app.saveRoom);
      app.stopSpinner();
      app.fetch();

      setInterval(app.fetch, 3000);
    },

    saveRoom: function(e) {
      var selectedIndex = app.$roomSelect.prop('selectedIndex');

      if(selectedIndex === 0){
        var roomname = prompt('Enter room name');
        if(roomname){
          app.roomname = roomname;
          app.addRoom(roomname);
        }
      } else {
        app.roomname = app.$roomSelect.val();
        app.fetch();
      }
    },

    send: function(message) {
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(data){
          console.log('chatterbox: Message sent. Data: ', data);
        },
        error: function(data){
          console.error('chatterbox: Failed to send message. Error: ', data);
        }
      });
    },
    //fetch accesses parse api via ajax request
    fetch: function() {
      app.startSpinner();
      $.ajax({
        url: app.server,
        type: 'GET',
        data: { order: '-createdAt' },
        contentType: 'application/json',
        complete: function(){
          app.stopSpinner();
        },
        success: function(data){
          app.populateRooms(data.results);
          app.populateMessages(data.results);
        },
        error: function(reason){
          console.erro('Failed to fetch data: ', reason);
        }
      });
    },

    startSpinner: function(){
      $('.spinner img').show();
    },

    stopSpinner: function(){
      $('.spinner img').hide();
    },

    populateRooms: function(results) {
      app.$roomSelect.html('<option value="__newRoom">New Room...</option><option value="lobby" selected>Lobby</option>');
      if(results) {
        var processedRooms = {};
        results.forEach(function(data){
          var roomname = data.roomname;
          if( roomname && !processedRooms[roomname]) {
            app.addRoom(roomname);
            processedRooms[roomname] = true;
          }
        });
      }
      app.$roomSelect.val(app.roomname);   
    },

    populateMessages: function(results) {
      app.clearMessages();

      if(Array.isArray(results)) {
        results.forEach(app.addMessage);
      } 
    },

    clearMessages: function() {
      app.$chats.html('');
    },

    addMessage: function(data) {
      if( !data.roomname ){
        data.roomname = 'lobby';
      }

      if( data.roomname === app.roomname ) {
        var $chat = $('<div class="chat" />');
        var $username = $('<span class="username" />');
        $username.text(data.username + ': ')
        .attr('data-username', data.username)
        .attr('data-roomname', data.roomname)
        .appendTo($chat);

        var $message = $('<br /><span />');
        $message.text(data.text)
          .appendTo($chat);

        app.$chats.append($chat);
      }
    },

    addRoom: function(roomname) {
      var $option = $('<option />').val(roomname).text(roomname);
      app.$roomSelect.append($option);
    },

    addFriend: function() {},

    handleSubmit: function() {}
  }



});


