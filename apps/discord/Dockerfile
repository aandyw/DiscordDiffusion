FROM python:3.9-slim

WORKDIR /
COPY . /

RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 3000

CMD ["bash", "-c", "python app.py"]
