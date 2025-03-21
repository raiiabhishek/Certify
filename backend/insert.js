// insert.js
require("dotenv").config();
const mongoose = require("mongoose");
const Template = require("./models/templateModel");

const MONGO_URI = process.env.mongo_connect;

if (!MONGO_URI) {
  console.error("MongoDB connection string not found in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const templatesData = [
  {
    name: "Education Template",
    type: "education",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Certificate of Education</h1>
            <p style="font-size: 1.2em; color: #555;">Awarded to</p>
        </div>
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{studentName}}</h2>
            <p style="font-size: 1.2em; color: #555;">for successfully completing</p>
            <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{courseName}}</h3>
            <p style="font-size: 1.2em; color: #555;">{{institutionName}}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        
        <div style="text-align: left;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Date: {{date}}</p>
                
                </div>
            <div style="text-align: right;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Signature:</p>
                <div style="height: 50px; border-bottom: 1px solid #000;"></div> 
                <p style="font-size: 1em; color: #777;">{{principal}}</p>
            </div>
        </div>
       </div>
    </div>`,
  },
  {
    name: "Seminar Template",
    type: "seminar",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Seminar Invitation</h1>
            <p style="font-size: 1.2em; color: #555;">You are invited to attend</p>
        </div>
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{seminarTitle}}</h2>
             <p style="font-size: 1.2em; color: #555;">Presented by</p>
            <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{speakerName}}</h3>
            <p style="font-size: 1.2em; color: #555;">at {{seminarVenue}} on {{seminarDate}}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="text-align: left;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Contact:</p>
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">{{contact}}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Organized by:</p>
                    <div style="height: 50px; border-bottom: 1px solid #000;"></div> 
                    <p style="font-size: 1em; color: #777;">{{organizer}}</p>
            </div>
        </div>
       </div>
    </div>`,
  },
  {
    name: "Training Template",
    type: "training",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Training Confirmation</h1>
            <p style="font-size: 1.2em; color: #555;">You have enrolled to</p>
        </div>
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{trainingTopic}}</h2>
            <p style="font-size: 1.2em; color: #555;">Starting at</p>
            <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{startDate}}</h3>
            <p style="font-size: 1.2em; color: #555;">Ending at {{endDate}} at {{trainingLocation}}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
         <div style="text-align: left;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Trainer:</p>
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">{{trainerName}}</p>
                
                </div>
          <div style="text-align: right;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Contact:</p>
                 <div style="height: 50px; border-bottom: 1px solid #000;"></div>
                <p style="font-size: 1em; color: #777;">{{contact}}</p>
            </div>
        </div>
       </div>
    </div>`,
  },
  {
    name: "Workshop Template",
    type: "workshop",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
    <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Workshop Invitation</h1>
        <p style="font-size: 1.2em; color: #555;">You are invited to</p>
    </div>
    <div style="text-align: center; margin-bottom: 60px;">
        <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{workshopTitle}}</h2>
        <p style="font-size: 1.2em; color: #555;">Led by</p>
        <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{instructorName}}</h3>
        <p style="font-size: 1.2em; color: #555;">at {{workshopVenue}} on {{workshopDate}}</p>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="text-align: left;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Hosted by:</p>
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">{{host}}</p>
                </div>
        <div style="text-align: right;">
          <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Contact:</p>
                <div style="height: 50px; border-bottom: 1px solid #000;"></div>
          <p style="font-size: 1em; color: #777;">{{contact}}</p>
        </div>
    </div>
   </div>
</div>`,
  },
  {
    name: "Participation Template",
    type: "participation",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Certificate of Participation</h1>
            <p style="font-size: 1.2em; color: #555;">Awarded to</p>
        </div>
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{participantName}}</h2>
            <p style="font-size: 1.2em; color: #555;">for participating at</p>
            <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{eventName}}</h3>
            <p style="font-size: 1.2em; color: #555;">on {{eventDate}}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="text-align: left;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Sponsors:</p>
                 <p style="font-size: 1em; color: #777; margin-bottom: 5px;">{{sponsors}}</p>
            </div>
             <div style="text-align: right;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Organized by:</p>
                <div style="height: 50px; border-bottom: 1px solid #000;"></div>
                <p style="font-size: 1em; color: #777;">{{organizer}}</p>
            </div>
        </div>
       </div>
    </div>`,
  },
  {
    name: "Competition Template",
    type: "competition",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Competition Result</h1>
           <p style="font-size: 1.2em; color: #555;">Awarded to</p>
        </div>
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{competitorName}}</h2>
            <p style="font-size: 1.2em; color: #555;">for securing</p>
            <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{position}} place</h3>
            <p style="font-size: 1.2em; color: #555;">in {{competitionName}} on {{competitionDate}}</p>
        </div>
         <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
         <div style="text-align: left;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Sponsors:</p>
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">{{sponsors}}</p>
            </div>
            <div style="text-align: right;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Organized by:</p>
                <div style="height: 50px; border-bottom: 1px solid #000;"></div>
                <p style="font-size: 1em; color: #777;">{{organizer}}</p>
            </div>
        </div>
       </div>
    </div>`,
  },
  {
    name: "Job Offer Template",
    type: "job",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Job Offer</h1>
            <p style="font-size: 1.2em; color: #555;">We are pleased to offer</p>
        </div>
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{candidateName}}</h2>
            <p style="font-size: 1.2em; color: #555;">the position of</p>
            <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{jobTitle}}</h3>
            <p style="font-size: 1.2em; color: #555;">at {{companyName}} with a compensation of {{salary}}</p>
             <p style="font-size: 1.2em; color: #555;">Your start date is {{startDate}}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="text-align: left;">
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Contact:</p>
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">{{contact}}</p>
            </div>
            <div style="text-align: right;">
               <p style="font-size: 1em; color: #777; margin-bottom: 5px;">HR Department</p>
               <div style="height: 50px; border-bottom: 1px solid #000;"></div>
            </div>
        </div>
       </div>
    </div>`,
  },
  {
    name: "Internship Template",
    type: "internship",
    htmlContent: `<div style="font-family: 'Arial', sans-serif; width: 800px; padding: 50px; border: 2px solid #4a7729; margin: auto; position: relative;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5em; color: #2a52be; margin-bottom: 10px;">Internship Offer</h1>
             <p style="font-size: 1.2em; color: #555;">We are pleased to offer</p>
        </div>
        <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 3em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{internName}}</h2>
            <p style="font-size: 1.2em; color: #555;">an internship at</p>
             <h3 style="font-size: 1.8em; color: #4a7729; font-weight: bold; margin-bottom: 10px;">{{companyName}}</h3>
             <p style="font-size: 1.2em; color: #555;">as {{internshipTitle}}, starting on {{startDate}} and ending on {{endDate}}</p>
            
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="text-align: left;">
          <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Mentor:</p>
                <p style="font-size: 1em; color: #777; margin-bottom: 5px;">{{mentorName}}</p>
            </div>
             <div style="text-align: right;">
              <p style="font-size: 1em; color: #777; margin-bottom: 5px;">Contact:</p>
               <div style="height: 50px; border-bottom: 1px solid #000;"></div>
               <p style="font-size: 1em; color: #777;">{{contact}}</p>
           </div>
        </div>
       </div>
    </div>`,
  },
];

async function insertTemplates() {
  try {
    for (const templateData of templatesData) {
      const newTemplate = new Template(templateData);
      await newTemplate.save();
      console.log(`Inserted template for: ${templateData.type}`);
    }
    console.log("All templates inserted successfully!");
    mongoose.connection.close(); // Close the connection after completion
  } catch (error) {
    console.error("Error inserting templates:", error);
    mongoose.connection.close(); // Close connection in case of error as well
  }
}

insertTemplates();
