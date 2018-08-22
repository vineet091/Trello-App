window.onload = function () {
  var trelloObj = new TrelloClass();
  let addtodoBtns = document.getElementsByClassName('btn-add')
  for (var i = 0; i < addtodoBtns.length; i++) {
      addtodoBtns[i].addEventListener('click', function(ev) {
        const btnIndex = this.getAttribute("data-index");
        console.log(btnIndex);
        trelloObj.openAddCard(this, btnIndex);
     }
  )

}
  let addTextBoxs = document.getElementsByClassName('card-textbox')
  for (var i = 0; i < addTextBoxs.length; i++) {
      addTextBoxs[i].addEventListener('keypress', function (evt) {
      evt = evt || window.event;
      if (evt.keyCode === 13) {
        const boxIndex = this.getAttribute("data-index");
        trelloObj.addCard(evt.target.value, boxIndex)
         let addBox = null;
      if(boxIndex === "1") {
        addbox = document.getElementById('add-todo-box');
      } else if(boxIndex === "2") {
        addbox = document.getElementById('add-progress-box');
      } else if(boxIndex === "3") {
        addbox = document.getElementById('add-done-box');
      }
     evt.target.value = '';
      addbox.className = 'compose-box hide'   
      }
      evt.stopPropagation();
      return false;
    }, false)
  }

}

function TrelloClass() {
   const _self = this;
    let dragSrcEl = null;
  this.openAddCard = (btn, btnIndex) => {
    let addBox = null;
    let textbox = null;
      if(btnIndex === "1") {
        addbox = document.getElementById('add-todo-box');
        textbox = document.getElementById('add-todo-textbox');
      } else if(btnIndex === "2") {
        addbox = document.getElementById('add-progress-box');
        textbox = document.getElementById('add-progress-textbox');
      } else if(btnIndex === "3") {
        addbox = document.getElementById('add-done-box');
        textbox = document.getElementById('add-done-textbox');
      }
      textbox.value = "";
      addbox.className = 'compose-box';
            textbox.focus();  

  }
  this.addCard = (value, listIndex) => {
    let cardbox = document.createElement('li');
    cardbox.setAttribute('draggable', true);
    cardbox.className = 'li-item';
    let cardLabel = document.createElement('span');
    cardLabel.className = 'card-label';
    cardLabel.innerText = value;

    let editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'card-edit hide';
    editInput.addEventListener('keypress', function (evt) {
      evt = evt || window.event;
      if (evt.keyCode === 13) {
      evt.preventDefault();
      const regex = /show/g
            cardLabel.innerText = editInput.value;
            editInput.value = '';
            editInput.className = 'card-edit hide';
            cardLabel.className = 'card-label';
            cancelEdit.className = 'btn-cancel-edit btn-action hide';
            editButton.className = 'btn-card-edit btn-action';
 
      }
      evt.stopPropagation();
      return false;
    }, false)
    let editButton = document.createElement('button');
    editButton.className = 'btn-card-edit btn-action';
    editButton.innerText = 'Edit'
    let cancelEdit = document.createElement('button');
    cancelEdit.className = 'btn-cancel-edit btn-action hide';
    cancelEdit.innerText = 'Cancel';
    let deleteButton = document.createElement('button');
    deleteButton.className = 'btn-card-delete btn-action';
    deleteButton.innerText = 'Delete';
    let btnBox = document.createElement('span')
    btnBox.className = 'btn-box';

    editButton.addEventListener('click', function () {
      cardLabel.className = 'card-label hide';
      editInput.value = cardLabel.innerText;
      editInput.className = 'card-edit show';
      this.className = 'btn-card-edit btn-action hide';
      cancelEdit.className = 'btn-cancel-edit btn-action show';
    }, false);
    cancelEdit.addEventListener('click', function () {
      editInput.value = '';
      editInput.className = 'card-edit hide';
      cardLabel.className = 'card-label';
      this.className = 'btn-cancel-edit btn-action hide'
      editButton.className = 'btn-card-edit btn-action';
    }, false);
      let cardId = null;
            if(listIndex === "1") {
        cardId = 'todo-card-list';
      } else if(listIndex === "2") {
        cardId = 'progress-card-list';
      } else if(listIndex === "3") {
        cardId = 'done-card-list';
      }
      let cardList = document.getElementById(cardId);
    deleteButton.addEventListener('click', function () {
      _li = this.parentNode.parentNode
      cardList.removeChild(_li);
    }, false);

    cardbox.addEventListener('click', function (ev) {
      ev.preventDefault();
      const regex = /show/g
      if(ev.target.tagName === 'LI' && regex.test(editInput.className)) {
            cardLabel.innerText = editInput.value;
            editInput.value = '';
            editInput.className = 'card-edit hide';
            cardLabel.className = 'card-label';
            cancelEdit.className = 'btn-cancel-edit btn-action hide';
            editButton.className = 'btn-card-edit btn-action';

      }
    }, false);


    cardbox.appendChild(cardLabel);
    cardbox.appendChild(editInput)
    btnBox.appendChild(editButton);
    btnBox.appendChild(cancelEdit);
    btnBox.appendChild(document.createTextNode(' | '));
    btnBox.appendChild(deleteButton);
    cardbox.appendChild(btnBox);
    addDnDHandlers(cardbox);
    cardList.appendChild(cardbox);

  }

}
var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('over');

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    //alert(this.outerHTML);
    //dragSrcEl.innerHTML = this.innerHTML;
    //this.innerHTML = e.dataTransfer.getData('text/html');
    this.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin',dropHTML);
    var dropElem = this.previousSibling;
    addDnDHandlers(dropElem);
    
  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
  this.classList.remove('over');

  /*[].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });*/
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);

}



