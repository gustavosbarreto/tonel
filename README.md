<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/38/Oil_Barrel_graphic.png" height="220px">
</p>

# tonel - HTTP tunnel to localhost

## Installation

    $ npm install tonel

## Usage

### Server

```
Usage: tonel-server <options>

Options:
  -t, --timeout  HTTP request timeout                           [default: 45000]
  -p, --port     Port to listen                                    [default: 80]
  -r, --redis    Redis host:port                     [default: "localhost:6379"]
```

### Client

```
Usage: tonel-client --port [num] <options>

Options:
  -h, --host       Server to provide forwarding                       [required]
  -s, --subdomain  Subdomain to use
  -p, --port       Internal http server port                          [required]
  -t, --token      Subdomain authorization token
```
