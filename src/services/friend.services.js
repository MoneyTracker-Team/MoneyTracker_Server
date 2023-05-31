import Friend from '../model/friend.model.js';
import Loan from '../model/loan.model.js';
import Spend from '../model/spend.model.js';

export default {
  getAllFriendOfUser: async (userId) => {
    try {
      const data = await Friend.find({ userId });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewFriend: async (newFriend) => {
    try {
      const data = await Friend.create(newFriend);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateFriendById: async (id, newFriend) => {
    try {
      const data = await Friend.updateOne({ _id: id }, newFriend);
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },

  deleteFriendById: async (id) => {
    try {
      //todo: delete all loan reference to this friend
      let deleteLoanRef = () => {
        return new Promise(async (resolve) => {
          const data = await Loan.deleteMany({ debtorId: id });
          return resolve(data);
        });
      };
      //todo: delete all spend reference to this friend
      let deleteSpendRef = () => {
        return new Promise(async (resolve) => {
          const data = await Spend.updateMany({}, { $pull: { userId: id } });
          return resolve(data);
        });
      };

      //todo: delete this friend
      let deleteFriend = () => {
        return new Promise(async (resolve) => {
          const data = await Friend.deleteOne({ _id: id });
          return resolve(data);
        });
      };

      const data = await Promise.all([deleteLoanRef(), deleteSpendRef(), deleteFriend()]);
      return Promise.resolve({
        loanDeleted: data[0].deletedCount,
        friendInSpendDeleted: data[1].modifiedCount,
        friendDeleted: data[2].deletedCount,
      });
    } catch (err) {
      throw err;
    }
  },
};
