'user strict';

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

// traversea el objeto de rutas
let _registerRoutes = (routes, method) => {
	for(let key in routes) {
		if (
			typeof(routes[key]) === 'object' && 
			routes[key] !== null && 
			!(routes[key] instanceof Array)
		) {
			_registerRoutes(routes[key], key);
		} else {
			if(method === 'get'){
				router.get(key, routes[key]);
			} else if (method === 'post'){
				router.post(key, routes[key]);
			} else {
				router.use(routes[key]);
			}
		}
	}
}

let findOne = profileId =>{
	return db.userModel.findOne({
		'profileId': profileId
	});
}

let createUser = profile => {
	return new Promise((resolve, reject) => {
		let newChatUser = new db.userModel({
			profileId: profile.id,
			fullName: profile.displayName,
			profilePic: profile.photos[0].value || ''
		});

		newChatUser.save( error => {
			if (error){
				reject(error);
			} else {
				resolve(newChatUser);
			}
		});
	})
}

let findById = id => {
	return new Promise((resolve, reject) =>{
		db.userModel.findById(id, (error, user) => {
			if (error) reject(error);
			else resolve(user);
		})
	});
}

let route = routes => {
	_registerRoutes(routes);
	return router;
}

let isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()){
		next();
	} else {
		res.redirect('/');
	}
}

let findRoomByName = (allrooms, room) => {
	let findRoom = allrooms.findIndex( (element, index, array) => {
		if (element.room === room) {
			return true;
		} else {
			return false;
		}
	});

	return findRoom > -1 ? true : false;
}

let randomHex = () => {
	return crypto.randomBytes(24).toString('hex');
}

let findRoomById = (allRooms, roomId) => {
	return allRooms.find( (element, index, array) => {
		if (element.roomId == roomId){
			return true;
		} else {
			return false;
		}
	}) 
}

let addUserToRoom = (allrooms, data, socket) => {
	let getRoom = findRoomById(allrooms, data.roomId);
	if (getRoom) {
		console.log("socket ",socket.request.session);
		// Get the active user's Id (ObjectId as used in session)
		let userId = socket.request.session.passport.user; // Disponible por la incrustacion de passport con socketio en app
		let checkUser = getRoom.users.findIndex( (element, index, array) => {
			if (element.userId === userId){
				return true;
			} else {
				return false;
			}
		}) 

		// If the user is already present in the room, remove him first
		if (checkUser){
			getRoom.users.splice(checkUser, 1);
		}

		// Push the user into the room's users array
		getRoom.users.push({
			socketID: socket.id,
			userId,
			user: data.user,
			userPic: data.userPic
		});

		//Join the room channel
		socket.join(data.roomId);

		// return Room object
		return getRoom;
	}
}

module.exports = {
	route,
	findOne, 
	createUser,
	findById,
	isAuthenticated,
	findRoomByName,
	randomHex,
	findRoomById,
	addUserToRoom
}