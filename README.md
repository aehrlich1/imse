# IMSE Project

## Development Environment

During the development process it is useful to automatically compile the .ts files to their respective .js files.
This is done by executing `tsc -w` on the host machine.

## Production

## Docker

To build the image using docker compose use: `docker-compose -f "docker-compose.dev.yml" up`.

For a container not to exit append the command: `&& tail -f /dev/null`

## Angular

Issue with http://localhost:4200 not being accessible, can be solved by using command:
`ng serve --host 0.0.0.0` see [docker fix](https://dev.to/vanwildemeerschbrent/docker-angular-setup-issue-exposed-port-not-accessible-98m).

Another flag needs to be added on windows hosts to enable live reloading. See [quickstart guide for docker and angular](https://nishanc.medium.com/quick-start-guide-for-docker-with-angular-on-windows-492263edeaf8)

`ng serve --host 0.0.0.0 --poll 500`

## HTTPS

See [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04) and [baeldung](https://www.baeldung.com/openssl-self-signed-cert).

## MYSQL

See [FULL OUTER JOIN](https://explainextended.com/2009/04/06/emulating-full-outer-join-in-mysql/).