FROM nvidia/cuda:11.7.1-cudnn8-devel-ubuntu20.04
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install git wget -y && apt-get clean

# install pigz
RUN apt-get install pigz -y

RUN mkdir -p ~/miniconda3 \
    && wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh \
    && bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3 \
    && rm ~/miniconda3/miniconda.sh

ENV PATH="/root/miniconda3/bin:${PATH}"
USER root
WORKDIR /app
RUN conda create -n env python==3.10 -y

COPY requirements.txt /tmp/requirements.txt
RUN RUN conda run --no-capture-output -n env python -m pip install -r /tmp/requirements.txt

RUN rm -rf /tmp/requirements.txt /root/.cache
COPY server.py /app

EXPOSE 8000
CMD ["conda", "run", "--no-capture-output", "-n", "env", "python", "-O", "server.py"]
