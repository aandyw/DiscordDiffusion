import os
from dotenv import load_dotenv

from flask import Flask
from flask_discord_interactions import DiscordInteractions, Message, ActionRow, Button, ButtonStyles, Embed, embed

# Load environment variables from the .env file
load_dotenv()


app = Flask(__name__)
discord = DiscordInteractions(app)

app.config["DISCORD_CLIENT_ID"] = os.getenv("DISCORD_CLIENT_ID")
app.config["DISCORD_PUBLIC_KEY"] = os.getenv("DISCORD_PUBLIC_KEY")
app.config["DISCORD_CLIENT_SECRET"] = os.getenv("DISCORD_CLIENT_SECRET")

discord.update_commands()

TEMP_URL = "https://chatx.ai/wp-content/uploads/2023/03/Die-cut_sticker_Cute_kawaii_dinosaur_sticker_white_ba_8429429c-0cfe-492c-8373-6fcbdded.jpg.webp"

# --------------------
# Commands
# --------------------


@discord.command()
def sticker(ctx, prompt: str = ""):
    """Ephermeal AI sticker picker message!"""

    # embed image will include a 2x2 grid of stickers to choose from
    return Message(
        content=f"Here are a few AI stickers that match your prompt:\n`{prompt}`",
        embed=Embed(image=embed.Media(url=TEMP_URL, height=1024, width=1024), color=3092790),
        components=[
            ActionRow(
                components=[
                    Button(style=ButtonStyles.SECONDARY, label="TL", custom_id=handle_select_TL),
                    Button(style=ButtonStyles.SECONDARY, label="TR", custom_id=handle_select_TR),
                    Button(style=ButtonStyles.SECONDARY, label="BL", custom_id=handle_select_BL),
                    Button(style=ButtonStyles.SECONDARY, label="BR", custom_id=handle_select_BR),
                    Button(style=ButtonStyles.SECONDARY, label="", emoji={"name": "🔄"}, custom_id=refresh),
                ]
            )
        ],
        ephemeral=True,
    )


# --------------------
# Handlers
# --------------------


@discord.custom_handler()
def handle_select_TL(ctx):
    print("Selected sticker v1")


@discord.custom_handler()
def handle_select_TR(ctx):
    print("Selected sticker v2")


@discord.custom_handler()
def handle_select_BL(ctx):
    print("Selected sticker v3")


@discord.custom_handler()
def handle_select_BR(ctx):
    print("Selected sticker v4")


@discord.custom_handler()
def refresh(ctx):
    print("Refresh")


discord.set_route("/interactions")
discord.update_commands(guild_id=os.getenv("TESTING_GUILD"))


if __name__ == "__main__":
    app.run()
