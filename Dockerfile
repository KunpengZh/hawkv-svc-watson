FROM registry.access.redhat.com/ubi8/nodejs-14:latest
# Create app directory
# NodeJS 16 - registry.cirrus.ibm.com/repository/public/nodejs-16
# NodeJS 14 - registry.cirrus.ibm.com/repository/public/nodejs-14
USER root
RUN yum update -y
WORKDIR /app
ENV HOME=/app
COPY . .
RUN chown -R 1001 /app
# RUN chown -R 1001 /app/tempFiles
# RUN chmod 777 /app/tempFiles
USER 1001
RUN npm install --only=production
RUN npm i dotenv

EXPOSE 3000
CMD [ "/bin/sh","/app/run.sh" ]