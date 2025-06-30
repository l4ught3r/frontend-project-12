lint:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend dev

start-backend:
	npx start-server -s ./frontend/dist

start:
	make start-backend

dev:
	make start-backend & make start-frontend

build:
	rm -rf frontend/dist
	npm run build