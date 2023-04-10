require('dotenv').config();
const { name } = require('ejs');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Schema = mongoose.Schema 

const carSchema = new mongoose.Schema({
    carId:{ type:String, required: true},
    license_plate: { type: String, required: true},
    timeEntry:{ type: Date, required: true, default: Date.now},
    timeExit:{ type: Date, required: false, default: Date.now},
    parkingFee:{ type: String, required: false },
    historyStatus: {type: Boolean, required:false}, //Check the car is in the car park or not
    paymentStatus: {type: Boolean, required:false} //Check the payment status, PAID/ NOT PAID?
})


const Car = mongoose.model('Car', carSchema)

let nextCarId = 0;
Car.find().then(cars =>{
    var latestId = 0;
    for(var count= 0; count< cars.length ; count++){
      var id = Number(cars[count].carId)
      if(id < latestId){
        latestId = id;
      }
      nextCarId = id + 1;
    }
})

router.post('/addCar', (req, res, next) => {
  new Car({ carId: '' + nextCarId, license_plate: req.body.license_plate, timeEntry: new Date().toISOString(), timeExit: null, parkingFee: null })
    .save()
    .then(result => {
      nextCarId++
      console.log('saved car to database')
    })
    .catch(err => {
      console.log('failed to add a car: ' + err)
    })
})
router.get('/', (req, res, next) => {
  Car.find() // Always returns an array
    .then(cars => {
      res.json(cars)
    })
    .catch(err => {
      console.log('Failed to find: ' + err)
      res.json({'Car': []})
    })
})

router.post('/getSpecificCar', (req, res, next) => {
  Car.find({ license_plate: req.body.license_plate}) // Always returns an array
    .then(cars => {
      if (cars) {
        res.json(cars); // Send the car as a JSON object
      } else {
        res.status(404).send('No car found');
      }
    })
    .catch(err => {
      console.log('Failed to find car: ' + err)
      res.send('No car found')
    })
})

router.put('/updateSpecificCar', (req, res, next) => {
  Car.find({ license_plate: req.body.license_plate}) // Always returns an array
    .then(cars => {
      let specificCar = cars[0] // pick the first match

      if (req.body.timeExit != null) {
        specificCar.timeExit = new Date(req.body.timeExit) 
      }
      if (specificCar.timeEntry != null && specificCar.timeExit != null) { // check both timeEntry and timeExit
        specificCar.parkingFee = calculateParkingFee(specificCar.timeEntry, specificCar.timeExit) 
      }
      specificCar.save((err) => {
        if (err) {
          console.log('Failed to update car: ' + err)
          res.send('Failed to update car')
        } else {
          console.log('Updated car!')
          res.send('Car updated successfully')
        }
      })
    })
    .catch(err => {
      console.log('Failed to find car: ' + err)
      res.send('No car found')
    })
})

router.delete('/deleteSpecificCar', (req, res, next) => {
  Car.findOneAndRemove({ license_plate: req.body.license_plate}) 
    .then(resp => {
      //res.redirect('/')
      console.log('deleted car from database')
    })
    .catch(err => {
      console.log('Failed to find car: ' + err)
      res.send('No car found')
    })
})

router.post('/pay', async (req,res) =>{
  parkingFee = req.body.parkingFee

  try{
    if(!parkingFee) return res.status(400).json({message: 'Parking Fee not calculated '});
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parkingFee,//already Math.floor
      currency: 'EUR',
      payment_method_types: [
        'card',
        // 'us_bank_account',
        // 'klarna',
        // 'afterpay_clearpay',
        // 'affirm',
      ],
      metadata:{parkingFee}
    })

    const clientSecret = paymentIntent.client_secret;
    res.json({message: 'Payment initiated', clientSecret});
  }
  catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'})
  }
})

function calculateParkingFee(entryTime, exitTime) {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24

  const entryDate = new Date(entryTime)
  const exitDate = new Date(exitTime)
  const timeDiff = exitDate - entryDate

  const days = Math.floor(timeDiff / msPerDay)
  const hours = Math.floor((timeDiff % msPerDay) / msPerHour)
  const minutes = Math.floor((timeDiff % msPerHour) / msPerMinute)

  const totalHours = days * 24 + hours + minutes / 60
  const roundedHours = Math.floor(totalHours) // round down to nearest hour
  const parkingFee = roundedHours * 10

  return parkingFee
}

exports.routes = router