from python:3.12

workdir /workspace

copy app /workspace

run pip install -r requirements.txt --no-cache-dir && \
    rm -rf /root/.cache/pip /workspace/requirements.txt

cmd ["python", "app.py"]