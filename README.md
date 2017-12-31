[![Datalayer](http://datalayer.io/img/logo-datalayer-horizontal.png)](http://datalayer.io)

`Kuber` is plain `Kubernetes made simple` for Data Scientists.

It will help you create and manage your K8S cluster and transform it into a powerful Big Data Science platform.

# Hack

This repository contains the WEB User Interface for `kuber-plane`, part of the Datalayer platform.

To hack on this, you will need [nodejs version +v8.7.0](https://nodejs.org/en/download) and [yarn version +1.2.1](https://yarnpkg.com/lang/en/docs/install) installed.

It is built as `React.js` application and needs the `Golang` REST/WebSocket Server for Kuber.

For now, you are supposed to have a running Kubernetes cluster and to tart the K8S Proxy.

```shell
kubectl proxy
```

Start the Kuber Server.

```shell
cd $GOPATH/src/github.com/datalayer/kuber/server/
go run main.go --apiserver-host=http://localhost:8001
```

Start the Kuber Plane user interface and browse to http://localhost:4326.

```shell
cd $GOPATH/src/github.com/datalayer/kuber/plane
echo http://localhost:4326
yarn start
```

Useful commands:

```shell
yarn build:install  # Install dependencies.
yarn build:scss     # Generate the CSS.
yarn build:build    # Build.
yarn start          # Start development server (auto reload)
yarn build:dist     # Create a distribution and grap it from the `_dist` folder.
yarn build:clean    # Clean (if needed)
```
