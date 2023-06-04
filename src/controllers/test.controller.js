import { storeImg, removeImg } from '../helpers/cloudinary.js';

export default {
  upLoad: async (req, res, next) => {
    try {
      const { imgData } = req.body;
      const data = await storeImg(imgData);
      res.status(200).json({
        status: 200,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const { imgUrl } = req.body;
      const data = await removeImg(imgUrl);
      res.status(200).json({
        status: 200,
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
