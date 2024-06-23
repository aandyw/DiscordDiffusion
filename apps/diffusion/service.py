import bentoml
from PIL.Image import Image

import torch
from diffusers import AutoPipelineForText2Image

MODEL_ID = "stabilityai/sdxl-turbo"

STICKER_PROMPT = (
    ", Sticker, Die Cut Sticker, Vinyl Sticker, Flat image, 2D Vector SVG, White Background, Simple, No text, Denoised"
)
sample_prompt = "A cinematic shot of a baby racoon wearing an intricate italian priest robe" + STICKER_PROMPT


@bentoml.service(
    traffic={
        "timeout": 300,
        "external_queue": True,
        "concurrency": 1,
    },
    workers=1,
    resources={
        "gpu": 1,
        "gpu_type": "nvidia-l4",
    },
)
class SDXLTurbo:
    def __init__(self) -> None:

        self.pipe = AutoPipelineForText2Image.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.float16,
            variant="fp16",
        )
        self.pipe.to(device="cuda")

    @bentoml.api
    def txt2img(
        self,
        prompt: str = sample_prompt,
        num_inference_steps: int = 1,
        guidance_scale: float = 0.0,
    ) -> Image:
        image = self.pipe(
            prompt=prompt,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
        ).images[0]
        return image
