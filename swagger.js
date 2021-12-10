"use strict"
const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: "10.114.32.74/culinari",
    schemes: ["http", "https"],
    definitions: {
        recipeList : ['#/definitions/recipe'],
        recipe: {
            name: {example: "Instant noodle soup", type: "string"},
            desc: {example: "a tasty soup made quickly", type: "string"},
            steps: {
                description: "The array of steps required to reproduce the recipe",
                example: [
                    {
                        order: 0,
                        content: "Open the bag of noodles"
                    }
                ]
            },
            ingredients: {
                description: "The array of ingredients required to reproduce the recipe",
                example: [
                    {
                        name: "Instant noodles",
                        amount: "1",
                        unit: "bags"
                    }
                ]
            }
        },
        user: {   
            name: {example: "John doe", type: "string"},
            email: {example: "John.doe@mail.com", type: "string"},
            role: {example: 0, type: "integer"},
            score: {example: 400, type: "integer"},
        },
        password: {
            example: "p@s5w0rD",
            type: "string"
        }

    }
}
swaggerAutogen(outputFile, endpointsFiles, doc)