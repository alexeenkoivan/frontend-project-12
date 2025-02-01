build:
	npm ci --prefix frontend
	npm run build --prefix frontend

start:
	@npx start-server & \
	sleep 5 && \
	cd frontend && npm start

lint:
	npm run lint --prefix frontend

test:
	npx playwright test