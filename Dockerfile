FROM golang:1.8

# app_env should be `production` or `development`
ARG app_env
ENV APP_ENV $app_env

WORKDIR /go/src/app

# For hot-reloading
RUN go get github.com/codegangsta/gin

# Download DB file from database repo
RUN mkdir -p includes \
    && curl -SL https://github.com/ShabadOS/database/releases/download/0.0.0-alpha/data > includes/data

# Copy sources AFTER DB download to take advantage of Docker caching
COPY . .

# Download and install the app dependencies
RUN go get .
RUN go build

# Expose whatever port
EXPOSE 42424

# Run the server with hot-reload if not in production
CMD if [ ${APP_ENV} = production ]; \
	then \
	    ./ShabadOS; \
	else \
	    gin --all -i -x history run; \
    fi
