# DiscordDiffusion
User Installable Discord Sticker Bot using Diffusion Models

# Demo
![Demo](docs/demo.gif)

# Setup
### Discord Setup 

1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and create an application, **(remember to save the API key/token generated during setup)** 

2. Copy the `.env.public` file at the root of the project and rename it to `.env`. 
3. Add your token generated during setup to `DISCORD_TOKEN` and under navigate to *General Information > Application ID* in the Discord developer portal `DISCORD_CLIENT_ID` 

### Hugging Face Inference Enpoint Setup

An inference endpoint is an entrypoint into an ML model that allows users to input a query and receive a response. We're using [Hugging Face's Inference Endpoints](https://huggingface.co/inference-endpoints/dedicated) to easily deploy and manage the model. 

1. Deploy your endpoint using [sdxl-ddiff](https://huggingface.co/STUDs/sdxl-ddiff) model that we've created. 

2. Retrieve the Endpoint URL from the dashboard and set it to `HF_ENDPOINT`. Then naviagate to *Settings > Access Tokens* and generate a UAT (User Access Token) and setting it to the  `HF_TOKEN` 

# Run
Once you've pulled the code and populated the `.env` file with the associated variables, you can now install the app and run the server to handle user requests! 

>The installation link for the app can be found in the Discord Developer Portal at *Installation > Installation Link*

When first running the server or modifying commands run the code below to register/refresh the commands with your Discord app
```
npm run register

// Started refreshing 1 application (/) commands.
// Successfully reloaded 1 application (/) commands.
```

To run the server use the command below. If successful it will respond with a message saying that you're logged in!

```
npm run start

// Ready! Logged in as Sticker Gen#1575
```

You're now ready to start generating stickers to use in Discord DMs or servers




