# Use official Node.js LTS (Long Term Support) image
FROM node:lts-alpine
WORKDIR /usr/src/app

# Install git if needed
RUN apk update && apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/Arvelon/next-home-control.git .

# Optionally, you can pull the latest changes on build
RUN git pull

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
