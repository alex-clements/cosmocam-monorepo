FROM ahclemen/cosmocam-builder:latest

COPY ./packages/cosmocam-backend ./packages/cosmocam-backend
COPY ./packages/cosmocam-frontend ./packages/cosmocam-frontend
COPY ./packages/cosmocam-mediaserver ./packages/cosmocam-mediaserver
COPY ./packages/nginx ./packages/nginx
RUN yarn
RUN tsc -p ./packages/shared/tsconfig.json
RUN tsc -p ./packages/cosmocam-backend/tsconfig.json
RUN NODE_ENV=production

EXPOSE 3001

CMD ["node", "packages/cosmocam-backend/dist/server.js"]