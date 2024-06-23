import os
from dotenv import load_dotenv

from flask import Flask
from flask_discord_interactions import DiscordInteractions
from flask_discord_interactions import Message, ActionRow, Button, ButtonStyles

# Load environment variables from the .env file
load_dotenv()


app = Flask(__name__)
discord = DiscordInteractions(app)

app.config["DISCORD_CLIENT_ID"] = os.getenv("DISCORD_CLIENT_ID")
app.config["DISCORD_PUBLIC_KEY"] = os.getenv("DISCORD_PUBLIC_KEY")
app.config["DISCORD_CLIENT_SECRET"] = os.getenv("DISCORD_CLIENT_SECRET")


@discord.command()
def sticker(ctx):
    "Ephemeral Message"

    return Message(
        "Ephemeral messages are only sent to the user who ran the command",
        components=[ActionRow(components=[Button(style=ButtonStyles.PRIMARY, custom_id=sticker, label="Click Me!")])],
        ephemeral=True,
        update=True,
    )


discord.set_route("/interactions")


discord.update_commands(guild_id=os.getenv("TESTING_GUILD"))


if __name__ == "__main__":
    app.run()
