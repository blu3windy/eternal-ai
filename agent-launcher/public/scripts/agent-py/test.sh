docker build -t agent-python-1-xxx .; docker run -p 33030:80 --name 1-xxx agent-python-1-xxx

curl -X POST http://localhost:33030/prompt \
     -H "Content-Type: application/json" \
     -d '{"ping": true}'

1-xxx
     Dockerfile
     requirements.txt
     server.py
     app.zip
     app