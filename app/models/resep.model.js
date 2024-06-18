import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Resep = sequelize.define("resep", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    bahan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    cara_memasak: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    penyajian: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    keunikan: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

export default Resep;
