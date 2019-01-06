# Alexa Movie Scene Game
Reenact your favorite classic movie scenes with Alexa using this skill!

Currently, there are scenes from two movies in this repository: The Breakfast Club and Harry Potter and the Sorcerer's Stone. Feel free to download this code and replace these scenes with scenes of your own!

# Setup

1. Go to the [Amazon Developer Console](https://developer.amazon.com/alexa/console/ask) (You may need to create an Amazon Developer Account first) and create a new skill. Enter the skill name “Movie Scene Game” and select the custom skill model for this example. Click continue.
2. Choose one of the provided templates. We will be replacing the Interaction Model json so it doesn’t matter which one you choose. Finish creating the skill.
3. In the Amazon Developer Console, select JSON Editor, and replace all of the contents with what is provided in the code [here](https://github.com/feliciacodes/alexaSkills/blob/master/interactionModel.json) and build your model. You should now have the Movie Scene Game interaction model.
4. Go to the [AWS Lambda Management Console](https://console.aws.amazon.com/lambda/home) (You may need to create an AWS account first) and create a new function. Make sure your [region](https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html#create-a-lambda-function-for-an-alexa-skill) is in one of the available regions to build a lambda function for an Alexa skill. Select Author from Scratch (since we will be uploading the provided code), Node.js 8.10. For the role, I chose to create a new role from one or more templates and selected the “Simple microservice permissions” template. Finish creating the function.
5. In the function code section, change code entry type to “Upload a .zip file”. Download the [lambda folder](https://github.com/feliciacodes/alexaSkills/tree/master/lambda) from this repository and upload it here. Click save.
6. Note: the index.js file needs to be in the movieSceneGame folder, NOT the lambda folder. You can move all of the files from the lambda folder to the movieSceneGame folder and delete any other relevant information. Save your changes. Here’s what your folder structure should look like: 





<img src="https://github.com/feliciacodes/alexaSkills/blob/master/images/folderStructure.png" align = "middle" width = "100" height = "100" />
7. Go to the Designer section and add the Alexa Skills Kit trigger. Paste your skill ID from the developer console here. Save your changes.
8. Copy your ARN and head back to the Developer Console. Go to your skill and choose Endpoint. Select AWS Lambda ARN and paste your ARN into the Default Region input.
9. You’re now ready to test your skill. In the developer console, select the test tab. Enable testing for development and start up the skill with the invocation name (movie scene game).

# Sample Invocations and Utterances
User: Open Movie Scene Game
Alexa: Ok. What movie would you like to reenact a scene from?
User: The Breakfast Club
Alexa: Ok. Say Action when you’re ready
User: Action
……scene goes back and forth
User: End Scene

User: Open Movie Scene Game for The Breakfast Club
Alexa: Ok. Say Action when you’re ready

# Customizing the skill
If you want to change up the scenes, here’s how to do that easily:
1. Add the name of the movie to the MyMovies slot type
2. Add all lines to the Lines slot type in the interaction model. For user lines, make sure they are all lowercase and have no punctuation. This is because of how Alexa interprets user language.
3. In your Lambda function, create a new file in the Movies folder that exports an array of lines for your movie. If your lines reference a number (one, two, etc.), put the actual number symbol (1,2,…) in its place. (Again, this is just how the response will be returned)
4. In your index.js file, import the file and add it to the movieScenes json object.


		
