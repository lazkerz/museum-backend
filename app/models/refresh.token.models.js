import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

const RefreshToken = sequelize.define('refresh_tokens', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER
    },
});


export default RefreshToken;