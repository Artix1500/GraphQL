const bcrypt = require('bcryptjs');
const User = require('../../models/user');

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
            const result = user_1.save();
            return { ...result._doc, password: null };
        }
        catch (err) {
            throw err;
        }
    }
}