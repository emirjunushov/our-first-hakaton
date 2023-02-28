let API = "http://localhost:8000/hakaton";
// !для фокуса не трогай
function focusOutFunction(e) {
  if (e.value.length > 0) {
    let nameLabel = document.querySelectorAll("#name-label");
    nameLabel.forEach((item) => {
      item.style.top = "-19px";
      item.style.left = "-19px";
    });
  }
}
// !для фокуса не трогай
