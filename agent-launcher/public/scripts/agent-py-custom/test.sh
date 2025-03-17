docker build -t agent-python-custom-1-xxx .; docker run -p 33123:80 --name 1-xxx agent-python-custom-1-xxx

curl -X POST http://localhost:33030/prompt \
     -H "Content-Type: application/json" \
     -d '{"ping": true}'

1-xxx
     Dockerfile
     requirements.txt
     server.py
     app.zip
     app