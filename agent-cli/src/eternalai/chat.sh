#!/bin/bash

agent_id=$1 

current_dir=$(pwd)
echo $current_dir

cd ..

./eai-chat chat $agent_id