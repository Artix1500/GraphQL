const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

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
    }
}