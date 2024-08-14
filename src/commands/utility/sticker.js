const {
  SlashCommandBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  ComponentType,
} = require("discord.js");
const { query, saveBase64Image } = require("../../services/inference_service");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticker")
    .setDescription("Generate a sticker!")
    .addStringOption((option) =>
      option.setName("prompt").setDescription("Used for sticker generation")
    ),
  async execute(interaction) {
    const topLeft = new ButtonBuilder()
      .setCustomId("top_left")
      .setLabel("TL")
      .setStyle(ButtonStyle.Primary);

    const topRight = new ButtonBuilder()
      .setCustomId("top_right")
      .setLabel("TR")
      .setStyle(ButtonStyle.Primary);

    const bottomLeft = new ButtonBuilder()
      .setCustomId("bottom_left")
      .setLabel("BL")
      .setStyle(ButtonStyle.Primary);

    const bottomRight = new ButtonBuilder()
      .setCustomId("bottom_right")
      .setLabel("BR")
      .setStyle(ButtonStyle.Primary);

    const regenerate = new ButtonBuilder()
      .setCustomId("regenerate")
      .setLabel("🔄")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      regenerate
    );

    let topLeftImage;
    let topRightImage;
    let bottomLeftImage;
    let bottomRightImage;
    let previewImage;

    await interaction.deferReply({ ephemeral: true });

    try {
      await query({
        inputs: interaction.options.getString("prompt"),
        num_images: 4,
        rows: 2,
        cols: 2,
      }).then((response) => {
        const { images, preview } = response;

        previewImage = preview;
        topLeftImage = images[0];
        topRightImage = images[1];
        bottomLeftImage = images[2];
        bottomRightImage = images[3];
      });

      const previewImagePath = await saveBase64Image(previewImage);
      const reply = await interaction.editReply({
        files: [new AttachmentBuilder(previewImagePath)],
        components: [row],
        ephemeral: true,
      });

      const collector = reply.createMessageComponentCollector({
        ComponentType: ComponentType.Button,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.customId === "top_left") {
          const topLeftPath = await saveBase64Image(topLeftImage);
          interaction.reply({
            files: [new AttachmentBuilder(topLeftPath)],
          });
          return;
        }
        if (interaction.customId === "top_right") {
          const topRightPath = await saveBase64Image(topRightImage);
          interaction.reply({
            files: [new AttachmentBuilder(topRightPath)],
          });
          return;
        }
        if (interaction.customId === "bottom_left") {
          const bottomLeftPath = await saveBase64Image(bottomLeftImage);
          interaction.reply({
            files: [new AttachmentBuilder(bottomLeftPath)],
          });
          return;
        }
        if (interaction.customId === "bottom_right") {
          const bottomRightPath = await saveBase64Image(bottomRightImage);
          interaction.reply({
            files: [new AttachmentBuilder(bottomRightPath)],
          });
          return;
        }
        if (interaction.customId === "regenerate") {
          // TODO:
          // interaction.deferReply({ ephemeral: true });
          // await query({
          //   inputs: interaction.options.getString("prompt"),
          //   num_images: 4,
          //   rows: 2,
          //   cols: 2,
          // }).then((response) => {
          //   const { images, preview } = response;
          //   previewImage = preview;
          //   topLeftImage = images[0];
          //   topRightImage = images[1];
          //   bottomLeftImage = images[2];
          //   bottomRightImage = images[3];
          // });
          // const previewImagePath = await saveBase64Image(previewImage);
          // const reply = await interaction.editReply({
          //   files: [new AttachmentBuilder(previewImagePath)],
          //   components: [row],
          //   ephemeral: true,
          // });
          // const collector = reply.createMessageComponentCollector({
          //   ComponentType: ComponentType.Button,
          // });

          return;
        }
      });
    } catch (error) {
      await interaction.editReply("/(✖ ᗝ ✖)/ sorry something went wrong");
      console.error(`Failed to generate stickers: ${error}`);
      return;
    }
  },
};
