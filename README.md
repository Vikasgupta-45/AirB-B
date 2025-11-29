AirB-B is a full-stack MERN-based web application inspired by Airbnb.
It allows users to browse, create, edit, and manage rental listings with full authentication, image upload, and map integration.

🚀 Features
🏡 Listings

Add new rental listings

Edit & delete listings

View detailed property pages

Upload multiple images

Category-based filtering

👤 User Authentication

Secure login & registration

Password hashing with bcrypt

Sessions stored in MongoDB using connect-mongo

🗺 Map Integration

Interactive Mapbox map for each listing

Shows exact location

Custom map controls & styling

📦 Tech Stack

Frontend: HTML, EJS, CSS, Bootstrap

Backend: Node.js, Express.js

Database: MongoDB Atlas

ORM: Mongoose

Authentication: Passport.js

Storage: Cloudinary (image hosting)

Maps: Mapbox

📁 Project Structure
AirB-B/
│── models/
│── routes/
│── controllers/
│── public/
│── views/
│── init/
│── node_modules/
│── app.js
│── package.json
│── README.md

🔧 Setup Instructions
1️⃣ Clone the repo
git clone https://github.com/Vikasgupta-45/AirB-B.git
cd AirB-B

2️⃣ Install dependencies
npm install

3️⃣ Add your .env file

Create a file named .env:

ATLASDB_URL=your_mongodb_atlas_url
SECRET=your_session_secret
MAP_TOKEN=your_mapbox_token
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_secret

4️⃣ Start the server
node app.js


App runs at:
👉 http://localhost:8080

🛠 Seed the Database

To load sample listings:

node init/index.js
