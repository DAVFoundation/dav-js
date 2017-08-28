FROM golang:1.8-alpine

# Package dependencies
RUN apk add --update --no-cache git libc-dev

# install dependency tool
RUN go get github.com/golang/dep && go install github.com/golang/dep/cmd/dep

WORKDIR /go/src/github.com/DAVFoundation/captain

COPY Gopkg.toml /go/src/github.com/DAVFoundation/captain/
COPY Gopkg.lock /go/src/github.com/DAVFoundation/captain/

# Get dependencies
RUN dep ensure -v --vendor-only

# Copy project files
COPY . /go/src/github.com/DAVFoundation/captain

# Compile code
RUN go build -o captain-simulator github.com/DAVFoundation/captain/simulator

CMD ["./captain-simulator"]