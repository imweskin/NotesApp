let addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupCloseBtn = document.querySelector(".popup i"),
popupTitle = document.querySelector(".popup h3"),
addNoteBtn = document.querySelector(".popup button"),
input = document.querySelector(".popup input"),
textarea = document.querySelector(".popup textarea"),
wrapper = document.querySelector(".wrapper");

const months = ["January","February","March","April","June","July","August","September","October","Novemeber","December"];
//getting localstorage notes if exist and parsing them to js object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

function showNotes() {
    //deleting old notes before adding new ones to avoid duplicates
    document.querySelectorAll(".note").forEach((note) => {
        note.remove();
    });

    notes.forEach((note, index) => {
        let noteDiv = `<div class="note">
                            <div class="details">
                                <h3 class="title">${note.title}</h3>
                                <p class="description">${note.description}</p>
                            </div>
                            <div class="bottom-content">
                                <span class="date">${note.date}</span>
                                <div class="settings">
                                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                    <ul class="menu">
                                        <li onclick="editNote(${index},'${note.title}', '${note.description}')" class="edit">
                                            <i class="uil uil-pen"></i>
                                            <span>Edit</span>
                                        </li>
                                        <li onclick="deleteNote(${index})" class="delete">
                                            <i class="uil uil-trash"></i>
                                            <span>Delete</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>`;
        
        addBox.insertAdjacentHTML("afterend",noteDiv);
    });


};

showNotes();

addBox.onclick = () => {
    addNoteBtn.innerText = "add note";
    popupTitle.innerText = "Add a new note";
    popupBox.classList.add("show");
    input.focus();
};

popupCloseBtn.onclick = () => {
    isUpdate = false;
    input.value = "";
    textarea.value = "";
    addNoteBtn.innerText = "Update Note";
    popupTitle.innerText = "Update Note";
    popupBox.classList.remove("show");
};

addNoteBtn.onclick = (e) => {
    //prevent form from submitting
    e.preventDefault();
    //get title and description from input
    let noteTitle = input.value;
    let noteDescription = textarea.value;
    //test so that one of them has to be filled
    if(noteTitle || noteDescription) {
        //get current date
        let noteDate = new Date(),
        month = months[noteDate.getMonth()],
        day = noteDate.getDate(),
        year = noteDate.getFullYear();
        //create note object
        let note = {
            "title" : noteTitle,
            "description" : noteDescription,
            "date" : `${month} ${day}, ${year}`
        };
        if(!isUpdate) {
            //adding note
            notes.push(note);
        } else {
            //update specefied note
            notes[updateId] = note;
            //resetting update state to false cuz if not next time user wants to add, it updates
            isUpdate = false;
        }
        //save notes in localStorage
        window.localStorage.setItem("notes",JSON.stringify(notes));
        //close popup
        popupCloseBtn.click();
        //update notes
        showNotes();
    }
};

function showMenu(icon) {
    icon.parentElement.classList.add("show");
    //hiding menu on document click
    document.addEventListener("click", (e) => {
        if(e.target.tagName != "I" || e.target != icon) {
            icon.parentElement.classList.remove("show");
        }
    });
};

function deleteNote(noteIndex) {
    let confirmDelete = confirm("Are you sure you want to delete this note ?");
    if(!confirmDelete) {
        return;
    }
    //delete selected note
    notes.splice(noteIndex,1);
    //update localstorage
    window.localStorage.setItem("notes",JSON.stringify(notes));
    //update notes
    showNotes();
};

function editNote(noteIndex,noteTitle,noteDescription) {
    isUpdate = true;
    updateId = noteIndex;
    addBox.click();
    addNoteBtn.innerText = "Update Note";
    popupTitle.innerText = "Update Note";
    input.value = noteTitle;
    textarea.value = noteDescription;
    input.focus();
};
