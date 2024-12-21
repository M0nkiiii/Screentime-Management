const User = require('./User');
const UsageData = require('./UsageData');

// Define associations here
User.hasMany(UsageData, { foreignKey: 'userId', as: 'usages' });
UsageData.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export models for use in other parts of the application
module.exports = {
    User,
    UsageData,
};
