const {transformEvent} = require("./merge");
const Event = require('../../models/event');

module.exports = {
    events: async () => {
        try {
            const res = await Event.find();
            return res.map(event => {
                return transformEvent(event);
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
            createdEvent = transformEvent(res);
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
    }
}