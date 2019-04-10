const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: async () => {
            try {
                const res = await Event.find();
                return res.map(event => {
                    return { ...event._doc };
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
                createdEvent = {...res._doc };
                const user = await User.findById('5cada95bfa5a6918c6f96b6d');
                if(!user){
                    throw new Error('Cant find User');
                }
                user.createdEvents.push(event);
                await user.save();
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
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-pdnrl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
.then(() => {
    app.listen(3024);
}).catch(err => {
    console.log(err);
});
