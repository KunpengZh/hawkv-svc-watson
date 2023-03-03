FROM registry.access.redhat.com/ubi8/nodejs-18:latest
# Create app directory
# NodeJS 16 - registry.cirrus.ibm.com/repository/public/nodejs-16
# NodeJS 14 - registry.cirrus.ibm.com/repository/public/nodejs-14

# USER root
# RUN yum update -y

USER root
RUN dnf update -y && dnf upgrade -y

WORKDIR /app
COPY package*.json ./

# Setting env for performance
ENV NODE_ENV=production
ENV HOME=/app

COPY . .

# RUN chmod -R a+r /app
RUN chown -R 1001 /app
RUN chown -R 1001 /app/.npm
# RUN chown -R 1001 /app/tempFiles
# RUN chmod 777 /app/.npm

USER 1001
RUN npm install --only=production
RUN npm i dotenv
# RUN npm config set cache /app/npmlogs

EXPOSE 3000
CMD ["npm", "start"]
# CMD [ "/bin/sh","/app/run.sh" ]

