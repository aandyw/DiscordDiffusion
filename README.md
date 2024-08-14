# DiscordDiffusion 1.0
User Installable Discord Sticker Bot using Diffusion Models.

<img src="docs/demo.gif" width="75%" height="75%"/>

# Setup

## Setup the Discord App

Navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and create an application, **(remember to save the API key/token generated during setup)**.

Configuring the discord application is covered in detail in the [tutorial](http://discord.com/developers/docs/tutorials/developing-a-user-installable-app).

### Default Install Settings

Click on the **Installation** page in your app's settings and go to the **Default Install Settings** section.

For user install:
- `applications.commands`

For guild install:
- `applications.commands`
- `bot` (with Send Messages enabled)

### Install the App

The installation link for the app can be found in the Discord Developer Portal at *Installation > Installation Link*

## Setup Discord Diffusion

1. Copy the `.env.public` file at the root of the project and rename it to `.env`. 
2. Add your token generated during setup to `DISCORD_TOKEN` and under navigate to *General Information > Application ID* in the Discord developer portal `DISCORD_CLIENT_ID`

### Hugging Face Inference Enpoint Setup

An inference endpoint is an entrypoint into an ML model that allows users to input a query and receive a response. We're using [Hugging Face's Inference Endpoints](https://huggingface.co/inference-endpoints/dedicated) to easily deploy and manage the model.

1. Deploy your endpoint using the [STUDs/sdxl-ddiff](https://huggingface.co/STUDs/sdxl-ddiff) model that we've created under `Model Repository`.

2. Retrieve the Endpoint URL from the dashboard and set it to `HF_ENDPOINT`. Then naviagate to *Settings > Access Tokens* and generate a UAT (User Access Token) and setting it to the  `HF_TOKEN` 

# Run

## Running Locally
Once you've pulled the code and populated the `.env` file with the associated variables, you can now [install the app](#install-the-app) and run the server to handle user requests!

When first running the server or modifying commands run the code below to register/refresh the commands with your Discord app

```
npm run register
> Started refreshing 1 application (/) commands.
> Successfully reloaded 1 application (/) commands.
```

To run the server use the command below. If successful it will respond with a message saying that you're logged in!

```
bash run.sh dev
> Ready! Logged in as Sticker Gen#1575
```

You're now ready to start generating stickers to use in Discord DMs or servers

# Deployment

## Launch with Fly.io

Follow the [quickstart](https://fly.io/docs/getting-started/launch/) to setup Fly.io and then run

```
fly launch
```

to build, configure, and deploy the discord bot! You can manually deploy with `fly deploy`.


## Docker image
If you want to deploy using a docker image, you can simply call

```
bash run.sh prod
```

which will build the appropriate image for deployment.


# Todos
- [x] Setup inference endpoint for SDXL-base-1.0 lightning
- [x] Integrate discord bot with inference endpoint
- [x] Deployment with fly.io
- [ ] Experiment with segmentation (SAM) to remove sticker backgrounds
- [ ] Experiment with other LCM models to reduce latency and increase quality
- [ ] Finetuning diffusion models with KohyaSS

