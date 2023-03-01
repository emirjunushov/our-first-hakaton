const api = "http://localhost:8000/hakaton";

function focusOutFunction(e) {
  if (e.value.length > 0) {
    let nameLabel = document.querySelectorAll("#name-label");
    nameLabel.forEach((item) => {
      item.style.top = "-19px";
      item.style.left = "-19px";
    });
  }
}
//переменные для инпутов добавление товаров
const inputAll = document.querySelectorAll(".input-addcontacts");
const btnAdd = document.querySelector(".btnAdd");
const list = document.querySelector("#product-list");

//?search
let searchInp = document.querySelector("#search");
let searchVal = "";
//!============================вешаю слушатель событий всем инпутам==========================
btnAdd.addEventListener("click", () => {
  const newObj = {};
  inputAll.forEach((item) => {
    newObj[item.name] = item.value;
  });
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newObj),
  });
  inputAll.forEach((item) => {
    item.value = "";
  });
  render();
});
//!==========================функция для отоброжения карточек продукта============================
async function render() {
  let res = await fetch(`${api}?q=${searchVal}&_page=${curentPage}&_limit=3`);

  let products = await res.json();

  drawPaginationButtons();
  list.innerHTML = "";
  products.forEach((element) => {
    let newElem = document.createElement("div");

    newElem.id = element.id;

    newElem.innerHTML = `
    <div class="card" style="width: 17rem; margin: 2rem;text-align: center;background: transparent; border: 2px solid white   ">
    <img src=${element.photo} class="card-img-top" style="width: 125px;
    border-radius: 50%;     margin-left: 26%;
    height: 125px; object-fit: cover;" alt="...">
    <ul class="list-group list-group-flush">
      <li class="list-group-item" style="background: transparent;
      color: white;">${element.name}</li>
      <li class="list-group-item" style="background: transparent;
      color: white;">${element.surname}</li>
      <li class="list-group-item" style="background: transparent;
      color: white;">${element.number}</li>
      <li class="list-group-item" style="background: transparent;
      color: white;">${element.email}</li>
    </ul>
    <div class="card-body">
    <button onclick="deleteTodo(${element.id})" class="btn-delete" style="    background: transparent;
    color: white;
    border: 1px solid white;
    width: 72px;">
    Delete
  </button>
   <button
  style="    background: transparent;
  color: white;
  border: 1px solid white;
  width: 72px;" onclick ="editTodo(${element.id})" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
  <button id="sign-btn"
   style="    background: transparent;
  color: white;
  border: 1px solid white;
  width: 72px;"  ><a   href="./index.html" style="text-decoration: none; color: white">Sign in</a> </button>
  </div>

    </div>
  </div>
     `;

    list.append(newElem);
  });
}
render();

async function deleteTodo(id) {
  try {
    await fetch(`${api}/${id}`, { method: "DELETE" });
    render();
  } catch (error) {
    console.log(error);
  }
}

// !=============================modal==========================

let inpEdit = document.querySelectorAll(".inp-edit");
let saveBtn = document.querySelector(".save-btn");
let editModal = document.querySelector("#exampleModal");

let editedObj = {};

inpEdit.forEach((item) => {
  item.addEventListener("input", (e) => {
    editedObj[e.target.name] = e.target.value;
  });
});
console.log(editedObj);

async function editTodo(id) {
  try {
    let res = await fetch(`${api}/${id}`);

    let objToEdit = await res.json();
    console.log(objToEdit);

    inpEdit.forEach((i) => {
      i.value = objToEdit[i.name];
    });
    saveBtn.setAttribute("id", `${id}`);
  } catch (error) {
    console.log(error);
  }
}

saveBtn.addEventListener("click", async (e) => {
  let id = e.target.id;
  try {
    await fetch(`${api}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedObj),
    });
  } catch (error) {
    console.log(error);
  }
  render();
  let modal = bootstrap.Modal.getInstance(editModal);
  modal.hide();
});

//!=============================pagination=============================

let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let curentPage = 1;
let pageTotalCount = 0;

function drawPaginationButtons() {
  fetch(`${api}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3);
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (curentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `
            <li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>
            `;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `
            <li class="page-item "><a class="page-link page_number" href="#">${i}</a></li>
            `;
          paginationList.append(page1);
        }
      }
      if (curentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }
      if (curentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}
prev.addEventListener("click", () => {
  if (curentPage <= 1) {
    return;
  }
  curentPage--;
  render();
});
next.addEventListener("click", () => {
  if (curentPage >= pageTotalCount) {
    return;
  }
  curentPage++;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    curentPage = e.target.innerText;
    render();
  }
});
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});

render();
