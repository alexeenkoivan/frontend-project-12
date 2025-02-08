build:
	npm ci --prefix frontend
	npm run build --prefix frontend

start:
	npx start-server & \
	cd frontend && PORT=5000 npm start

lint:
	npm run lint --prefix frontend

install:
	npm ci

test:
	npx playwright test