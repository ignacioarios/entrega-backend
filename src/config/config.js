
export const config = {
    PORT: process.env.PORT || 8080,
    MOONGODB: process.env.MOONGODB || "mongodb+srv://ignaciorios591:nachonacho@riosignacio.wsfbe.mongodb.net/?retryWrites=true&w=majority&appName=RiosIgnacio",
    SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
    DBNAME: process.env.DBNAME || 'Ecommerce',
}