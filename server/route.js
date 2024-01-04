const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// Connection URL for your MongoDB database
//const url = "mongodb+srv://lakshin2563:nirma123@cluster0.qtmkizi.mongodb.net/?retryWrites=true&w=majority";

const url = "mongodb+srv://lakshinpathak2003:nirma123@cluster0.53mqvik.mongodb.net/?retryWrites=true&w=majority";
// Name of the database
const dbName = 'Lakshin25'; // Change this to your database name

// Create a MongoDB client outside of the route handlers
//const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//"mongodb://localhost:27017"

// Define a route for handling registration requests
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Connect to MongoDB
    await client.connect();
    
  

    // Access the database
    const db = client.db(dbName);


    console.log('');

    // Check if the username already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists. Please choose a different one.' });
    }

    // Insert the new user into the database
    await db.collection('users').insertOne({ username, password });

    // Respond with a success message
    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});



router.get('/getAllEvents', async (req, res) => {
  try {
    const { user } = req.query;

    await client.connect();
    const db = client.db(dbName);

    // Fetch all events for the logged-in user
    const userEvents = await db.collection('events').find({ username: user }).toArray();

    res.json(userEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
  }
});



// Define a route for handling login requests
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Connect to MongoDB
    await client.connect();
    //console.log('ok');
    // Access the database
    const db = client.db(dbName);

    // Check if the username exists
    const existingUser = await db.collection('users').findOne({ username });
    if (!existingUser) {
      return res.json({ success: false, message: 'Username not found. Please register first.' });
    }

    // Validate password
    if (existingUser.password !== password) {
      return res.json({ success: false, message: 'Incorrect password.' });
    }

    // Respond with a success message
    res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});


router.route('/addEvent')
  .get(async (req, res) => {
    try {
      const { user } = req.query;

      await client.connect();
      const db = client.db(dbName);
      console.log(user);
      const userEvents = await db.collection('events').find({ username: user }).toArray();
      res.json(userEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  })
  .post(async (req, res) => {
    try {
      const { username, eventName, eventDate, eventDetails } = req.body;
      console.log('haha');
      await client.connect();
      const db = client.db(dbName);

      const existingUser = await db.collection('users').findOne({ username });
      if (!existingUser) {
        return res.json({ success: false, message: 'User not found. Please register first.' });
      }

      // Check if the event name already exists for the current user
      const existingEvent = await db.collection('events').findOne({ username, eventName });
      if (existingEvent) {
        return res.json({ success: false, message: 'Event name already exists. Please choose a different one.' });
      }

      await db.collection('events').insertOne({ username, eventName, eventDate, eventDetails });

      res.json({ success: true, message: 'Event registration successful!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  });


// Route for handling event deletion
router.delete('/deleteEvent', async (req, res) => {
  try {
  //  console.log("delete this fast!!");
    const { user, eventName } = req.query;

    await client.connect();
    const db = client.db(dbName);

    const result = await db.collection('events').deleteOne({ username: user, eventName: eventName });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Event deleted successfully!' });
    } else {
      res.json({ success: false, message: 'Event not found or already deleted.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
  }
});


//Define a route for handling events update requests
router.post('/updateevent', async (req, res) => {
  try {
    const { username, eventDetails, eventDate, eventName } = req.body;

    // Connect to MongoDB
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Access the database
    const db = client.db(dbName);

    // Update user settings in the collection
    const result = await db.collection('events').updateOne(
      { username: username, 'events.eventName': eventName },
      {
        $set: {
          'events.$.eventDetails': eventDetails,
          'events.$.eventDate': eventDate,
        },
      }
    );

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
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});



// Define a route for handling settings update requests
router.post('/settings', async (req, res) => {
    try {
      const { username, newEmail, newPassword } = req.body;
       
      // Connect to MongoDB
      const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database
      const db = client.db(dbName);
  
      // Update user settings in the collection
      const result = await db.collection('users').updateOne(
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
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  });

module.exports = router;
