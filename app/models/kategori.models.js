import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Kategori = sequelize.define("kategoris", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    kategori: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
});

export default Kategori;