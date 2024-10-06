build:
	npm run build --prefix frontend

start:
	npx start-server -s ./frontend/build

lint:
	npm run lint --prefix frontend