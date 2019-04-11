const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
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
            const result = await user_1.save();
            return { ...result._doc, password: null, _id: result.id };
        }
        catch (err) {
            throw err;
        }
    },
    login: async (args) =>{
        const email = args.email;
        const password = args.password;
        const user = await User.findOne({email:email});
        if(!user) {
            throw new Error("User does not exists!")
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if(!isEqual) {
            throw new Error("User password is incorrect!")
        }
        const token = jwt.sign({userId: user.distinct, email: user.email}, 'somesupersecretkey', {expiresIn: '1h'});
        console.log(token);
        return {userId: user.id, token:token , tokenExpiration: 1};
    }
}