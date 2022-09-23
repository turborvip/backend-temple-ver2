/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      username: { type: 'string', allowNull: true, unique: true, isNotEmptyString: true, },
      password: { type: 'string', allowNull: true, isNotEmptyString: true, },
      name: { type: 'string', allowNull: false, },
      email: { type: 'string', allowNull: false, isEmail: true },
      status: { type: 'boolean', allowNull: false, },
  },

};

