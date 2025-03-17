from python:3.12

workdir /workspace

copy requirements.txt /workspace/requirements.txt

run pip install -r requirements.txt --no-cache-dir && \
    rm -rf /root/.cache/pip /workspace/requirements.txt

copy app /workspace/app

run pip install -r /workspace/app/requirements.txt --no-cache-dir && \
    rm -rf /root/.cache/pip /workspace/app/requirements.txt

copy server.py /workspace/server.py

cmd ["python", "server.py"]