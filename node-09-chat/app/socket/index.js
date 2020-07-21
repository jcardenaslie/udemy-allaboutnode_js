'use strict';

const h = require('../helpers');

module.exports = (io, app) => {
    let allrooms = app.locals.chatrooms;

    io.of('/roomslist').on('connection', socket => {
        console.log("Connection with client established");
        socket.on('getChatrooms', () => {
            console.log("Fetch Chat rooms to cliene")
            socket.emit('chatRoomsList', JSON.stringify( allrooms));
        });

        socket.on('createNewRoom', newRoomInput => {
            console.log(newRoomInput);
            // check if the new room name exists
            // if not, create one and broadcast it to everyone
            if (!h.findRoomByName(allrooms, newRoomInput)) {
                allrooms.push({
                    rooms: newRoomInput,
                    roomId: h.randomHex(),
                    users: []
                });

                // Emit an update list to the creator 
                socket.emit('chatRoomsList', JSON.stringify(allrooms));

                // Broadcast to all user connected to the chatrooms
                socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms))
            }
        })
    });
    
}