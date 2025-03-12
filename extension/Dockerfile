# Stage 1: Install Node dependencies
FROM node:14-alpine AS node-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Final image with both Node and Python
FROM node:14-alpine
WORKDIR /app

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Install Python dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy Node dependencies from the previous stage (if needed for assets/build)
COPY --from=node-deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy the rest of your code
COPY . .

EXPOSE 5001

# Run npm install (if runtime build steps are needed) then start the Python server
CMD ["sh", "-c", "npm install && python3 server.py"]
