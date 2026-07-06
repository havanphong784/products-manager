const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {

  // init table
  const dataRecords = document.querySelector("[data-records]");
  if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    records.forEach((record, index) => {
      const permissions = record.permissions;
      permissions.forEach(permission => {
        const row = tablePermissions.querySelector(`[data-name=${permission}]`);
        const input = row.querySelectorAll("input")[index];
        input.checked = true;
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
