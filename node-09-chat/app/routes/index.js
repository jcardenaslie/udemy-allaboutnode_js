'user strict';

const h = require('../helpers');
const passport = require('passport');
const config = require('../config');

module.exports = () => {
    let routes = {
        'get': {
            '/': (req, res, next) => {
                res.render('login');
            },
            '/rooms': [ h.isAuthenticated, (req, res, next) => {
                // find a chatroom with thegiven id
                // render it if the id is found
                res.render('rooms', {
                    user : req.user,
                    host: config.host
                });
            }],
            '/chat/:id': [ h.isAuthenticated, (req, res, next) => {
                let getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);
                if (getRoom === undefined){
                    next();
                } else {
                    res.render('chatroom', {
                        user : req.user,
                        host: config.host,
                        room: getRoom.room,
                        roomId: getRoom.roomId
                    } );
                }
            }],
            '/auth/facebook': passport.authenticate('facebook'),
            '/auth/facebook/callback': passport.authenticate('facebook', {
                successRedirect: '/rooms',
                failureRedirect: '/'
            }),
            '/logout' : (req, res, next) => {
                req.logout();
                res.redirect('/');
            }
        },
        'post': {

        },
        'NA': (req, res, next) => {
            res.status(404).sendFile(process.cwd() + '/views/404.htm');
        }
    }

    return h.route(routes);
}