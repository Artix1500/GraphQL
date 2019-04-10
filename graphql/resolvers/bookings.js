const Booking = require('../../models/booking');
const Event = require('../../models/event')
const {user , singleEvent, transformEvent} = require("./merge");

module.exports = {
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
            const event = transformEvent(booking.event);
            console.log(event);
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
}