const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return { ...event._doc, date: new Date(event._doc.date).toISOString() ,creator: user.bind(this, event.creator) };
        });
    }
    catch (err) {
        throw err;
    }
}

const user = async userId => {
    const user = await User.findById(userId);
    return { ...user._doc, createdEvents: events.bind(this,user._doc.createdEvents) };
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return { ...event._doc, creator: user.bind(this,event.creator)};
    } catch (error) {
        throw error;
    }
}

module.exports = {
    events: async () => {
        try {
            const res = await Event.find();
            return res.map(event => {
                return { ...event._doc, date: new Date(event._doc.date).toISOString() ,creator: user.bind(this, event._doc.creator) };
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { ...booking._doc, 
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this,booking._doc.event),
                    createdAt: new Date( booking._doc.createdAt ).toDateString(),
                    updateAt: new Date( booking._doc.updateAt ).toDateString()
                }
            })
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5cada95bfa5a6918c6f96b6d'
        });
        let createdEvent;
        try{
            const res = await event.save()
            createdEvent = {...res._doc , creator: user.bind(this, res._doc.creator), date: new Date(event._doc.date).toISOString()};
            const userloc = await User.findById('5cada95bfa5a6918c6f96b6d');
            if(!userloc){
                throw new Error('Cant find User');
            }
            userloc.createdEvents.push(event);
            await userloc.save();
            return createdEvent;
        }
        catch (err) {
            throw err;
        } 
    },
    createUser: async (args) => {
        try {
            const user = await User.findOne({email: args.userInput.email});
            if (user) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user_1 = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = user_1.save();
            return { ...result._doc, password: null };
        }
        catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const eventdata = await Event.findOne({_id: args.eventId});
            const booking = new Booking({
                user: "5cada95bfa5a6918c6f96b6d",
                event: eventdata
            });
            const res = await booking.save();
            return { ...res._doc, 
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this,booking._doc.event),
                createdAt: new Date( res._doc.createdAt ).toDateString(),
                updateAt: new Date( res._doc.updateAt ).toDateString()
            };
        } catch (error) {
            throw error;
        }
        
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                creator: user.bind(this,booking.event._doc.creator)};
            console.log(event);
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
}