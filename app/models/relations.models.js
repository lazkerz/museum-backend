import Kategori from "./kategori.models.js";
import Budaya from "./budaya.models.js";
import Makanan from "./makanan.model.js";
import Resep from "./resep.model.js";

export const relations = () => {

    //Start Budaya dan Kategori
    Kategori.hasMany(Budaya, { 
        foreignKey: 'kategori_id',
        as: 'budayas'
    });

    Budaya.belongsTo(Kategori, {
        foreignKey: 'kategori_id',
        as: 'kategoris'
    });
    //End Budaya dan Kategori

    //Start Makanan dan Kategori
    Kategori.hasMany(Makanan, { 
        foreignKey: 'kategori_id',
        as: 'makanans'
    }); 
    Makanan.belongsTo(Kategori, {
        foreignKey: 'kategori_id',
        as: 'kategoris'
    });
    //End Makanan dan Kategori 
    
    //Start Makanan dan Resep
    Resep.hasOne(Makanan, { 
        foreignKey: 'resep_id',
        as: 'makanans'
    }); 
    Makanan.belongsTo(Resep, {
        foreignKey: 'resep_id',
        as: 'resep'
    });
    //End Makanan dan Resep

}