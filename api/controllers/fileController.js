const DAO = require('../../controller/DAO')


class fileController{

    //?
    //? --Auth--
    //?


    static async signup(req, res){
        try{

        }catch(error){
            res.status(500).json({"message" : error})
            console.error(error)
        }
    }


}


module.exports = fileController