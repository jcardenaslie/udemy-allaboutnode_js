'user strict';

const router = require('express').Router();
const db = require('../db');

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
	console.log("FindOne")
	return db.userModel.findOne({
		'profileId': profileId
	});
}

let createUser = profile => {
	console.log("Creating User ", profile)
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

module.exports = {
	route,
	findOne, 
	createUser,
	findById
}