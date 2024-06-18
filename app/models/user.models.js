import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("users", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    username: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING(250),
        allowNull:false,
    }
});

export default User;