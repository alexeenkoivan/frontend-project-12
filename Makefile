build:
	npm run build --prefix frontend

install:
	npm ci

test:
	npx playwright test

lint:
	npm run lint --prefix frontend

start-frontend:
	npm run start --prefix frontend

start-backend:
	npx start-server -s ./frontend/build

develop:
	make start-backend & sleep 5 && make start-frontend

start:
	make start-backend
