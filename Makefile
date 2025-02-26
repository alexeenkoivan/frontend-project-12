build:
	npm ci --prefix frontend
	npm run build --prefix frontend

start:
	npx start-server & \
	cd frontend && npm start

lint:
	npm run lint --prefix frontend

install:
	npm ci
