const http = require("http");
const Koa = require("koa");
const app = new Koa();
const koaBody = require("koa-body");

app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
  })
);

const tickets = [
  {
    id: 1,
    name: "Тест 1",
    status: "",
    created: "01.06.2021",
  },
  {
    id: 2,
    name: "Тест 2",
    status: "checked",
    created: "02.06.2021",
  },
  {
    id: 3,
    name: "Тест 3",
    status: "",
    created: "03.06.2021",
  },
  {
    id: 4,
    name: "Тест 4",
    status: "checked",
    created: "04.06.2021",
  },
  {
    id: 5,
    name: "Тест 5",
    status: "",
    created: "05.06.2021",
  },
];

const ticketsAll = [
  {
    id: 1,
    description: "полное описание 1",
  },
  {
    id: 2,
    description: "полное описание 2 ",
  },
  {
    id: 3,
    description: "полное описание 3",
  },
  {
    id: 4,
    description: "полное описание 4 ",
  },
  {
    id: 5,
    description: "полное описание 5",
  },
];

app.use(async (ctx) => {
  if (ctx.request.method === 'GET') ({ method, id, name, description, created } = ctx.request.query);
  else if (ctx.request.method === 'POST') ({ method, id, name, description, created } = ctx.request.body);

  let date = new Date().toLocaleString();
  ctx.response.set({
    "Access-Control-Allow-Origin": "*",
  });

  switch (method) {
    case "allTickets":
      ctx.response.body = tickets;
      ctx.response.status = 200;
      return;
    case "ticketById&id":
      let ticketsAllElement = ticketsAll.find((value) => value.id == id);
      ctx.response.body = ticketsAllElement;
      ctx.response.status = 200;
      return;
    case "createTicket":
      tickets.push({
        id: tickets.length + 1,
        name: name,
        status: "",
        created: date,
      });

      ticketsAll.push({
        id: ticketsAll.length + 1,
        name: name,
        description: description,
        status: true,
        created: date,
      });

      ctx.response.body = tickets;
      ctx.response.status = 200;
      return;
    case "editTicket":
      let idTicket = tickets.findIndex((ticket) => ticket.id == id);
      tickets[idTicket].name = name;
      tickets[idTicket].created = date;
      ticketsAll[idTicket].description = description;

      ctx.response.body = tickets;
      ctx.response.status = 200;
      return;
    case "deleteTicket":
      let idTicketDelete = tickets.findIndex((ticket) => ticket.id == id);
      tickets.splice(idTicketDelete, 1);
      ticketsAll.splice(idTicketDelete, 1);
      ctx.response.body = tickets;
      ctx.response.status = 200;
      return;
    default:
      ctx.response.status = 404;
      ctx.response.body = `Unknown method '${method}' in request parameters`;
      return;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port, () => {
  console.log(`Server ready and listening on ${port}`);
});
