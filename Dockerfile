FROM golang:1.8

WORKDIR /go/src/app

# Download DB file from database repo
RUN curl https://github.com/ShabadOS/database/releases/download/0.0.0-alpha/data \
    -o includes/data \
    --progress-bar \
    -L

# Copy sources AFTER DB download to take advantage of Docker caching
COPY . .

# Download and install the app dependencies
RUN go-wrapper download
RUN go-wrapper install

EXPOSE 42424

# Run the app with go-wrapper
CMD ["go-wrapper", "run"]
