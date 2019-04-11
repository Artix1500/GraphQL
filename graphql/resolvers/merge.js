const User = require('../../models/user');
const Event = require('../../models/event')

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    }
    catch (err) {
        throw err;
    }
};

const user = async userId => {
    const user = await User.findById(userId);
    return { ...user._doc, createdEvents: events.bind(this,user._doc.createdEvents) };
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (error) {
        throw error;
    }
};

const transformEvent = event => {
    return {
        ...event._doc, 
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator) 
    };
};

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;