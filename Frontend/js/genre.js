const Modal = new bootstrap.Modal(document.getElementById('Modal'), {
    keyboard: false
})
const tableBody = document.getElementById("table-body")
const form = document.forms.form
const modalTitle = document.getElementById("modal-title")
const modalFooter = document.getElementById("modal-footer")
const notificationModal = new bootstrap.Modal(document.getElementById('notification-modal'), {
    keyboard: false
})
const notificationText = document.getElementById("notificationText")

var genreList = [];


getGenresData()

async function showNotificationWithText(text) {
    notificationText.innerHTML = text
    notificationModal.show()
}

function clearTable() {
    while (tableBody.firstChild) {
        tableBody.firstChild.remove()
    }
}

function fillTable() {
    genreList.forEach(element => {
        let rowElement = document.createElement("tr")
        tableBody.appendChild(rowElement)

        rowElement.innerHTML = '<th scope="row" class="align-middle">' + element.id
            + '</th><td class="align-middle">' + element.name
            + '</td><td class="align-middle"><button type="button" onClick="openDetailsModal(' + element.id + ')" id="Details" class="btn btn-info me-2">Деталі</button>'
            + '<button type="button" onClick="openEditModal(' + element.id + ')" id="Edit" class="btn btn-warning me-2">Редагувати</button>'
            + '<button type="button" onClick="openDeleteModal(' + element.id + ')" id="Delete" class="btn btn-danger me-2">Видалити</button></td>'
    })
}

function reloadTable(data) {
    genreList = data
    clearTable()
    fillTable(genreList)
}

async function getGenresData() {
    let response = await fetch(apiIP+'/api/Genres', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    if (response.ok) {
        let json = await response.json();
        reloadTable(json)
    } else {
        showNotificationWithText(await response.text())
    }
}

async function createGenre() {
    let queryBody = {
        name: form.elements.name.value
    }

    let response = await fetch(apiIP+'/api/Genres/Create', {
        method: 'POST',
        body: JSON.stringify(queryBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        getGenresData()
    } else {
        showNotificationWithText(await response.text())
    }
}

async function deleteGenre() {
    let response = await fetch(apiIP+'/api/Genres/Delete/' + form.elements.id.value, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        getGenresData()
    } else {
        showNotificationWithText(await response.text())
    }
}

async function editGenre() {
    let queryBody = {
        id: form.elements.id.value,
        name: form.elements.name.value
    }

    let response = await fetch(apiIP+'/api/Genres/Edit', {
        method: 'PUT',
        body: JSON.stringify(queryBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        getGenresData()
    } else {
        showNotificationWithText(await response.text())
    }
}

function openDetailsModal(id) {
    let element = getElementById(genreList, id)

    openModal('Деталі', '', element.id, true, element.name, true)
}

function openEditModal(id) {
    let element = getElementById(genreList, id)

    openModal('Редагування', '<button name="submitButton" type="button" class="btn btn-warning" onclick="editGenre()">Редагувати</button>',
        element.id, true, element.name, false
    )
}

function openDeleteModal(id) {
    let element = getElementById(genreList, id)

    openModal('Видалення', '<button name="submitButton" type="button" class="btn btn-danger" onclick="deleteGenre()">Видалити</button>',
        element.id, true, element.name, true
    )
}

function openCreateModal() {
    openModal('Створення', '<button name="submitButton" type="button" class="btn btn-primary" onclick="createGenre()">Створити</button>',
        '', true, '', false
    )
}

function openModal(textContent, html, idVal, isIDDisabled, nameVal, isNameDisabled) {
    modalTitle.textContent = textContent
    if (form.elements.submitButton) {
        form.elements.submitButton.remove()
    }

    modalFooter.innerHTML += html

    form.elements.id.value = idVal
    form.elements.id.disabled = isIDDisabled
    form.elements.name.value = nameVal
    form.elements.name.disabled = isNameDisabled

    Modal.show()
}

function getElementById(list, id) {
    for (obj of list) {
        if (obj.id === id) {
            return obj
        }
    }
}