const http = require("http");
const Koa = require("koa");
const app = new Koa();
const koaBody = require("koa-body");
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port, () => {
  console.log(`Server ready and listening on ${port}`);
});

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

class TicketController {

  allTickets() {
    return tickets;
  }

  ticketByIdId(value) {
    const {id} = value;
    const ticketsAllElement = ticketsAll.find((e) => e.id == id);
    return ticketsAllElement;
  }

  createTicket(value) {
    let {name, description} = value;
    tickets.push({
      id: tickets.length + 1,
      name: name,
      status: "",
      created: new Date().toLocaleString(),
    });

    ticketsAll.push({
      id: ticketsAll.length + 1,
      name: name,
      description: description,
      status: true,
      created: new Date().toLocaleString(),
    });

    return tickets;
  }

  editTicket(value) {
    const {id, name, description} = value;
    let idTicket = tickets.findIndex((ticket) => ticket.id == id);

    tickets[idTicket].name = name;
    tickets[idTicket].created = new Date().toLocaleString();
    ticketsAll[idTicket].description = description;

    return tickets;
  }

  deleteTicket(value) {
    const {id} = value;
    let idTicketDelete = tickets.findIndex((ticket) => ticket.id == id);

    tickets.splice(idTicketDelete, 1);
    ticketsAll.splice(idTicketDelete, 1);

    return tickets;
  }
}

const ticketController = new TicketController();

app.use(async (ctx) => {
  if (ctx.request.method === 'GET') ({ method} = ctx.request.query);
  else if (ctx.request.method === 'POST') ({ method } = ctx.request.body);
  
  ctx.response.set({
    "Access-Control-Allow-Origin": "*",
  });

  switch (method) {
    case "allTickets": ctx.response.body = ticketController.allTickets();
      return;
    case "ticketById&id": ctx.response.body = ticketController.ticketByIdId(ctx.request.query);
      return;
    case "createTicket": ctx.response.body = ticketController.createTicket(ctx.request.body);
      return;
    case "editTicket": ctx.response.body = ticketController.editTicket(ctx.request.body);
      return;
    case "deleteTicket": ctx.response.body = ticketController.deleteTicket(ctx.request.body);
     return;
    default:
      ctx.response.body = `Unknown method '${method}' in request parameters`;
      ctx.response.status = 400;
      break;
  }
});