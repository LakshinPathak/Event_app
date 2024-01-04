const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb' }));
//const { MongoClient } = require('mongodb');
const port = 3000;
app.use(cors());

//const uri = "mongodb+srv://lakshin2563:nirma123@cluster0.qtmkizi.mongodb.net/?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//"mongodb://localhost:27017"
//"mongodb://localhost:27017/Lakshin1234"
const uri = "mongodb+srv://lakshinpathak2003:nirma123@cluster0.53mqvik.mongodb.net/?retryWrites=true&w=majority";
//mongodb+srv://lakshinpathak2003:<password>@cluster0.53mqvik.mongodb.net/
app.use(express.static('public'));
app.use(express.json());


async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

// Mongoose model for user
const User = mongoose.model('User', {
    username: String,
    password: String,
    email: String, // Add email field for user settings
});



const Event = mongoose.model('Event', {
    eventName: String,
    eventDetails: String,
    eventDate: String,
    loggedInUser: String,
});



// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: 'Username already exists. Please choose a different one.' });
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        return res.json({ success: true, message: 'Registration successful.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



// Update Event endpoint
app.post('/updateevent', async (req, res) => {
    const { username, eventDetails, eventDate, eventName } = req.body;

    try {
        console.log(username+" "+eventDetails);

        // Update user settings in the collection
        const result = await Event.updateOne(
            { loggedInUser: username, eventName: eventName },
            {
                //eventName
                $set: {
                    eventDetails: eventDetails,
                    eventDate: eventDate,
                },
            }
        );
            console.log(result);

        if (result.modifiedCount > 0) {
            // Event updated successfully
            res.json({ success: true, message: 'Event updated successfully!' });
        } else {
            // No matching user or event found or no changes made
            res.json({ success: false, message: 'No matching user or event found or no changes made.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.json({ success: false, message: 'Username not found. Please register first.' });
        }

        // Validate password
        if (existingUser.password !== password) {
            return res.json({ success: false, message: 'Incorrect password.' });
        }

        return res.json({ success: true, message: 'Login successful.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Settings update endpoint
app.post('/settings', async (req, res) => {
    const { username, newEmail, newPassword } = req.body;

    try {
        // Update user settings in the collection
        const result = await User.updateOne(
            { username: username },
            { $set: { email: newEmail, password: newPassword } }
        );

        if (result.modifiedCount > 0) {
            // Settings updated successfully
            res.json({ success: true, message: 'Settings updated successfully!' });
        } else {
            // No matching user found or no changes made
            res.json({ success: false, message: 'No matching user found or no changes made.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// Add Event endpoint
app.post('/addEvent', async (req, res) => {
    const { eventName, eventDetails, eventDate, loggedInUser } = req.body;

    try {
        // Check if an event with the same name already exists for the loggedInUser
        const existingEvent = await Event.findOne({ eventName, loggedInUser });
        if (existingEvent) {
            return res.json({ success: false, message: 'Event with the same name already exists for the user.' });
        }

        // Create a new event
        const newEvent = new Event({
            eventName,
            eventDetails,
            eventDate,
            loggedInUser,
        });

        // Save the new event
        await newEvent.save();

        return res.json({ success: true, message: 'Event added successfully', event: newEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Delete Event endpoint
app.delete('/deleteEvent', async (req, res) => {
   //console.log("haha2");
    const { eventName, loggedInUser } = req.body;

    try {
       // console.log(eventName+" "+loggedInUser);
        // Find the event in the collection and delete it
        const result = await Event.deleteOne({ eventName, loggedInUser });
       // console.log(result.deletedCount);
        if (result.deletedCount > 0) {
            // Event deleted successfully
            
           // console.log("klr");

            res.json({ success: true, message: 'Event deleted successfully' });
        } else {
            // No matching event found
            res.json({ success: false, message: 'No matching event found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/getAllEvents', async (req, res) => {
    try {
        const { loggedInUser } = req.query;

       
        // Fetch all events for the logged-in user
        const userEvents = await Event.find({ loggedInUser }).exec();
       // console.log(userEvents);
        res.json(userEvents);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});
