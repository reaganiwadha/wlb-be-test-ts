import { Sequelize } from 'sequelize'

if(!process.env.PG_CONN){
    console.error('PG_CONN is not provided!')
    process.exit()    
}

const sequelize = new Sequelize(process.env.PG_CONN, {
    define : {
        underscored : true,
        createdAt : 'created_at',
        updatedAt : 'updated_at'
    }
})
export default sequelize
