## 1. Clone the project

```bash
git clone https://github.com/Zahkklm/metadata-viewer.git 
```

## 2. Navigate to project directory

For example:

```bash
cd fullstackapp 
```

## 3. Build the Dockerfile

Both backend and frontend is built together as seperate containers:

Make sure docker service is running background:

```docker
docker-compose up --build
```

Frontend is now accessible at: **http://localhost**

## 4. Run unit tests
For frontend:

```bash
cd frontend && npm test
```

For backend:
```bash
cd frontend && npm test
```

## 

Demo of this application is accessible at: http://158.180.229.76:80/

Make sure to use `http://` before web adress input!