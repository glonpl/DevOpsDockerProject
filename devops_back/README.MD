# Running just an backend app, avalible at localhost:3000

1. Create network:
```
docker network create my-network
```
2. Run redis:
```
docker run --rm --name my-redis --network my-network redis
```
3. Run postgres:
```
docker run --rm --name my-postgres -e POSTGRES_PASSWORD=123qaz123qaz --network my-network postgres
```
4. Build backend app:
```
docker build -t my-backend -f Dockerfile.dev .
```
5. Run backend app:
```
docker run --env REDIS_HOST=my-redis --rm --name my-backend --network my-network -v /opt/app/node_modules -v ${PWD}:/opt/app -e PGHOST=my-postgres -e PGUSER=postgres -e PGDATABASE=postgres -e PGPASSWORD=123qaz123qaz -p 3000:3000 -e PGPORT=5432 my-backend
```
