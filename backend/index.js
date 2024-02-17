const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const mongoose = require('mongoose');
const cors=require('cors')

const app = express();
app.use(express.json());
app.use(cors());

// Define Zod schema for input validation
const userSchema = z.object({
  fullName: z.string().min(3,{message: "Name must be at least of 3 chars"}),
  email: z.string().email(),
  phoneNumber: z.string().min(10,{ message: "Phone number must be at least of 10 chars" }),
  password: z.string().min(6,{message:"Password must be at least of 6 chars"}),
});

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/LoginSystem2';

// Connect to MongoDB with Mongoose
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define user schema and model
const userMongooseSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true }, // Ensure email uniqueness
  phoneNumber: String,
  password: String,
  admin: { type: Boolean, default: false } // Add admin field with default value
});
const User = mongoose.model('User', userMongooseSchema);

//Define service schema and model
const serviceMongooseSchema=new mongoose.Schema({
  service: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  provider: { type: String, required: true },
})
const Service=mongoose.model('Service',serviceMongooseSchema)

//Define service schema and model
const contactMongooseSchema=new mongoose.Schema({
  fullName:{type:String,required:true},
  email:{type:String,required:true},
  message:{type:String,required:true}
})
const Contact=mongoose.model('Contact',contactMongooseSchema)

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const userData = userSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(userData.password, 10);

    // Create user object
    const newUser = new User({
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      // Check if the error is a Zod validation error
      if (error instanceof z.ZodError) {
        // Extract error messages from the ZodError and send them as a response
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ errors: errorMessages });
      } else {
        // Handle other errors (e.g., database errors)
        console.error('Registration failed:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, email: user.email }, 'secret_key', {
    expiresIn: '1h',
  });

  res.json({ token:token,admin:user.admin });
  } catch (error) {
    console.log(error)
  }
});

// Profile endpoint
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user profile
    res.json({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      admin: user.admin
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users', authenticateToken, async (req, res) => {
    try {
      // Ensure the user making the request is an admin
      // if (!req.user.admin) {
      //   console.log('User not admin')
      //   return res.status(403).json({ error: 'Access forbidden' });
      // }
    
      // Fetch all users from the database
      const users = await User.find({}, '-password'); // Exclude the password field
    
      res.json(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete user endpoint
app.delete('/users/:id', authenticateToken, async (req, res) => {
  try {

    const userId = req.params.id;

    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new route handler for fetching a user by ID
app.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user profile
    res.json(user);
  } catch (error) {
    console.error('Failed to fetch user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Update user endpoint
app.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    // // Ensure the user making the request is an admin
    // if (!req.user.admin) {
    //   return res.status(403).json({ error: 'Access forbidden' });
    // }

    const userId = req.params.id;
    const { fullName, email, phoneNumber, admin } = req.body;

    // Find the user by ID and update the information
    const updatedUser = await User.findByIdAndUpdate(userId, { fullName, email, phoneNumber, admin }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Service endpoint
app.get('/service',async(req,res)=>{
  try {
    const response=await Service.find();
        if(!response){
            res.status(404).json({msg:'No service found'});
            return;
        }
        res.status(200).json({response})
  } catch (error) {
    console.log('Error in service controller',error)
  }
})

// contact endpoint
app.post('/contact',async(req,resp)=>{
  try {
    // Validate request body
    const { fullName, email, message } = req.body;

    // Create contact message
    const newContact = new Contact({ fullName, email, message });
    await newContact.save();

    resp.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod validation error
      const errorMessages = error.errors.map(err => err.message);
      resp.status(400).json({ errors: errorMessages });
    } else {
      // Other errors
      console.error('Failed to send message:', error);
      resp.status(500).json({ error: 'Internal server error' });
    }
  }
})

//get Contact endpoint
app.get('/contactDetails',authenticateToken,async(req,res)=>{
  try {
    const response=await Contact.find();
        if(!response){
            res.status(404).json({msg:'No contact details found'});
            return;
        }
        res.status(200).json({response})
  } catch (error) {
    console.log('Error in contactDetails controller',error)
  }
})

// Delete user endpoint
app.delete('/contactDetails/:id', async (req, res) => {
  try {

    const contactId = req.params.id;

    // Find the user by ID and delete it
    const deletedUser = await Contact.findByIdAndDelete(contactId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
