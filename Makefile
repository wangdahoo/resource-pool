install:
	mkdir -p docker_volumes
	docker run --name simple-pool-mongodb -v `pwd`/docker_volumes/mongodb:/data/db -p 27017:27017 -d daocloud.io/mongo --port 27017
	docker run --name simple-pool-redis -v `pwd`/docker_volumes/redis:/data -p 6380:6380 -d redis redis-server --port 6380
	yarn
	
test:
	yarn test
