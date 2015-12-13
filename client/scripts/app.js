var app;
$(document).ready(function(){

  app = {

    server: 'https://api.parse.com/1/classes/chatterbox',

    username: 'anonymous',

    init: function(){
      app.username = window.location.search.substr(10);

      app.fetch();
    },

    send: function(message){
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
    fetch: function(){
      $.ajax({
        url: app.server,
        type: 'GET',
        data: { order: '-createdAt' },
        contentType: 'application/json',
        success: function(data){
          console.log(data);
        },
        error: function(reason){
          console.erro('Failed to fetch data: ', reason);
        }
      });
    },

    clearMessages: function(){},

    addMessages: function(){},

    addRoom: function(){},

    addFriend: function(){},

    handleSubmit: function(){}
  }



});


