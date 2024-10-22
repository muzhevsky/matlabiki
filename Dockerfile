FROM python:3.10-alpine

WORKDIR /app

COPY . /app

RUN apk add --no-cache gcc musl-dev linux-headers

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p app/images

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090"]
