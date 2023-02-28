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
//получаем список продуктов с сервера
async function render() {
  let res = await fetch(`${api}?q=${searchVal}&_page=${curentPage}&_limit=3`);
  let products = await res.json();
  drawPaginationButtons();
  //очишаем list
  list.innerHTML = "";
  //перебираем масив products
  products.forEach((element) => {
    //создаем новый див
    let newElem = document.createElement("div");

    //создаем id новому div'у
    newElem.id = element.id;
    //помещаем карточку из bs в созданный div
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
  <button class="btn-edit" style=" background: transparent;
  color: white;
  border: 1px solid white;
  width: 72px;" id=${element.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">edit</button></div>

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
// !=============================modal============================
let editname = document.querySelector("#edit-name");
let editsurname = document.querySelector("#edit-surname");
let editphoto = document.querySelector("#edit-image");
let editphone = document.querySelector("#edit-phone");
let editemail = document.querySelector("#edit-email");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;

    fetch(`${api}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        (editname = data.name),
          (editsurname.value = data.surname),
          (editphoto.value = data.image),
          (editphone.value = data.phone),
          (editemail.value = data.email);

        editSaveBtn.id = data.id;
      });
  }
});
//функция для отправки отредактированных данных на сервер
editSaveBtn.addEventListener("click", (e) => {
  console.log("emirs");
  let id = e.target.id;
  let name = editname.value;
  let surname = editsurname.value;
  let photo = editphoto.value;
  let phone = editphone.value;
  let email = editemail.value;
  if (!name || !photo || !surname || !phone || !email) {
    alert("заполните поле");
    return;
  }
  let editedProduct = {
    name: name,
    surname: surname,
    photo: image,
    phone: phone,
    email: email,
  };
  saveEdit(editedProduct, id);
});
function saveEdit(editedProduct, id) {
  fetch(`${api}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => render());
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

//!=============================pagination=============================

let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let curentPage = 1;
let pageTotalCount = 0;
//функция для отрисовки кнопок пагинации

function drawPaginationButtons() {
  //отправляем запрос для получения обшего кол-во продуктов

  fetch(`${api}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      //рассчитываем обшее кол-во страниц

      pageTotalCount = Math.ceil(data.length / 3);
      paginationList.innerHTML = ""; //очищаем

      for (let i = 1; i <= pageTotalCount; i++) {
        //создаем кнопки с цифрами и для текуший страницы задаем класс active
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
      //красим серый цвет prev/next кнопки
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
//слущатель событий для кнопкми prev

prev.addEventListener("click", () => {
  //делаем проверку на то не находимся ли мы на первой странице
  if (curentPage <= 1) {
    return;
  }
  //если не нахадоимся на первой странице то перезаписываем curenyPage и вызываем render()

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
  //отлавоиваем клик по цифре из пагинации

  if (e.target.classList.contains("page_number")) {
    //перезаписываем на то значения corent page которое содержит элемент на который наджали
    curentPage = e.target.innerText;
    //вызываем render с пепзаписсанным currentPage
    render();
  }
});
//search
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});
render();
