build:
	npm run build --prefix frontend

start:
	npx start-server -s ./frontend/build

lint:
	npm run lint --prefix /home/Front/frontend-project-12/frontend

frontend-lint:
	make -f ../Makefile lint