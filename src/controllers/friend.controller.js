import friendServices from '../services/friend.services.js';

export default {
  getAllFriendOfUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await friendServices.getAllFriendOfUser(userId);
      res.status(200).json({
        status: 200,
        message: 'get all friend of user success',
        data: { friends: data },
      });
    } catch (err) {
      next(err);
    }
  },

  createNewFriend: async (req, res, next) => {
    try {
      const { userId, name, image, isTemporaty } = req.body;
      const newFriend = { userId, name, image, isTemporaty };
      const data = await friendServices.createNewFriend(newFriend);
      res.status(201).json({
        status: 201,
        message: 'create new friend success',
        data: { newFriend: data },
      });
    } catch (err) {
      next(err);
    }
  },

  updateFriend: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;
      const newFriend = { name, image };
      const data = await friendServices.updateFriendById(id, newFriend);
      res.status(200).json({
        status: 200,
        message: 'updated friend success',
        data: { updated: data },
      });
    } catch (err) {
      next(err);
    }
  },

  deleteFriend: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await friendServices.deleteFriendById(id);
      res.status(200).json({
        status: 200,
        message: 'deleted friend success',
        data: { deleted: data },
      });
    } catch (err) {
      next(err);
    }
  },
};
