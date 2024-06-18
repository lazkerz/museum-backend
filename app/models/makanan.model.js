import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Kategori from "./kategori.models.js";
import Resep from "./resep.model.js";

const Makanan = sequelize.define("makanans", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    nama_makanan: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    resep_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Resep,
            key: 'id',
        }
    },
    kategori_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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

export default Makanan;