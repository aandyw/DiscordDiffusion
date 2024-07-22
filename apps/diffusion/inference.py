import sagemaker
import boto3

from sagemaker.huggingface.model import HuggingFaceModel
from sagemaker.serverless import ServerlessInferenceConfig


iam_client = boto3.client("iam")
role = iam_client.get_role(RoleName="SageMakerAdmin")["Role"]["Arn"]
sess = sagemaker.Session()

print(f"sagemaker role arn: {role}")
print(f"sagemaker bucket: {sess.default_bucket()}")
print(f"sagemaker session region: {sess.boto_region_name}")

# Hub Model configuration. <https://huggingface.co/models>
hub = {"HF_MODEL_ID": "distilbert-base-uncased-finetuned-sst-2-english", "HF_TASK": "text-classification"}

# create Hugging Face Model Class
huggingface_model = HuggingFaceModel(
    env=hub,  # configuration for loading model from Hub
    role=role,  # iam role with permissions to create an Endpoint
    transformers_version="4.26",  # transformers version used
    pytorch_version="1.13",  # pytorch version used
    py_version="py39",  # python version used
)

# Specify MemorySizeInMB and MaxConcurrency in the serverless config object
serverless_config = ServerlessInferenceConfig(
    memory_size_in_mb=3072,
    max_concurrency=10,
)

# deploy the endpoint endpoint
predictor = huggingface_model.deploy(
    serverless_inference_config=serverless_config,
    initial_instance_count=1,
    instance_type="ml.m5.xlarge",
)

data = {
    "inputs": "the mesmerizing performances of the leads keep the film grounded and keep the audience riveted .",
}

res = predictor.predict(data=data)
print(res)

predictor.delete_model()
predictor.delete_endpoint()
