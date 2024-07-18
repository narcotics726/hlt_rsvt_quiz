# HLT Reservation App

 - hlt_rsvt_next
 
    Including all front-end codes, and part of data access layer which I plan to replace with REST API client. Built with Next.js.

 - hlt_rsvt_server

    Including GraphQL and RESTful APIs. Built with Nest.js


![data flow diagram](img/hlt_dfd.png)

Due to the time limitation, there are still lots of thing I didn't implemented: unit tests, Playwright for e2e testing, docker files, etc. Hope this project could show the rough ideas of my design.

## How to start locally

Before starting the project, make sure a couchbase instance is ready, you can use a docker image to start it:

```bash
docker run -d --name couch -p 8091-8097:8091-8097 -p 9123:9123 -p 11207:11207 -p 11210:11210 -p 11280:11280 -p 18091-18097:18091-18097 couchbase
```

Visit `localhost:8091` to finish the initial configuration.

Then modify the env file, one in `hlt_rsvt_server` and one in `hlt_rsvt_next`, to match your couchbase instance.

```
# hlt_rsvt_server/.env
HLT_RSVT_COUCH_CONNSTR=couchbase://localhost
HLT_RSVT_COUCH_USERNAME=admin
HLT_RSVT_COUCH_PASSWORD=123456
HLT_RSVT_JWT_SECRET=A_TEST_JWT_SECRET
```

```
# hlt_rsvt_next/.env.local
HLT_RSVT_COUCH_CONNSTR=couchbase://localhost
HLT_RSVT_COUCH_USERNAME=admin
HLT_RSVT_COUCH_PASSWORD=123456
HLT_RSVT_GQL_SERVER_URL=http://127.0.0.1:3001/graphql
HLT_RSVT_REST_SERVER_URL=http://127.0.0.1:3001
```

Or just `cp hlt_rsvt_server/.env.example hlt_rsvt_server/.env` and `cp hlt_rsvt_next/.env.example hlt_rsvt_next/.env.local` as templates.

Then install the deps, start the server and the client:

```bash
cd hlt_rsvt_server
npm i && npm start
```

```bash
cd hlt_rsvt_next
npm i && npm run build && npm start
```

Visit `localhost:3000` to see the app.

At the customer login page, input any phone number, the verification code is always `000000`.

At the employee login page, use `admin` as username, and anything for password.


## Some thoughts during the development

I spent the first two days trying the loopback.js framework. It's an awesome framework for team working, provides a powerful cli tool to generate most boilerplate codes, which helps aligning every developer's codes. It's also an opinionated framework imo. And that's why I gave it up at last. For a small demo project it's a little bit heavy, and for beginner like me it's hard to show my own ideas through it.

Then I put my eyes on Next. I've heard about it a lot but haven't got chances to try it. It seems like very suitable for small project. So I spent the next two days following the tutorial. It was a pleasant experience. The idea of mixing server side rendering and client side rendering is very interesting. But I'm not sure if it's a good choice for a larger project. Accessing database from front-end (although it's placed in a "server-side" part) seems too It may lead to a "big ball of mud" code base very easily. That's why I built a pure back-end server with Nest. Once I found the Next part take too much responsibility, I can easily replace most business logic with RESTful APIs calling.