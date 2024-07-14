# HLT Reservation App

 - hlt_rsvt_next
 
    Including all front-end codes, and part of data access layer which I plan to replace with REST API client. Built with Next.js.

 - hlt_rsvt_server

    Including GraphQL and RESTful APIs. Built with Nest.js


![data flow diagram](img/hlt_dfd.png)

Due to the time limitation, there are still lots of thing I didn't implemented: unit tests, Playwright for e2e testing, docker files, etc. Hope this project could show the rough ideas of my design.

## Some thoughts during the development

I spent the first two days trying the loopback.js framework. It's an awesome framework for team working, provides a powerful cli tool to generate most boilerplate codes, which helps aligning every developer's codes. It's also an opinionated framework imo. And that's why I gave it up at last. For a small demo project it's a little bit heavy, and for beginner like me it's hard to show my own ideas through it.

Then I put my eyes on Next. I've heard about it a lot but haven't got chances to try it. It seems like very suitable for small project. So I spent the next two days following the tutorial. It was a pleasant experience. The idea of mixing server side rendering and client side rendering is very interesting. But I'm not sure if it's a good choice for a larger project. Accessing database from front-end (although it's placed in a "server-side" part) seems too It may lead to a "big ball of mud" code base very easily. That's why I built a pure back-end server with Nest. Once I found the Next part take too much responsibility, I can easily replace most business logic with RESTful APIs calling.