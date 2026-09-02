const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {

  // init table
  const dataRecords = document.querySelector("[data-records]");
  if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    records.forEach((record, index) => {
      const permissions = record.permissions;
      permissions.forEach(permission => {
        const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
        if (!row) return;
        const input = row.querySelectorAll("input")[index];
        if (input) input.checked = true;
      })
    })
  }

  // event submit
  const button = document.querySelector("[button-submit]");
  button.addEventListener("click", (e) => {
    let permissionsArray = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name == "id") {
        inputs.forEach(input => {
          const id = input.value;
          permissionsArray.push({id, permissions: []});
        })
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permissionsArray[index].permissions.push(name)
          }
        })
      }
    })

    if (permissionsArray.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions");
      const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
      inputPermissions.value = JSON.stringify(permissionsArray)
      formChangePermissions.submit();
    }
  })
  
}

// Xóa bản ghi
const buttonDeletes = document.querySelectorAll("[button-delete]");
if (buttonDeletes.length > 0) {
  const formDelete = document.querySelector("#form-delete-item");
  const path = formDelete.getAttribute("data-path");

  buttonDeletes.forEach(button => {
    button.addEventListener("click", (e) => {
      const cf = confirm("Bạn có chắc chắn muốn xóa nhóm quyền này không?");
      if (cf) {
        const id = button.getAttribute("data-id");
        formDelete.action = path + `${id}?_method=DELETE`;
        formDelete.submit();
      }
    })
  })
}
