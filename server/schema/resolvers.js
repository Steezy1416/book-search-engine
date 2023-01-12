const { User } = require("../models")
const { signToken } = require("../utils/auth")

const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (context.user) {
                const userDate = await User.find({ _id: context.user._id })
                    .select("-__v -password")
                return userDate
            }
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)
            return { token, user }
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            const token = signToken(user)

            return { token, user }
        },
        saveBook: async (_, { newBook }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: newBook } },
                    { new: true }
                )
                return updatedUser
            }
        },
        removeBook: async (_, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )
                return updatedUser
            }
        },
    },
}

module.exports = resolvers