echo "Starting adminer"

docker stop adminer || true 
docker rm adminer || true

docker run --name adminer \
            --network mongonet \
            -e ME_CONFIG_OPTIONS_EDITORTHEME="ambiance" \
            -e ME_CONFIG_MONGODB_SERVER=db \
            -e ME_CONFIG_MONGODB_ADMINUSERNAME=test \
            -e ME_CONFIG_MONGODB_ADMINPASSWORD=test \
            -p 8081:8081 \
            mongo-express