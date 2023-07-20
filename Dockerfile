FROM node:16
WORKDIR /app
COPY . .
RUN npm i
ENV PORT=8181
EXPOSE 8181
CMD ["npm", "start"]