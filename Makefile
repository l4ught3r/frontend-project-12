lint:
	make -C frontend lint

fix:
	make -C frontend fix

format:
	make -C frontend format

install:
	npm ci
	make -C frontend install

start-frontend:
	make -C frontend dev

start-backend:
	npx @hexlet/chat-server -s ./frontend/dist

start:
	make start-backend

dev:
	make start-backend & make start-frontend

build:
	rm -rf frontend/dist
	make -C frontend build