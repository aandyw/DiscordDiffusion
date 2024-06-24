"""Launch script for discord bot."""

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
                    Button(style=ButtonStyles.SECONDARY, label="Q1", custom_id=handle_select_q1),
                    Button(style=ButtonStyles.SECONDARY, label="Q2", custom_id=handle_select_q2),
                    Button(style=ButtonStyles.SECONDARY, label="Q3", custom_id=handle_select_q3),
                    Button(style=ButtonStyles.SECONDARY, label="Q4", custom_id=handle_select_q4),
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
def handle_select_q1(ctx):
    print("Selected sticker v1")

    # display selected AI sticker
    return Message(
        embed=Embed(
            description=f"`{ctx.author.display_name}` reacted:",
            image=embed.Media(url=TEMP_URL, height=1024, width=1024),
            color=3092790,
        )
    )


@discord.custom_handler()
def handle_select_q2(ctx):
    print("Selected sticker v2")

    return Message(
        embed=Embed(
            description=f"`{ctx.author.display_name}` reacted:",
            image=embed.Media(url=TEMP_URL, height=1024, width=1024),
            color=3092790,
        )
    )


@discord.custom_handler()
def handle_select_q3(ctx):
    print("Selected sticker v3")

    return Message(
        embed=Embed(
            description=f"`{ctx.author.display_name}` reacted:",
            image=embed.Media(url=TEMP_URL, height=1024, width=1024),
            color=3092790,
        )
    )


@discord.custom_handler()
def handle_select_q4(ctx):
    print("Selected sticker v4")

    return Message(
        embed=Embed(
            description=f"`{ctx.author.display_name}` reacted:",
            image=embed.Media(url=TEMP_URL, height=1024, width=1024),
            color=3092790,
        )
    )


@discord.custom_handler()
def refresh(ctx):
    print("Refresh")

    return Message("regenerating images")


discord.set_route("/interactions")
discord.update_commands(guild_id=os.getenv("TESTING_GUILD"))


if __name__ == "__main__":
    app.run(port=3000)
