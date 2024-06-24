FROM python:3.9-slim

WORKDIR /
COPY . /

RUN apt-get update && apt-get install -y git

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install bentoml

EXPOSE 8000

# CMD ["bentoml", "serve", "service:SDXLTurbo"]
