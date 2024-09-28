const Modal = new bootstrap.Modal(document.getElementById('Modal'), {
    keyboard: false
})
const notificationModal = new bootstrap.Modal(document.getElementById('notification-modal'), {
    keyboard: false
})

const tableBody = document.getElementById("table-body")
const form = document.forms.form
const modalTitle = document.getElementById("modal-title")
const modalFooter = document.getElementById("modal-footer")
const notificationText = document.getElementById("notificationText")

var authorList = [];

getAuthorsData()



function showNotificationWithText(text) {
    notificationText.innerText = text
    notificationModal.show()
}

function clearTable() {
    while (tableBody.firstChild) {
        tableBody.firstChild.remove()
    }
}

function fillTable() {
    authorList.forEach(element => {
        let rowElement = document.createElement("tr")
        tableBody.appendChild(rowElement)

        rowElement.innerHTML = '<th scope="row" class="align-middle">' + element.id
            + '</th><td class="align-middle">' + element.fullName
            + '</td><td class="align-middle">' + element.birthDate
            + '</td><td class="align-middle"><button type="button" onClick="openDetailsModal(' + element.id
            + ')" id="Details" class="btn btn-info me-2">Деталі</button><button type="button" onClick="openEditModal(' + element.id
            + ')" id="Edit" class="btn btn-warning me-2">Редагувати</button><button type="button" onClick="openDeleteModal(' + element.id
            + ')" id="Delete" class="btn btn-danger me-2">Видалити</button></td>'
    })
}

function reloadTable(data) {
    authorList = data
    clearTable()
    fillTable()
}

async function getAuthorsData() {
    let response = await fetch(apiIP+'/api/Authors', {
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

async function createAuthor() {
    let queryBody = {
        fullName: form.elements.fullName.value,
        birthDate: form.elements.birthDate.value
    }

    let response = await fetch(apiIP+'/api/Authors/Create', {
        method: 'POST',
        body: JSON.stringify(queryBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        getAuthorsData()
    } else {
        showNotificationWithText(await response.text())
    }
}

async function deleteAuthor() {
    let response = await fetch(apiIP+'/api/Authors/Delete/' + form.elements.id.value, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        getAuthorsData()
    } else {
        showNotificationWithText(await response.text())
    }
}

async function editAuthor() {
    let queryBody = {
        id: form.elements.id.value,
        fullName: form.elements.fullName.value,
        birthDate: form.elements.birthDate.value
    }

    let response = await fetch(apiIP+'/api/Authors/Edit', {
        method: 'PUT',
        body: JSON.stringify(queryBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        getAuthorsData()
    } else {
        showNotificationWithText(await response.text())
    }
}

function openDetailsModal(id) {
    let element = getElementById(authorList, id)

    openModal('Деталі', '', element.id, true, element.fullName, true, element.birthDate, true)
}

function openEditModal(id) {
    let element = getElementById(authorList, id)

    openModal('Редагування', '<button name="submitButton" type="button" class="btn btn-warning" onclick="editAuthor()">Редагувати</button>',
        element.id, true, element.fullName, false, element.birthDate, false
    )
}

function openDeleteModal(id) {
    let element = getElementById(authorList, id)

    openModal('Видалення', '<button name="submitButton" type="button" class="btn btn-danger" onclick="deleteAuthor()">Видалити</button>',
        element.id, true, element.fullName, true, element.birthDate, true
    )
}

function openCreateModal() {
    openModal('Створення', '<button name="submitButton" type="button" class="btn btn-primary" onclick="createAuthor()">Створити</button>',
        '', true, '', false, '', false
    )
}

function openModal(textContent, html, idVal, isIDDisabled, fullNameVal, isFullNameDisabled, birthDateVal, isBirthDateDisabled) {
    modalTitle.textContent = textContent
    if (form.elements.submitButton) {
        form.elements.submitButton.remove()
    }

    modalFooter.innerHTML += html

    form.elements.id.value = idVal
    form.elements.id.disabled = isIDDisabled
    form.elements.fullName.value = fullNameVal
    form.elements.fullName.disabled = isFullNameDisabled
    form.elements.birthDate.value = birthDateVal
    form.elements.birthDate.disabled = isBirthDateDisabled

    Modal.show()
}

function getElementById(list, id) {
    for (obj of list) {
        if (obj.id === id) {
            return obj
        }
    }
}