echo "Starting db"

docker stop db || true 
docker rm db || true
ls $(pwd)/data || mkdir $(pwd)/data

docker run --name db \
            -v $(pwd)/data:/data/db \
            -p 8080:27017\
            -e MONGO_INITDB_DATABASE=admin \
            -e MONGO_INITDB_ROOT_USERNAME=test \
            -e MONGO_INITDB_ROOT_PASSWORD=test -d mongo
