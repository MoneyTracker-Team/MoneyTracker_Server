import { typeSpendValidate } from '../helpers/validation.js';
import createError from 'http-errors';
import TypeSpend from '../model/typeSpend.model.js';
import Spend from '../model/spend.model.js';
import { storeImg, removeImg } from '../helpers/cloudinary.js';
import getFileNameFromURL from '../helpers/getFileName.js';

export default {
  getAllTypeSpendByUser: async (userId) => {
    try {
      const data = await TypeSpend.find({ userId });
      return Promise.resolve(data);
    } catch (err) {
      throw createError.BadRequest(err);
    }
  },

  createNewTypeSpend: async (newType) => {
    try {
      // validate data
      const { error } = typeSpendValidate({ userId: newType.userId, name: newType.name, isDaily: newType.isDaily });
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }
      const { image } = newType;
      if (image) {
        try {
          const img = await storeImg(image);
          newType.image = img.url;
        } catch (err) {
          throw err;
        }
      }
      // create
      const data = await TypeSpend.create(newType);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateTypeSpend: async (id, newType) => {
    try {
      const { image } = newType;
      if (image) {
        try {
          //* remove image
          (async () => {
            const data = await TypeSpend.findOne({ _id: id }, { image: 1 });
            if (data?.image) {
              const fileName = getFileNameFromURL(data.image);
              if (fileName !== 'default-image_bsoxjb') {
                try {
                  removeImg(data.image);
                } catch (err) {
                  return;
                }
              }
            }
          })();
          //* store new image
          const img = await storeImg(image);
          newType.image = img.url;
        } catch (err) {
          throw err;
        }
      }
      const data = await TypeSpend.updateOne({ _id: id }, newType);
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },

  deleteTypeSpendById: async (id) => {
    try {
      // delete all spend reference to this type spend
      const spendDeleted = await Spend.deleteMany({ typeId: id });
      // delete type spend
      let deleteTypeSpend = await TypeSpend.findByIdAndDelete({ _id: id });

      return Promise.resolve({ spendDeleted, typeSpendDeleted: deleteTypeSpend });
    } catch (err) {
      throw createError.NotFound(err);
    }
  },
};
