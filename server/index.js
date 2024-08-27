import express from 'express'
import dotenv from 'dotenv'
import mysql from 'mysql'

const app = express()
dotenv.config()

app.use(express.json())

const PORT = process.env.PORT || 5000;
const password = process.env.PASSWORD

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password,
    database: "cities_data"
})

const convertToResponseObject = dbObject => {
    return {
        id: dbObject.id,
        cityName: dbObject.city_name,
        population: dbObject.population,
        latitude: dbObject.latitude,
        longitude: dbObject.longitude
    }
}

app.get("/", (req, res) => {
    res.json("Welcome to the CITIES API server side Application!!")
})

app.get("/allCities", (req, res) => {
    const getBooksQuery = "SELECT * FROM cities_list";
    db.query(getBooksQuery, (err, data) => {
        if (data) {

            return res.json(data)
        }
        return res.json("Enter correct URL")


    })
})

app.post("/createCity", (req, res) => {
    const createCityQuery = "INSERT INTO cities_list (`city_name`, `population`, `country`, `longitude`, `latitude`) VALUES (?)"
    const values = [
        req.body.city_name,
        req.body.population,
        req.body.country,
        req.body.longitude,
        req.body.latitude
    ]
    db.query(createCityQuery, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("City Created Successfully!")
    })


})

app.delete("/cities/:id", (req, res) => {
    // const cityId = req.params.id
    const deleteCityQuery = `DELETE FROM cities_list WHERE id = ${req.params.id}`

    db.query(deleteCityQuery, (err, data) => {
        if (err) return res.json(err)
        return res.json("Deletion of city has been Successfull!")
    })
})


app.put("/cities/:id", (req, res) => {
    const values = [
        req.body.city_name,
        req.body.population,
        req.body.country,
        req.body.longitude,
        req.body.latitude
    ]

    const cityId = req.params.id
    const updateCityQuery = "UPDATE cities_list SET city_name = ? , population = ?, country = ?, longitude = ?, latitude = ? WHERE id = ?";

    db.query(updateCityQuery, [...values, cityId], (err, data) => {
        if (err) return res.json(err)
        return res.json("City is Updated Successfully!!")
    })
})


app.get("/city/:id", (req, res) => {
    const cityId = req.params.id
    const getEachCityQuery = "SELECT * FROM cities_list WHERE id = ?";


    db.query(getEachCityQuery, [cityId], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })

})

app.get("/cities", (req, res) => {
    const {
        offset = 0,
        limit = 10,
        order = "ASC",
        order_by = "city_name",
        search_city = ""

    } = req.query


    const getBooksQuery = `
        SELECT * FROM cities_list
        ORDER BY ${order_by} ${order}
        LIMIT ${limit} OFFSET ${offset}
    `
    db.query(getBooksQuery, (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})

app.listen(PORT, () => {
    console.log("Connection to the Server is Established!!")
})