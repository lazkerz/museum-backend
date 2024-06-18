import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Kategori from "./kategori.models.js";

const Budaya = sequelize.define("budayas", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    nama_budaya: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    kategori_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Kategori,
            key: 'id',
        }
    },
    media: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('media');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value){
            this.setDataValue('media', JSON.stringify(value));
        }
    },
    lokasi: {
        type: DataTypes.STRING(150),
        allowNull: true,
    }
});

export default Budaya;