docker build -t fatihsevban/ecommerce-auth ./auth
docker build -t fatihsevban/ecommerce-order ./order
docker build -t fatihsevban/ecommerce-product ./product
docker build -t fatihsevban/ecommerce-frontend ./frontend

docker push fatihsevban/ecommerce-auth
docker push fatihsevban/ecommerce-order
docker push fatihsevban/ecommerce-product
docker push fatihsevban/ecommerce-frontend
